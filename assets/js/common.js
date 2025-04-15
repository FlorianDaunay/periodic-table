// Dark/light mode toggle
const toggle = document.getElementById("theme-toggle");
const html = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) html.setAttribute("data-theme", savedTheme);

toggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

// Language switcher
const langSelect = document.getElementById("lang-select");
const savedLang = localStorage.getItem("lang") || "en";
langSelect.value = savedLang;

langSelect.addEventListener("change", () => {
    localStorage.setItem("lang", langSelect.value);
    location.reload();
});

const currentLang = localStorage.getItem("lang") || "en";
document.querySelectorAll(".lang-switch img").forEach(img => {
    if (img.dataset.lang === currentLang) {
        img.classList.add("active");
    }

    img.addEventListener("click", () => {
        localStorage.setItem("lang", img.dataset.lang);
        location.reload();
    });
});