/**
 * @file KanbanAPI.js
 * @description - This module provides an API to interact with the browser's
 * localStorage for persisting Kanban board tasks.
 */

export default class KanbanAPI {
  /**
   * Retrieves all tasks for a specific column from localStorage.
   * @param {string} columnId - The ID of the column (e.g., "todo", "inprogress").
   * @returns {string[]} - An array of task content strings.
   */
  static getTasks(columnId) {
    // Attempt to get the tasks for the given column
    const columnTasks = localStorage.getItem(`kanban-tasks-${columnId}`);

    if (!columnTasks) {
      return [];
    }

    return JSON.parse(columnTasks);
  }

  /**
   * Saves an array of task content strings for a specific column.
   * @param {string} columnId - The ID of the column to save to.
   * @param {string[]} tasks - An array of task content strings to save.
   */
  static saveTasks(columnId, tasks) {
    localStorage.setItem(`kanban-tasks-${columnId}`, JSON.stringify(tasks));
  }
}
