async function importData() {
    const lang = localStorage.getItem("lang") || "en";

    const [elements, translations] = await Promise.all([
        fetch("data/elements.json").then(res => res.json()),
        fetch("data/translations.json").then(res => res.json()),
    ]);

    const t = translations[lang];
    document.getElementById("title").textContent = t.title;

    const table = document.getElementById("table");
    const lanth = document.querySelector(".lanthanides");
    const actin = document.querySelector(".actinides");

    elements.forEach(el => {
        const div = document.createElement("div");
        div.className = "element";
        div.style.borderColor = categoryColors[el.category] || "gray";
        div.onclick = () => location.href = `element.html?id=${el.id}`;
        div.innerHTML = `
    <div class="z">${el.z}</div>
    <div class="symbol">${el.symbol}</div>
    <div class="a">${el.a}</div>
    <div class="tooltip">${t[el.category]} - ${el.name[lang]}</div>
  `;

        // Lanthanides (Z 58–71)
        if (el.z >= 58 && el.z <= 71) {
            lanth.appendChild(div);
        }
        // Actinides (Z 90–103)
        else if (el.z >= 90 && el.z <= 103) {
            actin.appendChild(div);
        }
        // Main table
        else {
            div.style.gridColumn = el.column;
            div.style.gridRow = el.row;
            table.appendChild(div);
        }
    });


    renderLegend(t);
}

const categoryColors = {
    "alkali": "#e06666",
    "alkaline-earth": "#f6b26b",
    "transition": "#ffd966",
    "post-transition": "#93c47d",
    "metalloid": "#76a5af",
    "nonmetal": "#6fa8dc",
    "halogen": "#8e7cc3",
    "noble-gas": "#c27ba0",
    "lanthanide": "#d9d2e9",
    "actinide": "#ead1dc"
};

function renderLegend(t) {
    const legend = document.getElementById("legend");
    Object.entries(categoryColors).forEach(([key, color]) => {
        const div = document.createElement("div");
        div.className = "legend-item";
        div.innerHTML = `<span style="border: 3px solid ${color}; width: 16px; height: 16px; display: inline-block; border-radius: 4px;"></span> ${t[key]}`;
        legend.appendChild(div);
    });
}

importData();
