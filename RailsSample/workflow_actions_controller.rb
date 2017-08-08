class WorkflowActionsController < ApplicationController
  before_action :login_required
  before_action :admin_or_security_required
  before_action :find_workflow
  layout :crm_layout

  def new
    @available_actions = WorkflowAction.available_actions
    @card_action = @card ? @card.workflow_actions.new : @group.workflow_actions.new
  end

  def edit
    @available_actions = WorkflowAction.available_actions
    @card_action = owner.workflow_actions.find(params[:card_action_id])
    @card_action_properties = @card_action.properties
  end

  def destroy
    owner.workflow_actions.find(params[:card_action_id]).destroy

    if params[:v2] == "true"
      render text: { result: { successful: true } }.to_json # JSON
    else
      flash[:notice] = "Action deleted!"
      redirect_to edit_workflow_path(@workflow)
    end
  end

  def create
    if params[:card_action_id].present?
      @card_action = owner.workflow_actions.find(params[:card_action_id])
      @card_action.workflow_configurations.destroy_all
      @card_action.update_attributes(params[:workflow_action])
    else
      @card_action = owner.workflow_actions.new(params[:workflow_action])
      @card_action.save!
    end

    flash[:notice] = "Action created!"

    redirect_to edit_workflow_path(@workflow)
  end

  def owner
    @card || @group
  end

  def update
    @card_action = owner.workflow_actions.find(params[:card_action_id])
    if @card_action
      @card_action.workflow_configurations.destroy_all
      @card_action.update_attributes(params[:workflow_action])
    end

    flash[:notice] = "Action saved!"
    redirect_to edit_workflow_path(@workflow)
  end

  def load_action
    @card_action_populate = {}
    if params[:workflow] && params[:workflow].include?("workflow_action")
      @card_action_properties = params[:workflow][:workflow_action][:class_type].constantize.new({ workflow_configurations_attributes: params[:workflow][:workflow_action][:workflow_configurations_attributes].map { |k, v| v } }.merge(action_object_hash)).properties
      @card_action_populate = params[:workflow][:workflow_action][:workflow_configurations_attributes].map { |k, v| v }.map { |c| Hash[*c[:param], c[:value]] }.reduce({}, :merge)
    else
      @card_action_properties = params[:card_action].constantize.new(action_object_hash).properties
    end

    render '_load_action', layout: false
  end

  def action_object_hash
    if @card
      { workflow_card: @card }
    else
      { workflow_group: @group }
    end
  end

  protected

  def find_workflow
    if params[:card_id].present? || params[:workflow].try(:[], :card_id).present?
      @card = WorkflowCard.find(params[:card_id]) rescue WorkflowCard.find(params[:workflow][:card_id])
    end
    if params[:group_id].present? || params[:workflow].try(:[], :group_id).present?
      @group = WorkflowGroup.find(params[:group_id]) rescue WorkflowGroup.find(params[:workflow][:group_id])
    end
    @workflow = Workflow.find(params[:workflow_id] || params[:workflow_action][:workflow_id]) rescue (@card || @group).workflow
    raise "You can not edit public workflows" if !current_user.admin? && !@workflow.only_owner?(current_user)
  end
end
