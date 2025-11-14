/**
 * @file KanbanView.js
 * @description - Manages all DOM selection and event attachment.
 */

export default class KanbanView {
  constructor() {
    // Column/Container Selectors
    this.allTasksElementsContainer = document.querySelectorAll(".tasks");
    this.columnsContainer = document.querySelector(".columns");
    this.columns = document.querySelectorAll(".column");

    // Task Action Selectors (for add/edit/delete buttons)
    this.taskActionButtonsContainer = document.querySelector(".columns");

    // Delete Modal Selectors (Renamed .confirm-modal)
    this.deleteModal = document.querySelector(".confirm-modal");
    this.previewTextElement = this.deleteModal.querySelector(".preview");
    this.cancelDeleteButton = document.querySelector("#confirm-cancel");

    // NEW Task Modal Selectors
    this.taskModal = document.querySelector(".task-modal");
    this.taskForm = document.querySelector("#task-form");
    this.modalTitle = document.querySelector("#modal-title");
    this.modalCancelButton = document.querySelector("#modal-cancel");
  }

  // --- Event Attachments ---

  // General click handler for Add/Edit/Delete buttons
  onTaskActionButtonsClick = (handler) => {
    this.taskActionButtonsContainer.addEventListener("click", handler);
  };

  // Modal Handlers
  onTaskFormSubmit = (handler) => {
    this.taskForm.addEventListener("submit", handler);
  };

  onModalCancelClick = (handler) => {
    this.modalCancelButton.addEventListener("click", handler);
  };

  // Drag and Drop Handlers
  onTaskDragOver = (handler) => {
    this.columnsContainer.addEventListener("dragover", handler);
  };

  onTaskDrop = (handler) => {
    this.columnsContainer.addEventListener("drop", handler);
  };

  // Delete Modal Handlers
  onConfirmDeleteButtonClick = (handler) => {
    this.deleteModal.addEventListener("submit", handler);
  };

  onCancelDeleteButtonClick = (handler) => {
    this.cancelDeleteButton.addEventListener("click", handler);
  };

  onDeleteModalClose = (handler) => {
    this.deleteModal.addEventListener("close", handler);
  };
}
