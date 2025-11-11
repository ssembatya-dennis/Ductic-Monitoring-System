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
    this.inputTaskElement = Task.createTaskInput(this.task.innerText);

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
}
