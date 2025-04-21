// Import CSS
import "../styles/style.css";

// Import components
import "./components/loading-indicator.js";
import "./components/app-title.js";
import "./components/note-form.js";
import "./components/notes-list.js";

// Initialize the loading indicator
document.addEventListener("DOMContentLoaded", () => {
  // Ensure that the global loader is available
  if (!window.globalLoader) {
    const loadingIndicator = document.getElementById("global-loading");
    if (loadingIndicator) {
      window.globalLoader = {
        show: () => {
          loadingIndicator.isVisible = true;
          loadingIndicator.render();
        },
        hide: () => {
          loadingIndicator.isVisible = false;
          loadingIndicator.render();
        },
      };
    }
  }
});
