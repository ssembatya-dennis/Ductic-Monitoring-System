/**
 * @file Util.js
 * @description - The Util.js file provides helper methods to handle different user events
 */
import Task from "../view/Task.js";

export default class Util {
  static CURRENT_TASK;
  /**
   * handler for input element onblur user event
   * stores the event target
   * creates a task element card with the content entered by the user
   * replaces the task Input element with the task element container on blur event.
   * @param {MouseEvent} event
   */
  static handleOnBlur = (event) => {
    this.inputTaskElement = event.target;
    this.content = this.inputTaskElement.innerText.trim() || "Untitled";
    this.createdTask = Task.createTask(this.content.replace(/\n/g, "<br>"));

    this.inputTaskElement.replaceWith(this.createdTask);
  };

  ////////// Task controls, Edit & Delete task actions

  static handleOnEditTask = (event) => {
    this.task = event.target.closest(".task");
    this.inputTaskElement = Task.createTaskInput(
      this.task.querySelector("div").innerHTML.replace(/<br>/g, "\n")
    );

    this.task.replaceWith(this.inputTaskElement);
    this.inputTaskElement.focus();

    // move the cursor to the end
    const selection = window.getSelection();
    selection.selectAllChildren(this.inputTaskElement);
    selection.collapseToEnd();
  };

  static handleConfirmDelete = () => {
    if (Util.CURRENT_TASK !== null) {
      Util.CURRENT_TASK.remove();
    }
  };

  ///////// Dragstart & Drag End

  static handleDragstart = (event) => {
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData("text/plain", "");
    requestAnimationFrame(() => event.target.classList.add("dragging"));
  };

  static handleDragend = (event) => {
    event.target.classList.remove("dragging");
  };

  // Dragging a task card over different task elements or the task container

  static dragOverTask = (event, draggedTask, target) => {
    // calculating the center position of the card
    const { top, height } = target.getBoundingClientRect();
    const targetCenterPosition = top + height / 2;

    if (event.clientY < targetCenterPosition) {
      // Drop before the target task
      return target.before(draggedTask);
    }

    // Drop after the target task
    return target.after(draggedTask);
  };

  static dragOverContainer = (event, draggedTask, target) => {
    // all non-dragged tasks in this container
    const taskElements = Array.from(
      target.querySelectorAll(".task:not(.dragging)")
    );

    const lastTask = taskElements.pop();

    if (!lastTask) {
      // if container is empty or only contains the dragged task.
      return target.appendChild(draggedTask);
    }

    // if container has other tasks, check the drop zone.

    // Get the bottom edge of the last task element
    const { bottom } = lastTask.getBoundingClientRect();

    if (event.clientY > bottom) {
      // drop at the end of the list.
      return target.appendChild(draggedTask);
    }
  };
}
