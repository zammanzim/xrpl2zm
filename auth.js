// === AUTH & USER HEADER HANDLER ===

// Ambil nama akun dari localStorage
const savedName = localStorage.getItem("studentName");

// Cek apakah mode guest
const isGuestMode =
    (!savedName && (location.hash === "#guest" || localStorage.getItem("guestMode") === "true"));

// Simpan mode guest agar pindah halaman tidak hilang
if (isGuestMode) {
    localStorage.setItem("guestMode", "true");
}

// Jika bukan login & bukan guest → suruh login
if (!savedName && !isGuestMode) {
    window.location.href = "login.html";
}

// Update Header UI
const headerName = document.getElementById("headerName");
const headerPP = document.getElementById("headerPP");

// ===== Global action untuk tombol logout ====
window.logoutUser = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("guestMode");
    window.location.href = "login.html";
};

// ===== Action tombol personalize =====
window.goPersonalize = () => {
    window.location.href = "profile.html";
};

window.goDashboard = () => {
    window.location.href = "dashboard.html";
};

console.log("[AUTH] User Status:", isGuestMode ? "GUEST" : savedName);

// === DROPDOWN PROFIL ===
const rightProfile = document.getElementById("rightProfile");
const profileMenu = document.getElementById("profileMenu");

if (rightProfile && profileMenu) {
    rightProfile.addEventListener("click", () => {
        profileMenu.style.display =
            profileMenu.style.display === "block" ? "none" : "block";
    });

    // Klik di luar menu → tutup profile menu
    document.addEventListener("click", (e) => {
        if (!rightProfile.contains(e.target) && !profileMenu.contains(e.target)) {
            profileMenu.style.display = "none";
        }
    });
}

if (isGuestMode) {
    headerName.innerText = "Hai, Seseorang";
    headerPP.src = "profpicture.png";

    // Sembunyikan menu yg butuh akun
    document.querySelectorAll("li[onclick='goPersonalize()'], li[onclick='logoutUser()']")
        .forEach(li => li.style.display = "none");

} else {
    headerName.innerText = "Hai, " + savedName +  " ▼";
    headerPP.src = "profpicture.png";
}