function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    if (window.innerWidth >= 1024) {
        sidebar.classList.toggle('closed');
        mainContent.classList.toggle('shifted');
    } else {
        sidebar.classList.toggle('open');
    }
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchPage();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const toggles = document.querySelectorAll(".toggle-btn");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const gallery = toggle.nextElementSibling;

            if (gallery.classList.contains("show")) {
                gallery.classList.remove("show");
                toggle.classList.remove("active");
            } else {
                gallery.classList.add("show");
                toggle.classList.add("active");
            }
        });
    });
});

const overlay = document.getElementById('imgOverlay');
const overlayImg = document.getElementById('overlayImg');
const overlayHeader = document.getElementById('imgHeader');
const overlayFooter = document.getElementById('imgFooter');
const btnClose = document.getElementById('overlayClose');
const btnPrev = document.getElementById('overlayPrev');
const btnNext = document.getElementById('overlayNext');
const allImages = Array.from(document.querySelectorAll('.gallery img'));
let currentIndex = 0;
let scrollY = 0;

function showOverlay() {
    scrollY = window.scrollY;

    document.body.dataset.scrollY = scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    overlay.classList.add('active');

    const img = allImages[currentIndex];
    overlayImg.src = img.src;
    const card = img.closest('.course-card');
    const title = card?.querySelector('h3')?.innerText || '';
    const subtitle = card?.querySelector('h4')?.innerText || '';
    const desc = card?.querySelector('p')?.innerText || '';

    overlayHeader.innerHTML = `
    <h3>${title}</h3>
    <h4>${subtitle}</h4>
  `;
    overlayFooter.innerHTML = `<p>${desc}</p>`;

    updateArrows();
}

function closeOverlay() {
    overlay.classList.remove('active');

    const y = parseInt(document.body.dataset.scrollY || '0');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, y);
}

function prevImg() {
    if (currentIndex > 0) {
        currentIndex--;
        showOverlay();
    }
}

function nextImg() {
    if (currentIndex < allImages.length - 1) {
        currentIndex++;
        showOverlay();
    }
}

function updateArrows() {
    btnPrev.classList.toggle('hidden', currentIndex === 0);
    btnNext.classList.toggle('hidden', currentIndex === allImages.length - 1);
}

allImages.forEach((img, i) => {
    img.addEventListener('click', () => {
        currentIndex = i;
        showOverlay();
    });
});

btnClose.addEventListener('click', closeOverlay);
btnPrev.addEventListener('click', prevImg);
btnNext.addEventListener('click', nextImg);

document.addEventListener('keydown', (e) => {
    if (overlay.classList.contains('active')) {
        if (e.key === 'Escape') closeOverlay();
        if (e.key === 'ArrowLeft') prevImg();
        if (e.key === 'ArrowRight') nextImg();
    }
});
