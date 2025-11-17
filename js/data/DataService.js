/**
 * @file DataService.js
 * @description - The data layer service. Currently uses localStorage but is now async-ready for Firestore (MVP-2).
 * This service abstracts the storage logic, allowing the application's core functions (BoardOrchestrator)
 * to remain decoupled from the persistence mechanism (localStorage, Firestore, etc.).
 */

const STORAGE_KEY = "kanban-data";

export default class DataService {
  /**
   * Fetches all tasks from storage.
   * Tasks are sorted by creation date descending (newest first).
   * * @async
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of all task objects.
   */
  static async getTasks() {
    const taskTicketsList = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return taskTicketsList.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Fetches a single task by its unique ID.
   * * @async
   * @param {string} taskId - The unique ID of the task to retrieve.
   * @returns {Promise<Object | undefined>} A promise that resolves with the task object, or undefined if not found.
   */
  static async getTaskById(taskId) {
    const taskTicketsList = await this.getTasks();

    const searchedTaskTicket = taskTicketsList.find(
      (task) => task.id === taskId
    );

    return searchedTaskTicket;
  }

  /**
   * Saves or updates a taskTicket object. If taskTicketData includes an ID, it updates the existing taskTicket;
   * otherwise, it creates a new task Ticket with a new ID and a 'createdAt' timestamp.
   * * @async
   * @param {Object} taskTicketData - The task object containing data (title, description, column, dueDate) to save/update.
   * @returns {Promise<void>} A promise that resolves when the task has been saved to storage.
   */
  static async saveTask(taskTicketData) {
    const taskTicketsList = await this.getTasks();

    const existingTaskTicketIndex = taskTicketsList.findIndex(
      (taskTicket) => taskTicket.id === taskTicketData.id
    );

    if (existingTaskTicketIndex > -1) {
      // Edit: Update existing task
      taskTicketsList[existingTaskTicketIndex] = {
        ...taskTicketsList[existingTaskTicketIndex],
        ...taskTicketData,
      };
    }

    // Add: Create new task
    const newTaskTicket = {
      id: crypto.randomUUID(),
      createdAt: new Date().getTime(),
      ...taskTicketData,
    };

    taskTicketsList.push(newTaskTicket);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskTicketsList));
  }

  /**
   * Deletes a task from storage based on its unique ID.
   * * @async
   * @param {string} taskId - The unique ID of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the task has been removed from storage.
   */
  static async deleteTask(taskId) {
    const taskTicketsList = await this.getTasks();

    const filteredtaskTicketsList = tasks.filter((task) => task.id !== taskId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredtaskTicketsList));
  }

  /**
   * Updates the column status (e.g., 'todo', 'inprogress', 'done') of a specific task.
   * * @async
   * @param {string} taskId - The unique ID of the task to move.
   * @param {string} newColumnId - The ID of the target column ('todo', 'inprogress', or 'done').
   * @returns {Promise<void>} A promise that resolves when the task's column has been updated in storage.
   */
  static async moveTask(taskId, newColumnId) {
    const taskTicketsList = await this.getTasks();

    const taskTicket = taskTicketsList.find((task) => task.id === taskId);

    if (taskTicket !== undefined) {
      taskTicket.column = newColumnId;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(taskTicketsList));
    }
  }
}
