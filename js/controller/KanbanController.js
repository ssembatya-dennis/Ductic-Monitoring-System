/**
 * @file KanbanController.js
 * @description - The central controller managing state flow and user interactions.
 */

import Task from "../view/Task.js";
import Util from "../Util/Util.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class KanbanController {
  constructor(view) {
    this.view = view;
    this.currentTaskId = null; // Store ID for delete modal

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Modal Listeners
    this.view.onTaskFormSubmit(this.handleTaskFormSubmit);
    this.view.onModalCancelClick(this.handleModalCancel);

    // Task Action Listeners (Add/Edit/Delete)
    this.view.onTaskActionButtonsClick(this.handleTaskActionButtonClick);

    // Delete Modal Listeners
    this.view.onConfirmDeleteButtonClick(this.handleConfirmDelete);
    this.view.onCancelDeleteButtonClick(this.handleCancelDelete);
    this.view.onDeleteModalClose(this.handleDeleteModalClose);

    // Drag and Drop Listeners
    this.view.onTaskDragOver(this.handleDragover);
    this.view.onTaskDrop(this.handleDrop);
  }

  init() {
    // The application always starts by rendering the current state from the API
    this.renderTasks();
  }

  // --- Rendering and Utilities ---

  /**
   * Clears DOM, loads all tasks from API, and renders the board.
   */
  renderTasks() {
    const allTasks = KanbanAPI.getTasks();

    // 1. Clear all existing task elements from the DOM
    for (const tasksContainer of this.view.allTasksElementsContainer) {
      tasksContainer.innerHTML = "";
    }

    // 2. Create and append task elements to the correct columns
    for (const task of allTasks) {
      const taskElement = Task.createTask(task);
      const columnElement = document.querySelector(
        `[data-column-id="${task.column}"]`
      );

      if (columnElement) {
        columnElement.querySelector(".tasks").appendChild(taskElement);
      }
    }

    // 3. Update task counts
    this.updateAllTaskCounts();
  }

  /**
   * Updates the task count for all columns based on the API data.
   */
  updateAllTaskCounts() {
    const tasks = KanbanAPI.getTasks();
    const counts = { todo: 0, inprogress: 0, done: 0 };

    for (const task of tasks) {
      if (counts[task.column] !== undefined) {
        counts[task.column]++;
      }
    }

    for (const column of this.view.columns) {
      const columnId = column.dataset.columnId;
      const count = counts[columnId] || 0;
      column.querySelector(".column-title h3").dataset.tasks = count;
    }
  }

  // --- Modal Handlers (Add/Edit/Save) ---

  handleTaskActionButtonClick = (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const column = event.target.closest(".column");
    const taskElement = event.target.closest(".task");
    let taskId = taskElement ? taskElement.dataset.taskId : null;

    if (action === "add") {
      // Must pass the column ID where the '+' was clicked
      this.openTaskModal(null, column.dataset.columnId);
    } else if (action === "edit") {
      this.openTaskModal(taskId);
    } else if (action === "delete") {
      this.currentTaskId = taskId;
      this.openDeleteModal();
    }
  };

  openTaskModal(taskId, columnId = null) {
    const form = this.view.taskForm;
    form.reset();

    // CRITICAL FIX: Explicitly clear the hidden ID field for new tasks
    form.querySelector('input[name="id"]').value = "";

    if (taskId) {
      // EDIT MODE
      this.view.modalTitle.innerText = "Edit Task";
      const task = KanbanAPI.getTasks().find((t) => t.id === taskId);
      if (task) {
        // Populate fields from task object
        form.querySelector('input[name="id"]').value = task.id;
        form.querySelector('input[name="title"]').value = task.title;
        form.querySelector('textarea[name="description"]').value =
          task.description;
        form.querySelector('input[name="dueDate"]').value = task.dueDate;
        // Ensure the correct column is retained for saving edits
        form.querySelector('input[name="column"]').value = task.column;
      }
    } else {
      // ADD MODE
      this.view.modalTitle.innerText = "Add New Task";
      // Set the target column ID for the new task
      form.querySelector('input[name="column"]').value = columnId;
    }

    this.view.taskModal.showModal();
  }

  handleTaskFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(this.view.taskForm);
    const taskData = Object.fromEntries(formData.entries());

    // Before saving, ensure all inputs are strings (especially the due date)
    // and handle potential empty string inputs gracefully.
    taskData.description = taskData.description || "";
    taskData.dueDate = taskData.dueDate || "";

    KanbanAPI.saveTask(taskData);

    this.renderTasks();
    this.view.taskModal.close();
  };

  handleModalCancel = () => {
    this.view.taskModal.close();
  };

  // --- Delete Modal Handlers ---

  openDeleteModal() {
    const task = KanbanAPI.getTasks().find((t) => t.id === this.currentTaskId);
    // Display the title of the task being deleted in the modal preview
    this.view.previewTextElement.innerText = task ? task.title : "this task";
    this.view.deleteModal.showModal();
  }

  handleConfirmDelete = () => {
    if (this.currentTaskId) {
      KanbanAPI.deleteTask(this.currentTaskId);
      // Re-render the entire board to show the task removed and update counts
      this.renderTasks();
    }
    this.currentTaskId = null;
    this.view.deleteModal.close();
  };

  handleCancelDelete = () => {
    this.view.deleteModal.close();
  };

  handleDeleteModalClose = () => {
    this.currentTaskId = null; // Clear state on modal close
  };

  // --- Drag and Drop Handlers ---

  handleDragover = (event) => {
    event.preventDefault();
    const draggedTask = document.querySelector(".dragging");
    const target = event.target.closest(".task, .tasks");

    if (!draggedTask || !target || target === draggedTask) return;

    if (target.classList.contains("tasks")) {
      Util.dragOverContainer(event, draggedTask, target);
    }
    if (target.classList.contains("task")) {
      Util.dragOverTask(event, draggedTask, target);
    }
  };

  handleDrop = (event) => {
    event.preventDefault();

    const taskId = Util.CURRENT_TASK_ID;
    if (!taskId) return;

    const dropZone = event.target.closest(".column");
    if (!dropZone) return;

    const newColumnId = dropZone.dataset.columnId;

    // Update the column in the API, then re-render the board
    KanbanAPI.moveTask(taskId, newColumnId);
    this.renderTasks();
  };
}
