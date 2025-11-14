/**
 * @file KanbanAPI.js
 * @description - Manages a single array of rich task objects in localStorage.
 */

export default class KanbanAPI {
  /**
   * Retrieves all task objects from localStorage.
   * @returns {Object[]} - An array of task objects.
   */
  static getTasks() {
    const tasks = localStorage.getItem("kanban-tasks");
    return tasks ? JSON.parse(tasks) : [];
  }

  static #saveAllTasks(tasks) {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }

  /**
   * Saves a single task object. Updates an existing task or adds a new one.
   * @param {Object} taskToSave - The task object. Must have a 'column' property.
   */
  static saveTask(taskToSave) {
    const tasks = KanbanAPI.getTasks();

    if (!taskToSave.id) {
      // 1. New Task: Generate ID
      taskToSave.id = Math.floor(Math.random() * 1000000).toString();
      tasks.push(taskToSave);
    } else {
      // 2. Existing Task: Replace the old object
      const index = tasks.findIndex((task) => task.id === taskToSave.id);
      if (index !== -1) {
        tasks[index] = taskToSave;
      }
    }
    KanbanAPI.#saveAllTasks(tasks);
    return taskToSave; // Return the saved task object (with the new ID if new)
  }

  /**
   * Updates a task's column ID for drag-and-drop.
   * @param {string} taskId - ID of the task to move.
   * @param {string} newColumnId - ID of the destination column.
   */
  static moveTask(taskId, newColumnId) {
    const tasks = KanbanAPI.getTasks();
    const taskToMove = tasks.find((task) => task.id === taskId);

    if (taskToMove) {
      taskToMove.column = newColumnId;
      KanbanAPI.#saveAllTasks(tasks);
    }
  }

  /**
   * Deletes a task by ID.
   * @param {string} taskId - The ID of the task to delete.
   */
  static deleteTask(taskId) {
    const tasks = KanbanAPI.getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    KanbanAPI.#saveAllTasks(updatedTasks);
  }
}
