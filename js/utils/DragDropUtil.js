/**
 * @file DragDropUtil.js
 * @description - Utility class focused purely on calculating the correct drop position for drag and drop operations.
 * Contains stateless helper methods only.
 */

export default class DragDropUtil {
  /**
   * Calculates the nearest non-dragging task element to the current cursor position (Y-coordinate)
   * within a given container, determining where the dragged element should be inserted.
   * @param {HTMLElement} containerElement - The container element holding the tasks.
   * @param {number} mouseYPosition - The clientY coordinate of the mouse/touch.
   * @returns {HTMLElement | null} The task element to insert the dragged task before, or null to append.
   */
  static getNearestTask(containerElement, mouseYPosition) {
    const droppableTaskElements = [
      ...containerElement.querySelectorAll(".task:not(.dragging)"),
    ];

    const initialClosestElement = {
      distance: Number.NEGATIVE_INFINITY,
      element: null,
    };

    const nearestElement = droppableTaskElements.reduce(
      (closestMatch, taskElement) => {
        const elementRect = taskElement.getBoundingClientRect();

        const taskElementCenterPosition =
          elementRect.top + elementRect.height / 2;

        const distanceToCenter = mouseYPosition - taskElementCenterPosition;

        // We are looking for the element directly BELOW the cursor. This means:
        // 1. The distance must be negative (mouseYPosition is above the element's center).
        // 2. The distance must be greater than the current closestMatch.distance (i.e., closer to zero).
        if (distanceToCenter < 0 && distanceToCenter > closestMatch.distance) {
          return { distance: distanceToCenter, element: taskElement };
        }

        return closestMatch;
      },
      initialClosestElement
    ).element;

    return nearestElement;
  }

  /**
   * Handles dropping a task over an empty column or a task container (.tasks).
   * Calculates the correct insertion point using getNearestTask and updates the DOM position.
   * @param {Event} mouseEvent - The drag event (used for clientY).
   * @param {HTMLElement} draggedTaskElement - The DOM element being dragged.
   * @param {HTMLElement} targetContainerElement - The target container element (the .tasks element).
   */
  static dragOverContainer(
    mouseEvent,
    draggedTaskElement,
    targetContainerElement
  ) {
    const mouseYPosition = mouseEvent.clientY;

    // Determine which element the dragged task should be placed before (or null if at end)
    const elementToInsertBefore = DragDropUtil.getNearestTask(
      targetContainerElement,
      mouseYPosition
    );

    if (elementToInsertBefore === null) {
      // Drop at the end of the container
      targetContainerElement.appendChild(draggedTaskElement);
    }

    // Insert the dragged task directly before the calculated nearest task
    targetContainerElement.insertBefore(
      draggedTaskElement,
      elementToInsertBefore
    );
  }

  /**
   * Handles dropping a task directly over another task card.
   * Finds the parent container and calls the main positioning logic (`overContainer`).
   * @param {Event} mouseEvent - The drag event (used for clientY).
   * @param {HTMLElement} draggedTaskElement - The DOM element being dragged.
   * @param {HTMLElement} targetTaskElement - The task element the cursor is currently over.
   */
  static dragOverTask(mouseEvent, draggedTaskElement, targetTaskElement) {
    const parentTasksContainer = targetTaskElement.closest(".tasks");

    if (!parentTasksContainer) {
      console.warn("Could not find parent '.tasks' container for target task.");
      return;
    }

    // Delegate to the container logic to find the nearest position
    DragDropUtil.dragOverContainer(
      mouseEvent,
      draggedTaskElement,
      parentTasksContainer
    );
  }
}
