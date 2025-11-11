/**
 * @file KanbanController.js
 * @description The KanbanController file handles the application functionality for
 * different user mouse events, action buttons like delete and edit.
 */

import Task from "../view/Task.js";
import Util from "../Util/Util.js";

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
  }

  init() {
    this.observeTaskChanges();
    this.renderPlaceholderTasks();
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
      this.observer = new MutationObserver(() => this.updateTaskCount(column));
      this.observer.observe(column.querySelector(".tasks"), {
        childList: true,
      });
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
    this.draggedTask = this.view.draggedTask;
    this.target = event.target.closest(".task, .tasks");

    if (this.target !== true) {
      return;
    }

    if (this.target === this.draggedTask) {
      return;
    }

    if (this.target.classList.contains("tasks")) {
      // target is a tasks element or container
      this.dragOverContainer(event, this.draggedTask);
    }

    if (this.target.classList.contains("task")) {
      // target is another task
      this.dragOverTask(event, this.draggedTask);
    }
  };

  dragOverContainer = (event, draggedTask) => {
    this.lastTask = target.lastElementChild;

    if (this.lastTask !== true) {
      this.target.appendChild(draggedTask);
    }

    const { containerBottomPosition } = this.lastTask.getBoundingClientRect();

    if (event.clientY > containerBottomPosition) {
      this.target.appendChild(draggedTask);
    }
  };

  dragOverTask = (event, draggedTask) => {
    // calculating the center position of the card
    const { top, height } = target.getBoundingClientRect();
    this.targetCenterPosition = top + height / 2;

    if (event.clientY < this.targetCenterPosition) {
      this.target.before(draggedTask);
    }

    this.target.after(draggedTask);
  };

  handleDrop = (event) => {
    event.preventDefault();
  };

  ///////// Dragstart & Drag End

  handleDragstart = (event) => {
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData("text/plain", "");
    requestAnimationFrame(() => event.target.classList.add("dragging"));
  };

  handleDragend = (event) => {
    event.target.classList.remove("dragging");
  };

  renderPlaceholderTasks = () => {
    this.view.placeholderTasks.forEach((column, index) => {
      this.displayTasks(column, index);
    });
  };

  displayTasks = (col, index) => {
    for (const item of col) {
      this.tasks = this.view.columns[index].querySelector(".tasks");

      this.createdTasks = Task.createTask(item);

      this.tasks.appendChild(this.createdTasks);
    }
  };
}
