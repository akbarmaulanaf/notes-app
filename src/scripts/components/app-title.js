// judul aplikasi
class AppTitle extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h1>
        <span class="highlight">AKBAR'S</span> NOTES APP
      </h1>
    `;
  }
}
customElements.define("app-title", AppTitle);
