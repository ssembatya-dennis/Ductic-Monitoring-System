/**
 * @file KanbanController.js
 * @description The KanbanController file handles the application functionality for
 * different user mouse events, action buttons like delete and edit.
 */

import Task from "../view/Task.js";
import Util from "../Util/Util.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class KanbanController {
  constructor(view) {
    this.view = view;

    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log("--- setting up Element addEventListeners ---");
    this.view.onConfirmDeleteButtonClick(Util.handleConfirmDelete);
    this.view.onTaskActionButtonsClick(this.handleTaskActionButtonClick);
    this.view.onModalWindowClose(this.handleModalWindowClose);
    this.view.onCancelButtonClick(this.handleOnCancelButtonClick);
    this.view.onTaskDragOver(this.handleDragover);
    this.view.onTaskDrop(this.handleDrop);
  }

  init() {
    this.loadColumnTasks(); // Load saved tasks first
    this.observeTaskChanges(); // Then set up the observer
  }
  /**
   * handler for create new task button onClick event
   * create a task input element
   * ensure that the target element is placed inside a column as the last element child
   *
   */
  handleOnCreateNewTask = (event) => {
    this.columnElement = event.target.closest(".column");
    this.columnLastElement = this.columnElement.lastElementChild;
    this.newTaskInput = Task.createTaskInput();

    this.columnLastElement.appendChild(this.newTaskInput);
    this.newTaskInput.focus();
  };

  /**
   * handler for deleting a task
   * @param {MouseEvent} event
   */
  handleOnDeleteButtonClick = (event) => {
    Util.CURRENT_TASK = event.target.closest(".task");
    this.currentTaskContent = Util.CURRENT_TASK.innerText.substring(0, 100);

    // show preview
    this.view.previewTextElement.innerText = this.currentTaskContent;
    this.view.modalWindow.showModal();
  };

  handleOnCancelButtonClick = () => {
    this.view.modalWindow.close();
  };

  ////////// Column Count, Update task count per column

  updateTaskCount = (column) => {
    this.tasks = column.querySelector(".tasks").children;
    this.taskCount = this.tasks.length;
    column.querySelector(".column-title h3").dataset.tasks = this.taskCount;
  };

  observeTaskChanges = () => {
    for (const column of this.view.columns) {
      const tasksContainer = column.querySelector(".tasks");

      this.observer = new MutationObserver(() => {
        // 1. Update the count (your existing logic)
        this.updateTaskCount(column);

        // 2. Save the new state of this column
        this.saveColumnTasks(column);
      });

      this.observer.observe(tasksContainer, {
        childList: true,
      });
    }
  };

  /**
   * Calculates and updates the task count for all columns.
   */
  updateAllTaskCounts = () => {
    for (const column of this.view.columns) {
      this.updateTaskCount(column);
    }
  };

  //////////// Modal window Actions

  handleModalWindowClose = () => {
    Util.CURRENT_TASK = null;
  };

  //////////// Task Action Button handlers

  handleTaskActionButtonClick = (event) => {
    // if the clicked element is the Create New Task button
    const createNewTaskButton = event.target.closest("button[data-add]");
    if (createNewTaskButton) {
      this.handleOnCreateNewTask(event);
      return;
    }
    // if the clicked element is the EDIT button
    const editButton = event.target.closest("button[data-edit]");
    if (editButton) {
      Util.handleOnEditTask(event);
      return;
    }

    // if the clicked element is the DELETE button
    const deleteButton = event.target.closest("button[data-delete]");
    if (deleteButton) {
      this.handleOnDeleteButtonClick(event);
      return;
    }
  };

  /////////// Drag and Drop handlers

  handleDragover = (event) => {
    event.preventDefault(); // allow drop
    const draggedTask = document.querySelector(".dragging");
    const target = event.target.closest(".task, .tasks");

    if (!draggedTask || !target || target === draggedTask) {
      return;
    }

    // target is a tasks element or container
    if (target.classList.contains("tasks")) {
      Util.dragOverContainer(event, draggedTask, target);
    }

    // target is another task
    if (target.classList.contains("task")) {
      Util.dragOverTask(event, draggedTask, target);
    }
  };

  handleDrop = (event) => {
    event.preventDefault();
  };

  /**
   * save the task card element contents in the database
   *
   * @param {*} columnElement
   */
  saveColumnTasks(columnElement) {
    const [columnId, taskElementsContent] =
      this.readTaskElementsContent(columnElement);
    // Save this array to localStorage
    KanbanAPI.saveTasks(columnId, taskElementsContent);

    // We can log this to see it working
    console.log(`Saved tasks for ${columnId}:`, taskElementsContent);
  }

  /**
   *
   * @param {*} columnElement
   * @returns {[]}
   */
  readTaskElementsContent = (columnElement) => {
    const columnId = columnElement.dataset.columnId;
    const tasksContainer = columnElement.querySelector(".tasks");
    const taskElements = tasksContainer.querySelectorAll(".task");

    // Create an array of just their content
    const tasksContent = [];
    for (const task of taskElements) {
      const contentDiv = task.querySelector(".task-content-text");
      tasksContent.push(contentDiv ? contentDiv.innerHTML : "");
    }

    return [columnId, tasksContent];
  };

  /**
   * render stored task card elements for every particular column
   */
  loadColumnTasks() {
    console.log("--- Loading tasks from localStorage ---");

    for (const column of this.view.columns) {
      const columnId = column.dataset.columnId;

      // Fetch the saved tasks for this column
      const savedColumnTasks = KanbanAPI.getTasks(columnId);

      // For each saved task (which is just a string), create a task element
      this.writeColumnTasks(column, savedColumnTasks);
    }

    this.updateAllTaskCounts();
  }

  /**
   * render a task element card in the
   * @returns {string[]} - An array of task content strings.
   */
  writeColumnTasks = (column, savedTasks) => {
    const tasksContainer = column.querySelector(".tasks");

    for (const taskContent of savedTasks) {
      const taskElement = Task.createTask(taskContent);
      tasksContainer.appendChild(taskElement);
    }
  };
}
