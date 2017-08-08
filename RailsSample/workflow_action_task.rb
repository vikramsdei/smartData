class WorkflowActionTask < WorkflowAction
  property :task_type,
           type: 'select',
           required: true,
           label: 'Task type',
           configuration: true,
           values: -> (_) { task_values }
  property :workflow_description,
           type: 'select',
           label: 'Description Type',
           required: true,
           configuration: true,
           reloadable: true,
           disabled: -> (workflow_action) { workflow_card_form_submission?(workflow_action) && !workflow_description?(workflow_action) },
           values: %w(Standard Custom),
           if: -> (workflow_action) { workflow_card_form_submission?(workflow_action) }
  property :description,
           type: 'string',
           required: true,
           label: 'Description',
           configuration: true,
           if: -> (workflow_action) { show_workflow_description?(workflow_action) }
  property :description_label,
           type: 'alert',
           values: 'The user response to the associated form to the question type workflow_description will be displayed in the task',
           if: -> (workflow_action) { workflow_card_form_submission?(workflow_action) && workflow_description?(workflow_action) && workflow_action&.configuration_value(:workflow_description) == 'Custom' }
  property :due_based_on,
           type: 'select',
           label: 'Due date based on',
           configuration: true,
           required: true,
           reloadable: true,
           values: -> (workflow_action) { due_based_on_values(workflow_action) }
  property :date_question,
           type: 'select',
           label: 'question',
           configuration: true,
           required: true,
           values: -> (workflow_action) { date_question_values(workflow_action) },
           if: (lambda do |workflow_action|
                  workflow_action.configuration_value(:due_based_on) == 'Answer to datefield question'
                end)
  property :due_in,
           type: 'string',
           label: 'Due Date Additional Days',
           configuration: true,
           required: true,
           digits: true
  property :assign_user,
           type: 'checkbox',
           label: 'Assign task to the user selected in the form',
           configuration: true,
           if: -> (workflow_action) { has_user_list_question?(workflow_action) }
  property :form_type,
           type: 'select',
           label: 'Form type',
           configuration: true,
           reloadable: true,
           values: ['Standard form', 'Form template']
  property :form_id,
           type: 'select',
           label: 'Form',
           required: true,
           configuration: true,
           values: -> (workflow_action) { form_values(workflow_action) },
           if: -> (workflow_card) { workflow_card.configuration_value(:form_type) == 'Standard form' }
  property :form_template_id,
           type: 'select',
           label: 'Form template',
           required: true,
           configuration: true,
           values: -> (workflow_action) { form_template_values(workflow_action) },
           if: -> (workflow_card) { workflow_card.configuration_value(:form_type) == 'Form template' }

  class << self
    def run!(instance, target)
      owner = current_owner(target)
      return unless owner
      current_user = get_current_user(target)
      attributes = {
        task_type: instance.configuration_value('task_type'),
        description: task_description(instance, target),
        workflow_id: instance.workflow.id,
        due: due(instance, target)
      }
      if instance.configuration_value('assign_user').present? && get_submission_user(target).present?
        attributes[:assigned_to_id] = get_submission_user(target).id
      elsif [ContractEmployer, User].include?(owner.class)
        attributes[:assigned_to_id] = current_user.id
      end
      if instance.configuration_value('form_id').present?
        form = Form.where(id: instance.configuration_value('form_id')).last
        if form&.available_for_referral?(owner)
          attributes[:form_id] = form.id
          attributes[:task_type] = 'Form'
        end
      elsif instance.configuration_value('form_template_id').present?
        attributes[:form_template_id] = instance.configuration_value('form_template_id')
        attributes[:task_type] = 'FormTemplate'
      end
      if target.is_a?(ActivityShortList)
        attributes[:target_type] = 'Activity'
        attributes[:target_id] = target.activity.id
      end

      task = owner.tasks.new attributes
      task_class = "WorkflowCard#{instance.id}CustomTask"
      task.type = task_class if TaskState.where(task_class: task_class).present?
      task.owner = owner if owner.is_a?(User)

      task.save!
    end

    def humanize(workflow_action)
      task_type = workflow_action.configuration_value(:task_type)
      description = workflow_action.configuration_value(:description)
      due_in = workflow_action.configuration_value(:due_in)
      if form_id = workflow_action.configuration_value(:form_id)
        form_name = Form.where(id: form_id).last&.name || '(deleted)'
      elsif form_template_id = workflow_action.configuration_value(:form_template_id)
        form_name = FormTemplate.where(id: form_template_id).last&.name || '(deleted)'
      end
      humanize = "Create <strong>Task</strong> of type <strong>#{task_type}</strong>"
      humanize += " - <strong>#{description}</strong> - due in <strong>#{due_in} days</strong>"
      humanize += " linked to <strong>#{form_name}</strong>." if form_name
      humanize
    end

    def name
      'Task action'
    end

    private

    def form_values(workflow_action)
      forms = []
      workflow_action.contracts&.each do |contract|
        contract.forms.active.each { |form| forms << [form.name, form.id] }
        Form
          .active
          .all
          .select { |f| f.is_public? && f.organisations.empty? }
          .each { |form| forms << [form.name, form.id] }
      end
      forms.uniq.sort_by(&:first)
    end

    def form_template_values(workflow_action)
      if workflow_action.contracts
        organisation_ids = workflow_action.contracts.map(&:organisation_id)
        FormTemplate.where(organisation_id: organisation_ids).order(name: :asc).map do |form_template|
          [form_template.name, form_template.id]
        end
      end || []
    end

    def task_values
      Task::TASK_TYPES.map { |x| [x, x] }
    end

    def due_based_on_values(workflow_action)
      values = ['Triggering of Card']
      if workflow_action.workflow_card && workflow_action.workflow_card.class_type == 'WorkflowCardFormSubmission'
        values << 'Answer to datefield question'
      end
      values
    end

    def date_question_values(workflow_action)
      result = []
      if workflow_action.workflow_card&.target_id
        form = Form.find_by(id: workflow_action.workflow_card.target_id)
        form&.questions&.each do |question|
          result = generate_nested_form_question(question, result)
        end
        #   &.form_questions
        #   &.where(question_type: 'datefield')
        #   &.map do |question|
        #     [question.question, question.id]
        #   end
      end
      result
    end

    def generate_nested_form_question(question, result = [], level = 0)
      result << [
        select_question_indented(question.question.to_s.truncate(100), level), question.id, datetime_options(question)
      ]
      question.answers.find_each do |answer|
        result << [
          select_question_indented(answer.answer.truncate(100), level + 1), answer.answer, { disabled: 'disabled' }
        ]
        answer.form_questions.find_each do |form_question|
          result = generate_nested_form_question(form_question, result, level + 2)
        end
      end
      result
    end

    def datetime_options(question)
      options = { value: question.code }
      return options if %w(datefield).include?(question.question_type)
      options.merge!(disabled: 'disabled')
    end

    def select_question_indented(title, level)
      title = ActionController::Base.helpers.simple_format("#{'&nbsp;' * 4 * level} \\- #{title}") if level > 0
      title
    end

    def current_owner(target)
      current_owner = case target
                      when Client
                        target.task_owner
                      when Referral
                        target.client.task_owner
                      when ClientDetails
                        target.client.task_owner
                      when ActivityShortList
                        target.client.referral_for(target.activity.contract)
                      when EppEssSubmission
                        target.client.task_owner
                      else
                        target.contract_referral || target.contract_employer
                      end
      current_owner = target.owner if target.respond_to?(:owner) && target.owner.is_a?(User)
      current_owner
    end

    def due(instance, target)
      due = if instance.configuration_value('due_based_on') == 'Answer to datefield question'
              form_question = FormQuestion.find_by(id: instance.configuration_value('date_question'))
              date_string = target.value[form_question.code] if form_question&.code
              Date.parse(date_string) if date_string
            end
      due ||= Date.today
      due + instance.configuration_value('due_in').to_i.days
    end

    def show_workflow_description?(workflow_action)
      !workflow_card_form_submission?(workflow_action) ||
        (workflow_card_form_submission?(workflow_action) &&
          (!workflow_description?(workflow_action) ||
          workflow_description?(workflow_action) &&
          workflow_action&.configuration_value(:workflow_description) == 'Standard'))
    end

    def workflow_card_form_submission?(workflow_action)
      workflow_action&.workflow_card&.class_type == 'WorkflowCardFormSubmission'
    end

    def workflow_description?(workflow_action)
      target_id = workflow_action&.workflow_card&.target_id
      target_id ? get_workflow_description_question(Form.find(target_id)).present? : false
    end

    def task_description(instance, target)
      if instance.configuration_value(:workflow_description) == 'Custom' && get_workflow_description_question(target.form).present?
        target.form_responses.find_by(form_question_id: get_workflow_description_question(target.form).id)&.answer
      else
        instance.configuration_value(:description)
      end
    end

    def get_workflow_description_question(form)
      form.questions.find_by(question_type: 'workflow_description')
    end
  end
end
