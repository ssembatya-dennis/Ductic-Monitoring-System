/**
 * @file BoardManager.js
 * @description - The central service responsible for managing application state, directing flow
 * between the View (DOM) and the DataService (Persistence), and handling user events.
 */

import TaskComponent from "../view/TaskComponent.js";
import DragDropUtil from "../utils/DragDropUtil.js";
import DataService from "../data/DataService.js";

export default class BoardManager {
  constructor(view) {
    this.view = view;
    this.currentTaskId = null; // Stores ID for delete modal context

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

  /**
   * Application initializer. Loads the initial state.
   * NOTE: This will be replaced by a Firestore real-time listener next.
   */
  async init() {
    await this.renderTasks();
  }

  // --- Rendering Functions (Modularized) ---

  /**
   * Clears the DOM and populates the board with tasks from the DataService.
   */
  async renderTasks() {
    // 1. Fetch tasks and sort by creation time (descending)
    const allTasks = await DataService.getTasks();

    // 2. Clear all task elements from the DOM
    this.clearAllTasksFromDOM();

    // 3. Render tasks to their respective columns
    this.populateColumns(allTasks);

    // 4. Update task counts display
    this.updateAllTaskCounts(allTasks);
  }

  /**
   * Helper to clear all task containers.
   */
  clearAllTasksFromDOM() {
    for (const tasksContainer of this.view.allTasksElementsContainer) {
      tasksContainer.innerHTML = "";
    }
  }

  /**
   * Helper to render tasks into the DOM.
   * @param {Array<object>} tasks - List of task objects to render.
   */
  populateColumns(tasks) {
    for (const task of tasks) {
      // FIX: Use the new descriptive method name
      const taskElement = TaskComponent.createTaskElement(task);
      const columnElement = document.querySelector(
        `[data-column-id="${task.column}"]`
      );

      if (columnElement) {
        columnElement.querySelector(".tasks").appendChild(taskElement);
      }
    }
  }

  /**
   * Updates the task count for all columns.
   * @param {Array<object>} tasks - List of all tasks.
   */
  updateAllTaskCounts(tasks) {
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

  // --- Event Handlers (Async Ready) ---

  handleTaskActionButtonClick = (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const column = event.target.closest(".column");
    const taskElement = event.target.closest(".task");
    let taskId = taskElement ? taskElement.dataset.taskId : null;

    if (action === "add") {
      this.openTaskModal(null, column.dataset.columnId);
    } else if (action === "edit") {
      this.openTaskModal(taskId);
    } else if (action === "delete") {
      this.currentTaskId = taskId;
      this.openDeleteModal();
    }
  };

  async openTaskModal(taskId, columnId = null) {
    const form = this.view.taskForm;
    form.reset();
    form.querySelector('input[name="id"]').value = ""; // Clear ID for safety

    if (taskId) {
      // EDIT MODE: Needs to wait for the task data to be fetched
      this.view.modalTitle.innerText = "Edit Task";
      const task = await DataService.getTaskById(taskId); // New method needed in DataService

      if (task) {
        // Populate fields
        form.querySelector('input[name="id"]').value = task.id;
        form.querySelector('input[name="title"]').value = task.title;
        form.querySelector('textarea[name="description"]').value =
          task.description;
        form.querySelector('input[name="dueDate"]').value = task.dueDate;
        form.querySelector('input[name="column"]').value = task.column;
      }
    } else {
      // ADD MODE
      this.view.modalTitle.innerText = "Add New Task";
      form.querySelector('input[name="column"]').value = columnId;
    }

    this.view.taskModal.showModal();
  }

  handleTaskFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(this.view.taskForm);
    const taskData = Object.fromEntries(formData.entries());

    // Ensure title is present (Validation will be added later, but basic check is good)
    if (!taskData.title || taskData.title.trim() === "") {
      console.error("Task title cannot be empty.");
      // TODO: Replace with a clean modal message later
      return;
    }

    // Prepare data for saving
    taskData.description = taskData.description || "";
    taskData.dueDate = taskData.dueDate || "";

    // AWAIT the saving operation (crucial for Firestore)
    await DataService.saveTask(taskData);

    await this.renderTasks(); // Re-render after successful save
    this.view.taskModal.close();
  };

  // --- Delete Modal Handlers ---

  async openDeleteModal() {
    const task = await DataService.getTaskById(this.currentTaskId);
    this.view.previewTextElement.innerText = task ? task.title : "this task";
    this.view.deleteModal.showModal();
  }

  handleConfirmDelete = async () => {
    if (this.currentTaskId) {
      // AWAIT the deletion
      await DataService.deleteTask(this.currentTaskId);
      await this.renderTasks();
    }
    this.currentTaskId = null;
    this.view.deleteModal.close();
  };

  // (Cancel and Close handlers remain synchronous)

  // --- Drag and Drop Handlers ---

  handleDragover = (event) => {
    event.preventDefault();
    const draggedTask = document.querySelector(".dragging");
    const target = event.target.closest(".task, .tasks");

    if (!draggedTask || !target || target === draggedTask) return;

    if (target.classList.contains("tasks")) {
      DragDropUtil.dragOverContainer(event, draggedTask, target);
    }
    if (target.classList.contains("task")) {
      DragDropUtil.dragOverTask(event, draggedTask, target);
    }
  };

  handleDrop = async (event) => {
    event.preventDefault();

    // CRITICAL UPDATE: Read the task ID from the event's dataTransfer object
    const taskId = event.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const dropZone = event.target.closest(".column");
    if (!dropZone) return;

    const newColumnId = dropZone.dataset.columnId;

    // AWAIT the update
    await DataService.moveTask(taskId, newColumnId);
    await this.renderTasks();
  };
}
