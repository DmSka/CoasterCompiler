const previewCanvas = document.getElementById("previewCanvas");
const worldCanvas = document.getElementById("worldCanvas");
const graphCanvas = document.getElementById("graphCanvas");

const track = new Track(worldCanvas);
const editor = new TrackEditor(previewCanvas);
const simulator = new Simulator(new PhysicsEngine());
const files = new FileManager(track, simulator);
const tokenizer = new Tokenizer();
const compiler = new Compiler();

let currentGraph = "vertical";

function drawAll() {
    track.draw();
    editor.drawPreview();
    drawGraph();
    updateTrackCount();
}

function updateTrackCount() {
    const count = track.segments.length;
    document.getElementById("trackCount").textContent =
        `${count} segment${count === 1 ? "" : "s"}`;
}

function drawGraph() {
    const ctx = graphCanvas.getContext("2d");
    const width = graphCanvas.width;
    const height = graphCanvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#202328";
    ctx.fillRect(0, 0, width, height);

    const data = simulator.graphData[currentGraph] || [];

    if (data.length < 2) {
        ctx.fillStyle = "#8e969e";
        ctx.font = "13px Tahoma";
        ctx.fillText("Run simulation to generate graph data.", 20, 28);
        return;
    }

    const values = data.map(point => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 0.001);

    ctx.strokeStyle = "#4d555d";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
        const y = 15 + (height - 30) * (i / 5);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.strokeStyle = "#62a5e5";
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
        const x = (index / (data.length - 1)) * (width - 20) + 10;
        const y = height - 15 - ((point.value - min) / range) * (height - 30);

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.stroke();

    ctx.fillStyle = "#d5d9de";
    ctx.font = "11px Tahoma";
    ctx.fillText(
        `${currentGraph}  min: ${min.toFixed(2)}  max: ${max.toFixed(2)}`,
        10,
        14
    );
}

function showError(error) {
    console.error(error);
    alert(error instanceof Error ? error.message : String(error));
}

/* Track property buttons */
document.querySelectorAll(".track-button").forEach(button => {
    button.addEventListener("click", () => {
        editor.select(button.dataset.group, button.dataset.value);
    });
});

/* Operation settings */
document.getElementById("operationSpeed").addEventListener("input", event => {
    editor.currentPiece.speed = Number(event.target.value);
});

document.getElementById("operationAcceleration").addEventListener("input", event => {
    editor.currentPiece.acceleration = Number(event.target.value);
});

/* Build / update */
document.getElementById("buildButton").addEventListener("click", () => {
    try {
        const segment = editor.createSegment();

        if (editor.editingIndex !== null) {
            track.update(editor.editingIndex, segment);
            editor.exitEditMode();
        } else {
            track.add(segment);
        }

        drawAll();
    } catch (error) {
        showError(error);
    }
});

document.getElementById("cancelEditButton").addEventListener("click", () => {
    editor.exitEditMode();
});

document.getElementById("undoButton").addEventListener("click", () => {
    track.undo();
    editor.exitEditMode();
    drawAll();
});

document.getElementById("clearButton").addEventListener("click", () => {
    track.clear();
    editor.exitEditMode();
    drawAll();
});

/* Edit an existing segment by clicking it */
worldCanvas.addEventListener("click", event => {
    const index = track.hitTest(event);

    if (index !== null) {
        editor.loadSegment(track.segments[index], index);
    }
});

/* Simulation */
document.getElementById("simulateButton").addEventListener("click", () => {
    try {
        simulator.run(track.segments);
        drawGraph();

        const tokenText = tokenizer.tokenize(simulator.samples);
        document.getElementById("tokenizerOutput").value = tokenText;
        document.getElementById("compilerOutput").value =
            compiler.compile(tokenText);
    } catch (error) {
        showError(error);
    }
});

/* Graph tabs */
document.querySelectorAll(".graph-tab").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".graph-tab").forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");
        currentGraph = button.dataset.graph;
        drawGraph();
    });
});

/* Main tabs */
document.querySelectorAll(".main-tab").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".main-tab").forEach(tab => {
            tab.classList.remove("active");
        });

        document.querySelectorAll(".page").forEach(page => {
            page.classList.remove("active-page");
        });

        button.classList.add("active");

        const page = document.getElementById(button.dataset.page);
        if (page) page.classList.add("active-page");
    });
});

/* File buttons */
document.getElementById("saveTrackButton").addEventListener("click", () => {
    try {
        files.saveTrack();
    } catch (error) {
        showError(error);
    }
});

document.getElementById("loadTrackButton").addEventListener("click", () => {
    document.getElementById("loadTrackInput").click();
});

document.getElementById("loadTrackInput").addEventListener("change", async event => {
    if (!event.target.files.length) return;

    try {
        await files.loadTrack(event.target.files[0]);
        editor.exitEditMode();
        drawAll();
    } catch (error) {
        showError(error);
    }

    event.target.value = "";
});

document.getElementById("saveGraphButton").addEventListener("click", () => {
    try {
        files.saveGraph();
    } catch (error) {
        showError(error);
    }
});

document.getElementById("loadGraphButton").addEventListener("click", () => {
    document.getElementById("loadGraphInput").click();
});

document.getElementById("loadGraphInput").addEventListener("change", async event => {
    if (!event.target.files.length) return;

    try {
        await files.loadGraph(event.target.files[0]);
        drawGraph();
    } catch (error) {
        showError(error);
    }

    event.target.value = "";
});

window.addEventListener("resize", drawAll);

drawAll();
