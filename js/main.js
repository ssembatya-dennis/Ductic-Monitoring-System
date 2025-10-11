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
