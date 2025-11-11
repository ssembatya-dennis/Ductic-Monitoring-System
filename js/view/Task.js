/**
 * @file Task.js
 * @description - The task.js file creates both the Task element container and the Task
 * Input element container dynamically
 */

import Util from "../utils/Util.js";

export default class Task {
  /**
   * Creates a task container with a task content container, and two action buttons to
   * delete and edit contents of the task
   * @param {Text} content
   * @returns {HTMLElement} - task div container
   */
  static createTask = (content) => {
    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;

    task.innerHTML = `
        <div>${content}</div>
        <menu>
            <button data-edit><i class="bi bi-pencil-square"></i></button>
            <button data-delete><i class="bi bi-trash"></i></button>
        </menu>
    `;

    return task;
  };

  /**
   * Creates the Task Input div element with data-placeholder attribute and content-editable
   * attribute set to true
   * @param {Text} text
   * @returns {HTMLDivElement} - Task Input container
   */
  static createTaskInput = (text = "") => {
    const input = document.createElement("div");
    input.className = "task-input";
    input.dataset.placeholder = "Task name";
    input.contentEditable = true;
    input.innerText = text;
    input.addEventListener("blur", Util.handleOnBlur);

    return input;
  };
}
