const trackData = {
    station: {
        name: "Station",
        icon: "icons/station.png",
        vertical: 0.0,
        forward: 0.0,
        lateral: 0.0,
        speed: 0
    },

    straight: {
        name: "Straight",
        icon: "icons/straight.png",
        vertical: 0.0,
        forward: 0.0,
        lateral: 0.0,
        speed: 30
    },

    drop: {
        name: "Drop",
        icon: "icons/drop.png",
        vertical: -0.2,
        forward: 0.2,
        lateral: 0.0,
        speed: 60
    },

    "turn-left": {
        name: "Left Turn",
        icon: "icons/turn-left.png",
        vertical: 0.0,
        forward: 0.0,
        lateral: 1.0,
        speed: 50
    },

    "turn-right": {
        name: "Right Turn",
        icon: "icons/turn-right.png",
        vertical: 0.0,
        forward: 0.0,
        lateral: -1.0,
        speed: 50
    },

    lift: {
        name: "Chain Lift",
        icon: "icons/lift.png",
        vertical: 0.1,
        forward: -0.1,
        lateral: 0.0,
        speed: 15
    },

    launch: {
        name: "Launch",
        icon: "icons/launch.png",
        vertical: 0.0,
        forward: 2.0,
        lateral: 0.0,
        speed: 100
    },

    inversion: {
        name: "Inversion",
        icon: "icons/inversion.png",
        vertical: -0.8,
        forward: 0.0,
        lateral: 1.0,
        speed: 55
    }
};

const sequence = [];
let selectedIndex = -1;

const sequenceElement = document.getElementById("trackSequence");
const tokenOutput = document.getElementById("tokenOutput");
const cppOutput = document.getElementById("cppOutput");
const canvas = document.getElementById("forceGraph");
const ctx = canvas.getContext("2d");

document.querySelectorAll(".track-piece").forEach(piece => {
    piece.addEventListener("dragstart", event => {
        event.dataTransfer.setData("piece", piece.dataset.piece);
    });

    piece.addEventListener("click", () => {
        addPiece(piece.dataset.piece);
    });
});

sequenceElement.addEventListener("dragover", event => {
    event.preventDefault();
});

sequenceElement.addEventListener("drop", event => {
    event.preventDefault();

    const type = event.dataTransfer.getData("piece");

    if (type && trackData[type]) {
        addPiece(type);
    }
});

function addPiece(type) {
    sequence.push(type);
    selectedIndex = sequence.length - 1;
    render();
}

function removePiece(index) {
    sequence.splice(index, 1);

    if (selectedIndex >= sequence.length) {
        selectedIndex = sequence.length - 1;
    }

    render();
}

function render() {
    renderSequence();
    renderGraph();
    renderTokens();
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

        if (index === selectedIndex) {
            piece.classList.add("selected");
        }

        piece.innerHTML = `
            <img src="${data.icon}" alt="">
            <div>${index + 1}. ${data.name}</div>
            <div class="remove">click to remove</div>
        `;

        piece.addEventListener("click", () => {
            removePiece(index);
        });

        sequenceElement.appendChild(piece);
    });
}

function renderGraph() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;

    for (let y = 0; y <= height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.strokeStyle = "#999";

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    if (sequence.length === 0) {
        return;
    }

    const values = [];

    sequence.forEach(type => {
        const data = trackData[type];

        // A small sampled curve for each predefined track piece.
        for (let i = 0; i < 20; i++) {
            const t = i / 19;
            const shape = Math.sin(Math.PI * t);
            values.push(data.vertical * shape);
        }
    });

    const max = 2;

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;

    ctx.beginPath();

    values.forEach((value, index) => {
        const x = index / Math.max(values.length - 1, 1) * width;
        const y = height / 2 - (value / max) * (height * 0.4);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();
}

function renderTokens() {
    /*
     * This is intentionally only a placeholder.
     *
     * The actual project should decode the G-force waveform
     * instead of simply reading the track piece name.
     */

    const tokens = sequence.map(type => {
        switch (type) {
            case "drop":
                return "INT";
            case "turn-left":
                return "=";
            case "turn-right":
                return "-";
            case "launch":
                return ";";
            case "station":
                return "PRINT";
            case "lift":
                return "INPUT";
            case "inversion":
                return "WHILE";
            default:
                return null;
        }
    }).filter(Boolean);

    tokenOutput.textContent = tokens.length
        ? tokens.join("  ")
        : "// Tokens will appear here.";

    cppOutput.textContent = compile(tokens);
}

function compile(tokens) {
    if (!tokens.length) {
        return "// C++ output will appear here.";
    }

    let code =
`#include <iostream>
#include <string>

int main()
{
`;

    tokens.forEach(token => {
        if (token === "INT") {
            code += "    int value;\n";
        }

        if (token === "PRINT") {
            code += "    std::cout << value << std::endl;\n";
        }

        if (token === "INPUT") {
            code += "    std::cin >> value;\n";
        }

        if (token === ";") {
            code += "    // endline\n";
        }
    });

    code +=
`    return 0;
}`;

    return code;
}

window.addEventListener("resize", renderGraph);

render();
