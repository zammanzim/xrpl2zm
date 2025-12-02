import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// FIREBASE CONFIG (SAMA PERSIS)
const firebaseConfig = {
    apiKey: "AIzaSyAI4c2PwPXOOc90e6Rris7qbAwKojnB5Qc",
    authDomain: "xrpl2web.firebaseapp.com",
    databaseURL: "https://xrpl2web-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "xrpl2web",
    storageBucket: "xrpl2web.appspot.com",
    messagingSenderId: "410193641417",
    appId: "1:410193641417:web:a7da663d744703e4883218"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// USER LOGIN
const savedName = localStorage.getItem("studentName");
if (!savedName) location.href = "/login";

// LOAD STATUS TUGAS
get(ref(db, "users/" + savedName + "/tugas")).then(snap => {
    const status = snap.val() || {};

    // BACA SEMUA CHECKBOX DI HALAMAN
    document.querySelectorAll("input[type='checkbox'][data-id]").forEach(cb => {
        const id = cb.getAttribute("data-id");
        cb.checked = status[id] === true; // SET STATUS

        cb.addEventListener("change", () => {
            update(ref(db, "users/" + savedName + "/tugas"), {
                [id]: cb.checked
            });
        });
    });
});
