// api base url
import { API_BASE_URL } from "../config/api.js";

// form untuk menambahkan catatan baru
class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="form-container">
        <h2 class="form-title">Add new note</h2>
        <div class="form-group" id="title-group">
          <label for="title">Title</label>
          <input type="text" id="title" placeholder="Note title">
          <span class="validation-message" data-error="required">Title is required</span>
          <span class="validation-message" data-error="minlength">Title must be at least 3 characters</span>
        </div>
        <div class="form-group" id="body-group">
          <label for="body">Body</label>
          <textarea id="body" placeholder="Note content"></textarea>
          <span class="validation-message" data-error="required">Body is required</span>
          <span class="validation-message" data-error="minlength">Body must be at least 5 characters</span>
        </div>
        <button id="add-note">Add Note</button>
      </div>
    `;

    const titleInput = this.querySelector("#title");
    const bodyInput = this.querySelector("#body");
    const titleGroup = this.querySelector("#title-group");
    const bodyGroup = this.querySelector("#body-group");

    // validasi input saat pengguna keluar dari field
    titleInput.addEventListener("blur", () => {
      this.validateField(titleInput, titleGroup, 3);
    });

    bodyInput.addEventListener("blur", () => {
      this.validateField(bodyInput, bodyGroup, 5);
    });

    // validasi secara realtime saat pengguna mengetik
    titleInput.addEventListener("input", () => {
      if (titleGroup.classList.contains("error")) {
        this.validateField(titleInput, titleGroup, 3);
      }
    });

    bodyInput.addEventListener("input", () => {
      if (bodyGroup.classList.contains("error")) {
        this.validateField(bodyInput, bodyGroup, 5);
      }
    });

    this.querySelector("#add-note").addEventListener("click", this.addNote.bind(this));
  }

  // fungsi validasi input
  validateField(inputElement, groupElement, minLength) {
    const value = inputElement.value.trim();

    groupElement.classList.remove("error");
    groupElement.removeAttribute("data-error-type");

    if (!value) {
      groupElement.classList.add("error");
      groupElement.setAttribute("data-error-type", "required");
      return false;
    } else if (value.length < minLength) {
      groupElement.classList.add("error");
      groupElement.setAttribute("data-error-type", "minlength");
      return false;
    }

    return true;
  }

  // fungsi untuk menambahkan catatan baru ke API
  async addNote() {
    const titleInput = this.querySelector("#title");
    const bodyInput = this.querySelector("#body");
    const titleGroup = this.querySelector("#title-group");
    const bodyGroup = this.querySelector("#body-group");

    const isTitleValid = this.validateField(titleInput, titleGroup, 3);
    const isBodyValid = this.validateField(bodyInput, bodyGroup, 5);

    if (!isTitleValid || !isBodyValid) {
      return;
    }

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // menampilkan indikator loading saat proses API berjalan
    if (window.globalLoader) {
      window.globalLoader.show();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(`Note "${title}" has been added successfully!`);

        titleInput.value = "";
        bodyInput.value = "";
        titleGroup.classList.remove("error");
        bodyGroup.classList.remove("error");

        document.querySelector("notes-list").renderNotes();
      } else {
        alert(`Failed to add note: ${result.message}`);
        if (window.globalLoader) {
          window.globalLoader.hide();
        }
      }
    } catch (error) {
      alert(`Error adding note: ${error.message}`);
      if (window.globalLoader) {
        window.globalLoader.hide();
      }
    }
  }
}
customElements.define("note-form", NoteForm);
