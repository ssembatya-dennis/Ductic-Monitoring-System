/**
 * @file KanbanView.js
 * @description - The KanbanView.js file is responsible for binding DOM elements with their
 * respective handlers
 */

export default class KanbanView {
  constructor() {
    // important DOM nodes
    this.allTasksElementsContainer = document.querySelectorAll(".tasks");
    this.modalWindow = document.querySelector(".confirm-model");
    this.columnsContainer = document.querySelector(".columns");
    this.columns = document.querySelectorAll(".column");
    this.columnLastElement = document.querySelector(".column").lastElementChild;
    this.columns = document.querySelectorAll(".column");
    this.previewTextElement = document.querySelector(".preview");
    this.tasksContainer = document.querySelector(".tasks");
    this.draggedTask = document.querySelector(".dragging");

    // buttons
    this.cancelButton = document.querySelector("#cancel");
  }

  //////////////// Modal window button Event Listeners

  onConfirmDeleteButtonClick = (handler) => {
    // confirm deletion
    this.modalWindow.addEventListener("submit", handler);
  };

  onCancelButtonClick = (handler) => {
    // cancel deletion
    this.cancelButton.addEventListener("click", handler);
  };

  // clear current task
  onModalWindowClose = (handler) => {
    this.modalWindow.addEventListener("close", handler);
  };

  // Tasks card EventListeners

  onTaskActionButtonsClick = (handler) => {
    this.columnsContainer.addEventListener("click", handler);
  };

  ////// task dragging over and drop
  onTaskDragOver = (handler) => {
    for (const taskElement of this.allTasksElementsContainer) {
      taskElement.addEventListener("dragover", handler);
    }
  };

  onTaskDrop = (handler) => {
    for (const taskElement of this.allTasksElementsContainer) {
      taskElement.addEventListener("drop", handler);
    }
  };
}
