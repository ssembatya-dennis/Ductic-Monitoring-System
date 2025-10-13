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
  const body = document.body;
  const menuButton = document.getElementById("menu-button");
  const searchInput = document.getElementById("search-input");
  const profileArea = document.getElementById("profile-area");
  const profileMenu = document.getElementById("profile-menu");
  const dropdownButton = document.getElementById("dropdown-button");
  const sidebar = document.getElementById("sidebar");
  const mobileOverlay = document.getElementById("mobile-overlay");

  // --- 1. Sidebar Toggle Logic ---
  const toggleSidebar = () => {
    // Toggle the 'collapsed' class on the body
    body.classList.toggle("collapsed");

    // For mobile, the 'collapsed' class means the menu is actually OPENED
    if (window.innerWidth < 1024) {
      const isOpen = body.classList.contains("collapsed");
      // Lock scrolling when menu is open on mobile
      // document.documentElement.style.overflowY = isOpen ? "hidden" : "auto";
    }
  };

  // Initial adjustment for desktop view
  if (window.innerWidth >= 1024) {
    // On desktop, we start expanded and can collapse it
    body.classList.remove("collapsed");
  } else {
    // On mobile, the sidebar is hidden by default. The 'collapsed' class opens it.
    body.classList.add("collapsed");
  }

  menuButton.addEventListener("click", toggleSidebar);
  mobileOverlay.addEventListener("click", toggleSidebar);

  // --- 2. Search Bar Focus / Ctrl+K Shortcut ---
  const focusSearch = (e) => {
    e.preventDefault();
    searchInput.focus();
    // Visual highlight
    document.getElementById("search-wrapper").style.boxShadow =
      "0 0 0 2px var(--color-white)";
    setTimeout(() => {
      document.getElementById("search-wrapper").style.boxShadow =
        "inset 0 1px 3px rgba(0, 0, 0, 0.2)";
    }, 500);
  };

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
      focusSearch(e);
    }
  });

  document.getElementById("search-wrapper").addEventListener("click", (e) => {
    if (e.target !== searchInput) {
      searchInput.focus();
    }
  });

  // --- 3. Profile Dropdown Logic ---
  const toggleProfileMenu = (show) => {
    const isVisible = profileMenu.style.display === "block";
    const shouldShow = show !== undefined ? show : !isVisible;

    profileMenu.style.display = shouldShow ? "block" : "none";
    dropdownButton.setAttribute("aria-expanded", shouldShow);
  };

  profileArea.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleProfileMenu();
  });

  document.addEventListener("click", (e) => {
    if (
      profileMenu.style.display === "block" &&
      !profileArea.contains(e.target)
    ) {
      toggleProfileMenu(false);
    }
  });
});
