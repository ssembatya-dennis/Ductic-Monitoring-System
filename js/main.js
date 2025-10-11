document.addEventListener("DOMContentLoaded", () => {
  const loaderWrapper = document.querySelector(".loader_container");
  const dashboardContainer = document.querySelector(".dashboard__container");

  // Simulate a network request or heavy rendering task (e.g., 1.5 seconds)
  // In a real application, you'd execute your data fetching logic here.
  setTimeout(() => {
    // 1. Hide the loader
    loaderWrapper.style.opacity = "0";

    // Wait for the fade-out transition to complete (optional)
    setTimeout(() => {
      loaderWrapper.style.display = "none";

      // 2. Show the main content
      dashboardContainer.style.display = "block";
      dashboardContainer.style.opacity = "1";
    }, 500); // Wait for 500ms (matching the CSS transition)
  }, 1500); // Simulate 1.5 seconds of loading time
});

// --- Gemini Code ---

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const profileArea = document.getElementById("profile-area");
  const dropdownButton = document.getElementById("dropdown-button");
  const profileMenu = document.getElementById("profile-menu");
  const menuButton = document.getElementById("menu-button");

  // Function to toggle the profile menu visibility
  const toggleProfileMenu = (show) => {
    const isVisible = profileMenu.style.display === "block";
    if (show !== undefined ? show : !isVisible) {
      profileMenu.style.display = "block";
      dropdownButton.setAttribute("aria-expanded", "true");
    } else {
      profileMenu.style.display = "none";
      dropdownButton.setAttribute("aria-expanded", "false");
    }
  };

  // 1. Profile Dropdown Click Handler
  profileArea.addEventListener("click", (e) => {
    // Prevent the click from propagating to the document and closing the menu instantly
    e.stopPropagation();
    toggleProfileMenu();
  });

  // 2. Global Click Handler to close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      profileMenu.style.display === "block" &&
      !profileArea.contains(e.target)
    ) {
      toggleProfileMenu(false);
    }
  });

  // 3. Search Bar Focus / Ctrl+K Shortcut
  const focusSearch = (e) => {
    e.preventDefault();
    searchInput.focus();
    // Optionally visually highlight the search wrapper
    document.getElementById("search-wrapper").style.boxShadow =
      "0 0 0 2px var(--color-accent-red)";
    setTimeout(() => {
      document.getElementById("search-wrapper").style.boxShadow =
        "inset 0 1px 3px rgba(0, 0, 0, 0.2)";
    }, 500);
  };

  // Keyboard shortcut (Ctrl + K)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
      focusSearch(e);
    }
  });

  // Click anywhere on the search wrapper to focus the input
  document.getElementById("search-wrapper").addEventListener("click", (e) => {
    // Only focus if the click wasn't on the input itself (to avoid double focus calls)
    if (e.target !== searchInput) {
      searchInput.focus();
    }
  });

  // 4. Menu Button handler (using custom message box instead of alert())
  menuButton.addEventListener("click", () => {
    displayMessageBox("Navigation menu toggle simulated.", "Menu Click");
  });

  // Custom Message Box function (to replace banned alert/confirm)
  const displayMessageBox = (message, title) => {
    const modal = document.createElement("div");
    modal.style.cssText = `
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background-color: var(--color-bg-bar); padding: 20px; border-radius: 8px;
                    box-shadow: 0 5px 15px var(--color-shadow); z-index: 1000;
                    color: var(--color-text-light); border: 1px solid var(--color-bg-search);
                    max-width: 300px; text-align: center;
                `;
    modal.innerHTML = `
                    <h4 style="margin-top: 0; color: var(--color-accent-red);">${title}</h4>
                    <p style="margin-bottom: 15px; font-size: 0.9rem;">${message}</p>
                    <button id="msg-ok" style="
                        background-color: var(--color-accent-red); color: white; border: none; 
                        padding: 8px 16px; border-radius: 4px; cursor: pointer;
                        font-weight: 600; transition: background-color 0.2s;
                    ">Got It</button>
                `;
    document.body.appendChild(modal);

    document.getElementById("msg-ok").onclick = function () {
      document.body.removeChild(modal);
    };
  };
});
