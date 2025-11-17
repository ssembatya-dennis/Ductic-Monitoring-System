/**
 * @file TaskComponent.js
 * @description - Component responsible for generating the DOM element for a single task
 * Ticket element card.
 */

import DragDropHandler from "../utils/DragDropHandler.js";

export default class TaskComponent {
  /**
   * Creates the HTML element for a task card Element.
   * @param {object} task - The taskTicket data object.
   * @returns {HTMLElement} The task card element.
   */
  static createTaskElement(task) {
    const taskElementContainer = document.createElement("div");
    taskElementContainer.classList.add("task");
    taskElementContainer.setAttribute("draggable", true);
    taskElementContainer.dataset.taskId = task.id;

    const dateDisplay = task.dueDate
      ? `<span class="task-date"><i class="bi bi-calendar"></i>${task.dueDate}</span>`
      : "";

    taskElementContainer.innerHTML = `
      <div class="task-content-text">${task.title}</div>
      ${dateDisplay}
      <menu>
        <button data-action="edit">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button data-action="delete">
          <i class="bi bi-trash"></i>
        </button>
      </menu>
    `;

    // Handle drag start
    taskElementContainer.addEventListener("dragstart", () => {
      DragDropHandler.handleDragStart(taskElementContainer, task.id);
    });

    // Handle drag end
    taskElementContainer.addEventListener("dragend", () => {
      DragDropHandler.handleDragEnd(taskElementContainer);
    });

    return taskElementContainer;
  }
}
