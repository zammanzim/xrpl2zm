import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

// ========== CHECK LOGIN ==========
const savedName = localStorage.getItem("studentName");
if (!savedName) location.href = "/login.html";

// ========== ELEMENTS ==========
const headerPP = document.getElementById("headerPP");
const headerName = document.getElementById("headerName");

const savedPP = localStorage.getItem("cachedPP");
if (savedPP) {
    headerPP.src = savedPP;
}

// ========== LOAD USER DATA ==========
const userRef = ref(db, "users/" + savedName);
get(userRef).then(snap => {
    const data = snap.val() || {};


    headerName.innerText = "Hai, " + savedName + " ▼";

    let imgPath = `./studentsprofile/${savedName}.jpg`;
    headerPP.src = imgPath;

    headerPP.onload = () => localStorage.setItem("cachedPP", imgPath);

    headerPP.onerror = () => {
        headerPP.src = "profpicture.png";
        localStorage.setItem("cachedPP", "profpicture.png");
    };
});

// Nama file halaman untuk generate link
const fileName = window.location.pathname.split("/").pop();

// Cek nama mapel dari halaman
const mapel = document.querySelector(".left-section h1")?.innerText || "Tanpa Mapel";

// Ambil semua tugas berdasarkan <hr id="">
const taskIDs = document.querySelectorAll("hr[id]");

taskIDs.forEach(async (hr) => {
    const id = hr.getAttribute("id");
    const card = hr.nextElementSibling;
    if (!id || !card?.classList.contains("course-card")) return;

    // Cek apakah tugas ini sudah ada di Firebase
    const taskRef = ref(db, "tasks/" + id);
    const snap = await get(taskRef);

    if (snap.exists()) {
        console.log(`⚠ Skip ID ${id} (sudah ada di database)`);
        return;
    }

    const judul = card.querySelector(".headercoursecard h3")?.innerText || `Tugas ${mapel}`;
    const nomorText = card.querySelector("h4")?.innerText || "";
    const nomor = parseInt(nomorText.replace(/\D/g, "")) || Number(id);
    const desc = card.querySelector("p")?.innerText || "Tidak ada deskripsi tugas.";
    const tugasLink = `${fileName}#${id}`;

    const tugasData = {
        id: Number(id),
        mapel,
        judul,
        nomor,
        tugas: desc,
        link: tugasLink
    };

    await set(taskRef, tugasData);
    console.log(`🆕 Uploaded -> ID: ${id}`);
});

// ========== VISITOR SYSTEM PREMIUM VERSION ==========
const pageName = document.body.dataset.page || "unknown_page";
const visitorText = document.getElementById("visitorCounter");

// Elements popup
const visitorPopup = document.getElementById("visitorPopup");
const visitorTodayEl = document.getElementById("visitorToday");
const visitorTotalEl = document.getElementById("visitorTotal");
const visitorListEl = document.getElementById("visitorList");

// Ambil PP user
const profilePicPath = `./studentsprofile/${savedName}.jpg`;
const fallbackPP = "profpicture.png";

// Format tanggal versi lu
function formatVisitDate() {
    const now = new Date();
    if (now.getHours() >= 15) now.setDate(now.getDate() + 1);

    const hari = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"][now.getDay()];
    const bulan = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGT", "SEP", "OKT", "NOV", "DES"][now.getMonth()];
    const jam = String(now.getHours()).padStart(2, "0");
    const menit = String(now.getMinutes()).padStart(2, "0");
    return `${jam}.${menit} ${hari}, ${now.getDate()} ${bulan} ${now.getFullYear()}`;
}

const todayKey = formatVisitDate().split(",")[1].trim(); // Key harian
const visitKey = `${pageName}_${savedName}_${todayKey}`;

// RESET jika hari berubah
get(ref(db, `visitors/${pageName}/lastDay`)).then(s => {
    if (s.val() !== todayKey) {
        set(ref(db, `visitors/${pageName}/today`), {});
        set(ref(db, `visitors/${pageName}/lastDay`), todayKey);
    }
});

// CATAT visit baru
if (!localStorage.getItem(visitKey)) {
    set(ref(db, `visitors/${pageName}/today/${savedName}`), {
        visitTime: formatVisitDate(),
        pp: profilePicPath
    });

    set(ref(db, `visitors/${pageName}/allUsers/${savedName}`), true);

    get(ref(db, `visitors/${pageName}/totalCount`)).then(snap => {
        const count = snap.val() || 0;
        set(ref(db, `visitors/${pageName}/totalCount`), count + 1);
    });

    localStorage.setItem(visitKey, "true");
}

// UPDATE realtime UI
onValue(ref(db, `visitors/${pageName}`), snap => {
    const data = snap.val() || {};
    const todayData = data.today || {};

    const todayCount = Object.keys(todayData).length;
    const totalCount = data.totalCount || 0;

    visitorText.innerHTML = `<i class="fa-solid fa-eye"></i> ${todayCount}`;

    if (visitorTodayEl) visitorTodayEl.innerText = todayCount;
    if (visitorTotalEl) visitorTotalEl.innerText = totalCount;

    if (visitorListEl) {
        visitorListEl.innerHTML =
            Object.entries(todayData)
                .map(([name, info]) => `
                <div class="visitorCard">
                    <img class="visitorPP" src="${info.pp || fallbackPP}">
                    <div class="visitorInfo">
                        <b>${name}</b>
                        <small>Visited at: ${info.visitTime}</small>
                    </div>
                </div>
            `).join("") || "<p>- No Visitor Today -</p>";
    }
});

// Buka popup
visitorText.addEventListener("click", () => visitorPopup.classList.add("active"));
window.closeVisitorPopup = () => visitorPopup.classList.remove("active");
