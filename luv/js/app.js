
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEjlqYYP13JhHi8t0aEEnqJZHDLJaHBKo",
  authDomain: "love-f6b13.firebaseapp.com",
  projectId: "love-f6b13",
  storageBucket: "love-f6b13.firebasestorage.app",
  messagingSenderId: "570515376980",
  appId: "1:570515376980:web:113cdf07093248b55b96c1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesRef = collection(db, "shared_notes");

function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}
window.switchTab = switchTab;

window.saveNote = async () => {
  const from = document.getElementById("note-from").value;
  const text = document.getElementById("note-text").value;
  if (!text.trim()) return;
  await addDoc(notesRef, { from, text, timestamp: serverTimestamp() });
  document.getElementById("note-text").value = "";
};

const savedNotes = document.getElementById("saved-notes");
onSnapshot(notesRef, snapshot => {
  savedNotes.innerHTML = "";
  snapshot.forEach(docSnap => {
    const note = docSnap.data();
    const div = document.createElement("div");
    div.className = "note-item";
    div.innerHTML = `
      <div><strong>${note.from}</strong>: ${note.text}</div>
      <small>${note.timestamp?.toDate().toLocaleString() || ""}</small>
      <div class="note-actions">
        <button onclick="deleteNote('${docSnap.id}')">🗑️</button>
      </div>
    `;
    savedNotes.appendChild(div);
  });
});

window.deleteNote = async (id) => {
  await deleteDoc(doc(notesRef, id));
};

const loveNotes = {
  morning: "Good morning sunshine ☀️ I hope you slept well...",
  sad: "I'm hugging you in my heart right now...",
  happy: "Yay! I’m so happy you’re happy 🥰...",
  miss: "I miss you too, more than words can say 💌..."
};
window.openNote = type => {
  document.getElementById("noteTitle").textContent = `Open me when... ${type}`;
  document.getElementById("noteContent").textContent = loveNotes[type];
  document.getElementById("notePopup").classList.add("active");
  document.getElementById("overlay").classList.add("active");
};
window.closeNote = () => {
  document.getElementById("notePopup").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
};
