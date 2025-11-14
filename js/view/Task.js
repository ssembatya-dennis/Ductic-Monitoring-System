/**
 * @file Task.js
 * @description - Creates the Task element dynamically from a task object.
 */

import Util from "../Util/Util.js";

export default class Task {
  /**
   * Creates a task card element from a task object.
   * @param {Object} task - The task object from the API.
   * @returns {HTMLElement} - task div container
   */
  static createTask = (task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id; // CRUCIAL: Link DOM to data ID

    // Render title and due date if present
    const dueDateEl = task.dueDate
      ? `<div class="task-date"><i class="bi bi-calendar-event"></i> ${task.dueDate}</div>`
      : "";

    taskElement.innerHTML = `
      <div class="task-content">
        <div class="task-content-text">${task.title}</div>
        ${dueDateEl}
      </div>
      <menu>
        <button data-action="edit"><i class="bi bi-pencil-square"></i></button>
        <button data-action="delete"><i class="bi bi-trash"></i></button>
      </menu>
    `;

    taskElement.addEventListener("dragstart", Util.handleDragstart);
    taskElement.addEventListener("dragend", Util.handleDragend);

    return taskElement;
  };

  // NOTE: createTaskInput and any contentEditable related logic must be REMOVED.
}
