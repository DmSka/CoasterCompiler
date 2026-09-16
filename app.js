const trackData = {
    station: { name: "Station", icon: "icons/station.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    straight: { name: "Straight", icon: "icons/straight.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    drop: { name: "Drop", icon: "icons/drop.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    "turn-left": { name: "Left Turn", icon: "icons/turn-left.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    "turn-right": { name: "Right Turn", icon: "icons/turn-right.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    lift: { name: "Chain Lift", icon: "icons/lift.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    launch: { name: "Launch", icon: "icons/launch.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    inversion: { name: "Inversion", icon: "icons/inversion.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    brake: { name: "Brake", icon: "icons/brake.png", vertical: 0, forward: 0, lateral: 0, speed: 0 },
    "block-brake": { name: "Block Brake", icon: "icons/block-brake.png", vertical: 0, forward: 0, lateral: 0, speed: 0 }
};

const graphInfo = {
    vertical: { title: "Vertical G-force", units: "G" },
    forward: { title: "Forward G-force", units: "G" },
    lateral: { title: "Lateral G-force", units: "G" },
    speed: { title: "Speed", units: "mph" }
};

const sequence = [];
let activeGraph = "vertical";
const samplesPerPiece = 20;

const sequenceElement = document.getElementById("trackSequence");
const tokenOutput = document.getElementById("tokenOutput");
const cppOutput = document.getElementById("cppOutput");
const canvas = document.getElementById("forceGraph");
const ctx = canvas.getContext("2d");

// Track pieces can be clicked or dragged into the sequence.
document.querySelectorAll(".track-piece").forEach(piece => {
    piece.addEventListener("dragstart", event => {
        event.dataTransfer.setData("piece", piece.dataset.piece);
    });
    piece.addEventListener("click", () => addPiece(piece.dataset.piece));
});

sequenceElement.addEventListener("dragover", event => event.preventDefault());
sequenceElement.addEventListener("drop", event => {
    event.preventDefault();
    const type = event.dataTransfer.getData("piece");
    if (type && trackData[type]) addPiece(type);
});

document.querySelectorAll(".graph-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        activeGraph = tab.dataset.graph;
        document.querySelectorAll(".graph-tab").forEach(button => button.classList.remove("active"));
        tab.classList.add("active");
        updateGraphHeading();
        renderGraph();
    });
});

document.getElementById("saveJson").addEventListener("click", saveJson);
document.getElementById("saveCsv").addEventListener("click", saveCsv);

function addPiece(type) {
    sequence.push(type);
    render();
}

function removePiece(index) {
    sequence.splice(index, 1);
    render();
}

function render() {
    renderSequence();
}

function renderSequence() {
    sequenceElement.innerHTML = "";
    if (sequence.length === 0) {
        const message = document.createElement("p");
        message.id = "emptyMessage";
        message.textContent = "Drag track pieces here.";
        sequenceElement.appendChild(message);
        return;
    }

    sequence.forEach((type, index) => {
        const data = trackData[type];
        const piece = document.createElement("div");
        piece.className = "sequence-piece";
        piece.innerHTML = `
            <img src="${data.icon}" alt="">
            <div>${index + 1}. ${data.name}</div>
            <div class="remove">click to remove</div>
        `;
        piece.addEventListener("click", () => removePiece(index));
        sequenceElement.appendChild(piece);
    });
}

function getCoasterData() {
    const data = [];
    let time = 0;

    sequence.forEach((type, pieceIndex) => {
        const piece = trackData[type];
        for (let i = 0; i < samplesPerPiece; i++) {
            const t = i / (samplesPerPiece - 1);
            const shape = Math.sin(Math.PI * t);
            const edge = 0.5 + 0.5 * Math.cos(2 * Math.PI * t);

            const vertical = piece.vertical * shape;
            const forward = piece.forward * shape;
            const lateral = piece.lateral * shape;
            const speed = piece.speed * (0.7 + 0.3 * edge);

            data.push({
                time: Number(time.toFixed(3)),
                piece: pieceIndex + 1,
                track: piece.name,
                vertical: Number(vertical.toFixed(4)),
                forward: Number(forward.toFixed(4)),
                lateral: Number(lateral.toFixed(4)),
                speed: Number(speed.toFixed(2))
            });
            time += 0.05;
        }
    });

    return data;
}

function saveJson() {
    const output = {
        format: "Coaster Code G-force data",
        version: 1,
        sampleIntervalSeconds: 0.05,
        trackSequence: sequence.map(type => trackData[type].name),
        samples: getCoasterData()
    };
    downloadFile("coaster-data.json", JSON.stringify(output, null, 2), "application/json");
}

function saveCsv() {
    const rows = getCoasterData();
    const header = "time,piece,track,vertical_g,forward_g,lateral_g,speed_kmh";
    const lines = rows.map(row => [
        row.time,
        row.piece,
        csvEscape(row.track),
        row.vertical,
        row.forward,
        row.lateral,
        row.speed
    ].join(","));
    downloadFile("coaster-data.csv", [header, ...lines].join("\n"), "text/csv");
}

function csvEscape(value) {
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

window.addEventListener("resize", renderGraph);
updateGraphHeading();
render();
