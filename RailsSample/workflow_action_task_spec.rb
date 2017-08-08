RSpec.describe WorkflowActionTask do
  context 'integration' do
    let(:client) { create :client }
    let(:contract) { create :contract, attachment_types: ['Resume for ESS'] }
    let(:is_active) { true }
    let(:workflow) { create :workflow, contracts: [contract], is_active: is_active }
    let(:form) { create :form, contracts: [contract], name: 'example form' }
    let(:form_question) { create :form_question, form: form, question_type: "workflow_description" }
    let(:workflow_card_configuration) { [{ param: 'title', value: 'sample title' }] }
    let(:workflow_card) { create :workflow_card_form_submission, target_id: form.id, class_type: 'WorkflowCardFormSubmission', workflow: workflow, workflow_configurations_attributes: workflow_card_configuration }
    let(:workflow_action) do
      create :workflow_action,
             class_type: 'WorkflowActionTask',
             workflow_card: workflow_card,
             workflow_configurations_attributes: [
               { param: 'task_type', value: 'call' },
               { param: 'workflow_description', value: 'Standard' },
               { param: 'description', value: 'Test description' },
               { param: 'due_based_on', value: 'Triggering of Card' },
               { param: 'due_in', value: '5' }
             ]
    end

    subject(:properties) { described_class.new(workflow_card: workflow_card).properties }

    context 'humanize should have correct description' do
      it { expect(workflow_action.humanize).to eq('Create <strong>Task</strong> of type <strong>call</strong> - <strong>Test description</strong> - due in <strong>5 days</strong>') }
    end

    context '#workflow_card_form_submission with property workflow_description' do
      it do
        expect(properties[:workflow_description][:if]).to be true
        expect(properties[:description][:if]).to be true
      end

      it 'should be disabled if form have no question with type workflow_description' do
        expect(properties[:workflow_description][:disabled]).to be true
      end

      it 'should be selectable if form have question with type workflow_description' do
        form_question
        expect(properties[:workflow_description][:disabled]).to be false
      end
    end

    context '#task_description' do
      let(:contract_referral) { create :contract_referral }
      let(:form_submission) { create :form_submission, form: form, owner: contract_referral }

      it 'should return description from WorkflowCard action when description type is Standard' do
        expect(described_class.run!(workflow_action, form_submission)).to be true
        expect(Task.last.description).to eq "Test description"
      end

      it 'should return description from anser to question in form when description type is Custom' do
        workflow_action.workflow_configurations.find_by(param: "workflow_description")&.update(value: "Custom")
        create :form_response,
               form_submission: form_submission,
               form_question_code: "workflow_description",
               form_question_id: form_question.id,
               answer: "Custom Description"
        expect(described_class.run!(workflow_action.reload, form_submission.reload)).to be true
        expect(Task.last.description).to eq "Custom Description"
      end
    end

    context 'when not #workflow_card_form_submission' do
      let(:workflow_card) { create :workflow_card, target_id: form.id, class_type: 'WorkflowCardEpp', workflow: workflow, workflow_configurations_attributes: workflow_card_configuration }

      it 'show description but not workflow_description field' do
        expect(properties[:workflow_description]).to be_nil
        expect(properties[:description][:if]).to be true
      end
    end
  end
end
