import {
  displayLoadingScreen,
  toggleSideNavigation,
  focusSearch,
} from "./view/modal.js";

// Initialize side navigation toggle functionality
toggleSideNavigation();

// Display the loading screen on page load
displayLoadingScreen();

// Add event listener for Ctrl+K to focus the search input
focusSearch();
