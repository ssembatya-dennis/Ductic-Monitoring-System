/**
 * @file Util.js
 * @description - Provides helper methods for drag-and-drop.
 */

export default class Util {
  static CURRENT_TASK_ID; // Stores the ID of the task being dragged

  // NOTE: All handleOnBlur, handleOnEditTask, and handleConfirmDelete methods are REMOVED.

  static handleDragstart = (event) => {
    event.dataTransfer.dropEffect = "move";
    const taskId = event.target.dataset.taskId;
    event.dataTransfer.setData("text/plain", taskId);

    Util.CURRENT_TASK_ID = taskId;

    requestAnimationFrame(() => event.target.classList.add("dragging"));
  };

  static handleDragend = (event) => {
    event.target.classList.remove("dragging");
    Util.CURRENT_TASK_ID = null;
  };

  static dragOverTask = (event, draggedTask, target) => {
    const { top, height } = target.getBoundingClientRect();
    const targetCenterPosition = top + height / 2;

    if (event.clientY < targetCenterPosition) {
      return target.before(draggedTask);
    }
    return target.after(draggedTask);
  };

  static dragOverContainer = (event, draggedTask, target) => {
    const taskElements = Array.from(
      target.querySelectorAll(".task:not(.dragging)")
    );
    const lastTask = taskElements.pop();

    if (!lastTask) {
      return target.appendChild(draggedTask);
    }
    const { bottom } = lastTask.getBoundingClientRect();

    if (event.clientY > bottom) {
      return target.appendChild(draggedTask);
    }
  };
}
