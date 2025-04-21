// impor komponen-komponen aplikasi
import "./components/app-title.js";
import "./components/note-form.js";
import "./components/notes-list.js";
import "./components/loading-indicator.js";

// fungsi utama yang menjalankan aplikasi saat halaman dimuat
function main() {
  // memastikan semua komponen didefinisikan dan siap digunakan
  const appTitle = document.querySelector("app-title");
  const noteForm = document.querySelector("note-form");
  const notesList = document.querySelector("notes-list");

  // inisialisasi loading indicator sebagai utilitas global
  const loadingIndicator = document.createElement("loading-indicator");
  document.body.appendChild(loadingIndicator);
}

// menjalankan aplikasi setelah DOM selesai dimuat
document.addEventListener("DOMContentLoaded", main);
