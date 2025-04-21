// loading indicator
class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this._isVisible = false;
  }

  connectedCallback() {
    this.render();

    window.addEventListener("DOMContentLoaded", () => {
      if (!this.show) {
        this.show = this.show.bind(this);
      }
      if (!this.hide) {
        this.hide = this.hide.bind(this);
      }
    });
  }

  set isVisible(value) {
    this._isVisible = value;
    this.render();
  }

  get isVisible() {
    return this._isVisible;
  }

  render() {
    this.innerHTML = `
      <div class="loading-container ${this._isVisible ? "visible" : ""}">
        <div class="loading-box">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading...</p>
          <div class="loading-decoration"></div>
          <div class="loading-decoration loading-decoration-2"></div>
          <div class="loading-decoration loading-decoration-3"></div>
        </div>
      </div>
    `;
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}

customElements.define("loading-indicator", LoadingIndicator);

// global loader
window.addEventListener("DOMContentLoaded", () => {
  window.globalLoader = {
    show: () => {
      const loader = document.getElementById("global-loading");
      if (loader) {
        if (typeof loader.show === "function") {
          loader.show();
        } else {
          loader.isVisible = true;
          loader.render();
        }
      }
    },
    hide: () => {
      const loader = document.getElementById("global-loading");
      if (loader) {
        if (typeof loader.hide === "function") {
          loader.hide();
        } else {
          loader.isVisible = false;
          loader.render();
        }
      }
    },
  };
});
