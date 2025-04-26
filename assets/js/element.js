const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"), 10);

async function loadElement() {
    const lang = localStorage.getItem("lang") || "en";
    const [elements, translations] = await Promise.all([
        fetch("data/elements.json").then(res => res.json()),
        fetch("data/translations.json").then(res => res.json())
    ]);
    const t = translations[lang];
    const el = elements.find(e => e.id === id);

    if (!el) return;

    document.getElementById("element-title").textContent = el.symbol;
    document.getElementById("config-title").textContent = t.config;


    const details = document.getElementById("element-details");
    details.innerHTML = `
    <div class="z">${el.z}</div>
    <div class="symbol">${el.symbol}</div>
    <div class="a">${el.a}</div>
    <div>${el.name[lang]}</div>
    <div>${t[el.category]}</div>
  `;

    drawShellDiagram(el.electrons);
    drawLewisNotation(el.electrons[el.electrons.length - 1]);

    const backBtn = document.getElementById("back-btn");
    backBtn.onclick = () => window.location.href = "index.html";
    backBtn.textContent = t.back;
}

function drawShellDiagram(electrons) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    const cx = 100, cy = 100;
    const baseRadii = [30, 50, 70, 90, 110, 130];

    // Find needed size
    const lastOccupiedShell = electrons.length - 1;
    const neededRadius = baseRadii[lastOccupiedShell] || 130;
    const totalSize = (neededRadius + 20) * 2; // +20 margin for electrons

    svg.setAttribute("viewBox", `0 0 ${totalSize} ${totalSize}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "auto");

    const centerX = totalSize / 2;
    const centerY = totalSize / 2;

    electrons.forEach((count, i) => {
        const radius = baseRadii[i];
        if (radius === undefined) return;

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", centerX);
        circle.setAttribute("cy", centerY);
        circle.setAttribute("r", radius);
        circle.setAttribute("stroke", "var(--text)");
        circle.setAttribute("fill", "none");
        svg.appendChild(circle);

        for (let j = 0; j < count; j++) {
            const angle = (2 * Math.PI * j) / count;
            const ex = centerX + radius * Math.cos(angle);
            const ey = centerY + radius * Math.sin(angle);

            const electron = document.createElementNS(svgNS, "circle");
            electron.setAttribute("cx", ex);
            electron.setAttribute("cy", ey);
            electron.setAttribute("r", 3);
            electron.setAttribute("fill", "var(--text)");
            svg.appendChild(electron);
        }
    });

    const container = document.getElementById("shell-diagram");
    container.innerHTML = "";
    container.appendChild(svg);
}


function drawLewisNotation(electronShells) {
    const container = document.getElementById("lewis-notation");
    container.innerHTML = "";

    const subshells = ["s", "p", "d", "f"];
    const fullConfig = [];

    let shellNumber = 1;
    for (let i = 0; i < electronShells.length; i++) {
        let remaining = electronShells[i];
        let subs = [];

        if (remaining > 0) {
            if (remaining >= 2) {
                subs.push(`${shellNumber}s2`);
                remaining -= 2;
            } else if (remaining === 1) {
                subs.push(`${shellNumber}s1`);
                remaining -= 1;
            }

            if (remaining > 0) {
                subs.push(`${shellNumber}p${remaining}`);
            }

            fullConfig.push(...subs);
        }
        shellNumber++;
    }

    const span = document.createElement("span");
    span.textContent = fullConfig.join(" ");
    container.appendChild(span);
}


loadElement();
