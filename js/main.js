/**
 * @file main.js
 * @description - The application entry point. Initializes the View and Controller/Orchestrator
 * and starts the application lifecycle.
 */

import BoardView from "./view/BoardView.js";
import BoardManager from "./service/BoardManager.js";

// Global variables provided by the environment for Firebase setup (future use)
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : null;

window.onload = () => {
  const boardView = new BoardView();

  const boardManager = new BoardManager(boardView);

  boardManager.init();
};
