/**
 * @file BoardView.js
 * @description - Manages all direct DOM access, element selection, and event binding.
 * Acts as the public interface for the BoardOrchestrator to interact with the UI.
 */

export default class BoardView {
  constructor() {
    this.columns = document.querySelectorAll(".column");
    this.allTasksElementsContainer = document.querySelectorAll(".tasks");

    // Task Modal Elements
    this.taskModal = document.querySelector(".task-modal");
    this.taskForm = document.getElementById("task-form");
    this.modalTitle = document.getElementById("modal-title");

    // Delete Modal Elements
    this.deleteModal = document.querySelector(".confirm-modal");
    this.previewTextElement = this.deleteModal.querySelector(".preview");

    // Ensure dialogs are available before interaction
    if (!this.taskModal || !this.deleteModal) {
      console.error("Critical: Task or Delete Modal elements not found.");
    }
  }

  // --- Modal Event Binding ---

  onTaskFormSubmit(handler) {
    this.taskForm.addEventListener("submit", handler);
  }

  onModalCancelClick(handler) {
    document.getElementById("modal-cancel").addEventListener("click", handler);
  }

  // --- Task Action Event Binding (Delegation) ---

  onTaskActionButtonsClick(handler) {
    // Delegate listeners to the main column container for performance
    document.querySelector(".columns").addEventListener("click", handler);
  }

  // --- Delete Confirmation Event Binding ---

  onConfirmDeleteButtonClick(handler) {
    document
      .getElementById("confirm-delete")
      .addEventListener("click", handler);
  }

  onCancelDeleteButtonClick(handler) {
    document
      .getElementById("confirm-cancel")
      .addEventListener("click", handler);
  }

  onDeleteModalClose(handler) {
    this.deleteModal.addEventListener("close", handler);
  }

  // --- Drag and Drop Event Binding (Delegation) ---

  onTaskDragOver(handler) {
    // Capture dragover on the main columns container
    document.querySelector(".columns").addEventListener("dragover", handler);
  }

  onTaskDrop(handler) {
    // Capture drop on the main columns container
    document.querySelector(".columns").addEventListener("drop", handler);
  }
}
