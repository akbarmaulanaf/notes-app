// api base url
import { API_BASE_URL } from "../config/api.js";

// komponen untuk menampilkan daftar catatan
class NotesList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="notes-header">
        <h2 class="notes-section-title">Your Notes</h2>
        <div class="view-controls">
          <button id="view-active" class="view-btn active">Active Notes</button>
          <button id="view-archived" class="view-btn">Archived Notes</button>
        </div>
        <div class="search-container">
          <input type="text" id="search-notes" placeholder="Search notes...">
        </div>
      </div>
      <div class="notes-container"></div>
    `;

    // mengatur status tampilan (aktif atau arsip)
    this.isViewingArchived = false;

    // menunggu DOM selesai dimuat sebelum render awal
    setTimeout(() => {
      this.renderNotes();
    }, 0);

    // event listener untuk tombol pengalihan view
    const viewActiveBtn = this.querySelector("#view-active");
    const viewArchivedBtn = this.querySelector("#view-archived");

    viewActiveBtn.addEventListener("click", () => {
      if (this.isViewingArchived) {
        viewActiveBtn.classList.add("active");
        viewArchivedBtn.classList.remove("active");
        this.isViewingArchived = false;
        this.renderNotes();
      }
    });

    viewArchivedBtn.addEventListener("click", () => {
      if (!this.isViewingArchived) {
        viewArchivedBtn.classList.add("active");
        viewActiveBtn.classList.remove("active");
        this.isViewingArchived = true;
        this.renderNotes();
      }
    });

    // event listener untuk tombol aksi (hapus, arsip, batalkan arsip)
    this.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const noteId = e.target.getAttribute("data-id");
        this.deleteNote(noteId);
      } else if (e.target.classList.contains("archive-btn")) {
        const noteId = e.target.getAttribute("data-id");
        this.archiveNote(noteId);
      } else if (e.target.classList.contains("unarchive-btn")) {
        const noteId = e.target.getAttribute("data-id");
        this.unarchiveNote(noteId);
      }
    });

    // Fitur pencarian catatan
    const searchInput = this.querySelector("#search-notes");
    searchInput.addEventListener("input", () => {
      this.searchNotes(searchInput.value);
    });
  }

  // Fungsi untuk menampilkan catatan berdasarkan filter
  async renderNotes(searchTerm = "") {
    const container = this.querySelector(".notes-container");
    container.innerHTML = "<p>Loading notes...</p>";

    // Menampilkan indikator loading
    if (window.globalLoader) {
      window.globalLoader.show();
    }

    try {
      // Mengambil data dari endpoint yang sesuai (aktif atau arsip)
      const endpoint = this.isViewingArchived ? `${API_BASE_URL}/notes/archived` : `${API_BASE_URL}/notes`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.status !== "success") {
        container.innerHTML = `<p>Error loading notes: ${result.message}</p>`;
        return;
      }

      const notes = result.data || [];

      if (notes.length === 0) {
        container.innerHTML = this.isViewingArchived ? "<p>Tidak ada catatan yang diarsipkan.</p>" : "<p>Belum ada catatan. Buat catatan pertama Anda!</p>";
        return;
      }

      // Filter catatan berdasarkan kata kunci pencarian
      let filteredNotes = notes;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(term) || note.body.toLowerCase().includes(term));
      }

      if (filteredNotes.length === 0) {
        container.innerHTML = "<p>Tidak ada catatan yang cocok dengan pencarian Anda.</p>";
        return;
      }

      // Menyesuaikan teks dan fungsi tombol berdasarkan status arsip
      const actionBtn = this.isViewingArchived ? "unarchive-btn" : "archive-btn";
      const actionText = this.isViewingArchived ? "Unarchive" : "Archive";

      // Tampilkan catatan dalam format grid
      container.innerHTML = filteredNotes
        .map(
          (note) => `
        <div class="note">
          <div class="note-title">${note.title}</div>
          <div class="note-body">${note.body.replace(/\n/g, "<br>")}</div>
          <div class="note-footer">
            <button class="${actionBtn}" data-id="${note.id}">${actionText}</button>
            <button class="delete-btn" data-id="${note.id}">Delete</button>
          </div>
        </div>
      `
        )
        .join("");
    } catch (error) {
      container.innerHTML = `<p>Error loading notes: ${error.message}</p>`;
    } finally {
      // Sembunyikan indikator loading
      if (window.globalLoader) {
        window.globalLoader.hide();
      }
    }
  }

  // Fungsi pencarian catatan
  searchNotes(searchTerm) {
    this.renderNotes(searchTerm);
  }

  // Fungsi untuk mengarsipkan catatan
  async archiveNote(id) {
    // Menampilkan indikator loading
    if (window.globalLoader) {
      window.globalLoader.show();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/archive`, {
        method: "POST",
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Catatan berhasil diarsipkan!");
        this.renderNotes(this.querySelector("#search-notes").value);
      } else {
        alert(`Gagal mengarsipkan catatan: ${result.message}`);
        if (window.globalLoader) {
          window.globalLoader.hide();
        }
      }
    } catch (error) {
      alert(`Error saat mengarsipkan catatan: ${error.message}`);
      if (window.globalLoader) {
        window.globalLoader.hide();
      }
    }
  }

  // Fungsi untuk membatalkan arsip catatan
  async unarchiveNote(id) {
    // Menampilkan indikator loading
    if (window.globalLoader) {
      window.globalLoader.show();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/unarchive`, {
        method: "POST",
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Catatan berhasil dibatalkan dari arsip!");
        this.renderNotes(this.querySelector("#search-notes").value);
      } else {
        alert(`Gagal membatalkan arsip catatan: ${result.message}`);
        if (window.globalLoader) {
          window.globalLoader.hide();
        }
      }
    } catch (error) {
      alert(`Error saat membatalkan arsip catatan: ${error.message}`);
      if (window.globalLoader) {
        window.globalLoader.hide();
      }
    }
  }

  // Fungsi untuk menghapus catatan
  async deleteNote(id) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus catatan ini?");

    if (!confirmDelete) {
      return;
    }

    // Menampilkan indikator loading
    if (window.globalLoader) {
      window.globalLoader.show();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Catatan berhasil dihapus!");
        this.renderNotes(this.querySelector("#search-notes").value);
      } else {
        alert(`Gagal menghapus catatan: ${result.message}`);
        if (window.globalLoader) {
          window.globalLoader.hide();
        }
      }
    } catch (error) {
      alert(`Error saat menghapus catatan: ${error.message}`);
      if (window.globalLoader) {
        window.globalLoader.hide();
      }
    }
  }
}
customElements.define("notes-list", NotesList);

// Inisialisasi aplikasi saat DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
  const notesList = document.querySelector("notes-list");
  if (notesList && notesList.isConnected) {
    // Tidak perlu memanggil renderNotes di sini karena sudah dipanggil dalam connectedCallback
  }
});
