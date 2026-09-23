/* ============================================================
   COASTER CODE
   Main application
   ============================================================ */


/* ============================================================
   TRACK STATE
   ============================================================ */

const currentPiece = {

    direction: "left",

    slope: "straight",

    banking: "none",

    operation: "none"

};


/* ============================================================
   TRACK LAYOUT
   ============================================================ */

let coaster = [];

let history = [];


/*
    Current world position.

    x/y = horizontal isometric position
    z   = coaster height
*/

let worldPosition = {
    x: 0,
    y: 0,
    z: 0
};


/* ============================================================
   CANVAS SETUP
   ============================================================ */

const worldCanvas = document.getElementById("worldCanvas");
const worldContext = worldCanvas.getContext("2d");

const previewCanvas = document.getElementById("previewCanvas");
const previewContext = previewCanvas.getContext("2d");

const graphCanvas = document.getElementById("graphCanvas");
const graphContext = graphCanvas.getContext("2d");


/* ============================================================
   EDITOR BUTTONS
   ============================================================ */

const trackButtons =
    document.querySelectorAll(".track-button");


trackButtons.forEach(button => {

    button.addEventListener("click", () => {

        const group = button.dataset.group;
        const value = button.dataset.value;

        currentPiece[group] = value;

        /*
            Only one property in each group
            can be selected at once.
        */

        document
            .querySelectorAll(
                `.track-button[data-group="${group}"]`
            )
            .forEach(otherButton => {

                otherButton.classList.remove("active");

            });

        button.classList.add("active");

        updatePreview();

    });

});


/* ============================================================
   DRAW TRACK
   ============================================================ */

function drawTrackPiece(
    context,
    x,
    y,
    piece,
    scale = 1
) {

    context.save();

    context.translate(x, y);

    /*
        Convert slope into a visual vertical displacement.
    */

    let slopeAngle = 0;

    switch (piece.slope) {

        case "down-vertical":
            slopeAngle = Math.PI * 0.42;
            break;

        case "down-steep":
            slopeAngle = Math.PI * 0.25;
            break;

        case "down-shallow":
            slopeAngle = Math.PI * 0.10;
            break;

        case "straight":
            slopeAngle = 0;
            break;

        case "up-shallow":
            slopeAngle = -Math.PI * 0.10;
            break;

        case "up-steep":
            slopeAngle = -Math.PI * 0.25;
            break;

        case "up-vertical":
            slopeAngle = -Math.PI * 0.42;
            break;

    }


    /*
        Direction changes the track orientation.
    */

    let directionAngle = 0;

    if (piece.direction === "left") {
        directionAngle = -Math.PI * 0.15;
    }

    if (piece.direction === "right") {
        directionAngle = Math.PI * 0.15;
    }


    const angle =
        slopeAngle + directionAngle;


    /*
        Banking changes the visible rotation
        of the rails.
    */

    let bankAngle = 0;

    switch (piece.banking) {

        case "vertical-left":
            bankAngle = -Math.PI * 0.42;
            break;

        case "left":
            bankAngle = -Math.PI * 0.15;
            break;

        case "none":
            bankAngle = 0;
            break;

        case "right":
            bankAngle = Math.PI * 0.15;
            break;

        case "vertical-right":
            bankAngle = Math.PI * 0.42;
            break;

    }


    /*
        Track dimensions.
    */

    const length = 105 * scale;
    const railSpacing = 15 * scale;

    const dx = Math.cos(angle) * length;
    const dy = Math.sin(angle) * length;


    /*
        Calculate perpendicular direction
        for the second rail.
    */

    const px =
        Math.cos(angle + Math.PI / 2) *
        railSpacing;

    const py =
        Math.sin(angle + Math.PI / 2) *
        railSpacing;


    /*
        Track supports.
    */

    context.strokeStyle = "#555b58";
    context.lineWidth = 4 * scale;

    context.beginPath();

    context.moveTo(
        -px,
        -py + 5 * scale
    );

    context.lineTo(
        -px,
        -py + 35 * scale
    );

    context.moveTo(
        px,
        py + 5 * scale
    );

    context.lineTo(
        px,
        py + 35 * scale
    );

    context.stroke();


    /*
        Rotate rails according to banking.
    */

    context.save();

    context.rotate(bankAngle);


    /*
        Main rails.
    */

    context.strokeStyle = "#343a3d";
    context.lineWidth = 5 * scale;

    context.beginPath();

    context.moveTo(-px, -py);
    context.lineTo(dx - px, dy - py);

    context.moveTo(px, py);
    context.lineTo(dx + px, dy + py);

    context.stroke();


    /*
        Highlight on rails.
    */

    context.strokeStyle = "#858c90";
    context.lineWidth = 2 * scale;

    context.beginPath();

    context.moveTo(-px, -py - 2);
    context.lineTo(dx - px, dy - py - 2);

    context.moveTo(px, py - 2);
    context.lineTo(dx + px, dy + py - 2);

    context.stroke();


    /*
        Cross ties.
    */

    const tieCount = 6;

    for (let i = 0; i <= tieCount; i++) {

        const t = i / tieCount;

        const cx = dx * t;
        const cy = dy * t;

        const crossX =
            Math.cos(angle + Math.PI / 2) *
            (railSpacing + 4 * scale);

        const crossY =
            Math.sin(angle + Math.PI / 2) *
            (railSpacing + 4 * scale);

        context.strokeStyle = "#5e5144";
        context.lineWidth = 3 * scale;

        context.beginPath();

        context.moveTo(
            cx - crossX,
            cy - crossY
        );

        context.lineTo(
            cx + crossX,
            cy + crossY
        );

        context.stroke();

    }

    context.restore();


    /*
        Operation graphics.
    */

    if (piece.operation === "lift") {

        context.strokeStyle = "#777";
        context.lineWidth = 3 * scale;

        for (let i = 0; i < 5; i++) {

            const t = i / 4;

            const cx = dx * t;
            const cy = dy * t;

            context.beginPath();

            context.moveTo(
                cx - 5 * scale,
                cy - 4 * scale
            );

            context.lineTo(
                cx + 5 * scale,
                cy + 4 * scale
            );

            context.stroke();

        }

    }


    if (piece.operation === "brake") {

        context.strokeStyle = "#555";
        context.lineWidth = 7 * scale;

        context.beginPath();

        context.moveTo(
            dx * 0.35,
            dy * 0.35
        );

        context.lineTo(
            dx * 0.65,
            dy * 0.65
        );

        context.stroke();

    }


    if (piece.operation === "launch") {

        context.strokeStyle = "#40484b";
        context.lineWidth = 4 * scale;

        for (let i = 0; i < 3; i++) {

            const t =
                0.25 + i * 0.18;

            const cx = dx * t;
            const cy = dy * t;

            context.beginPath();

            context.moveTo(
                cx,
                cy
            );

            context.lineTo(
                cx + 10 * scale,
                cy - 5 * scale
            );

            context.stroke();

        }

    }


    context.restore();
}


/* ============================================================
   PREVIEW
   ============================================================ */

function updatePreview() {

    const width = previewCanvas.width;
    const height = previewCanvas.height;

    previewContext.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        Background.
    */

    previewContext.fillStyle = "#9ca68e";

    previewContext.fillRect(
        0,
        0,
        width,
        height
    );


    /*
        Isometric-style ground.
    */

    previewContext.strokeStyle = "#7f896f";
    previewContext.lineWidth = 1;

    for (let x = -height; x < width; x += 25) {

        previewContext.beginPath();

        previewContext.moveTo(x, 0);
        previewContext.lineTo(x + height, height);

        previewContext.stroke();

    }


    for (let x = 0; x < width + height; x += 25) {

        previewContext.beginPath();

        previewContext.moveTo(x, 0);
        previewContext.lineTo(x - height, height);

        previewContext.stroke();

    }


    drawTrackPiece(
        previewContext,
        width / 2 - 50,
        height / 2,
        currentPiece,
        0.9
    );


    /*
        Show selected properties.
    */

    previewContext.fillStyle = "#202020";
    previewContext.font = "12px Tahoma";

    previewContext.fillText(
        currentPiece.direction,
        8,
        18
    );

    previewContext.fillText(
        currentPiece.slope,
        8,
        34
    );

    previewContext.fillText(
        currentPiece.banking,
        8,
        50
    );

    previewContext.fillText(
        currentPiece.operation,
        8,
        66
    );

}


/* ============================================================
   BUILD PIECE
   ============================================================ */

document
    .getElementById("buildButton")
    .addEventListener("click", buildPiece);


function buildPiece() {

    /*
        Save state for Undo.
    */

    history.push(
        JSON.parse(JSON.stringify(coaster))
    );


    const piece = {

        id: crypto.randomUUID(),

        direction: currentPiece.direction,

        slope: currentPiece.slope,

        banking: currentPiece.banking,

        operation: currentPiece.operation,

        position: {
            x: worldPosition.x,
            y: worldPosition.y,
            z: worldPosition.z
        }

    };


    coaster.push(piece);


    /*
        Advance world position.

        This is only the frontend geometry for now.
        The actual physics will eventually be handled
        by the C++ simulation.
    */

    const step = 110;

    if (currentPiece.direction === "straight") {

        worldPosition.x += step;

    }

    if (currentPiece.direction === "left") {

        worldPosition.x += step * 0.75;
        worldPosition.y -= step * 0.35;

    }

    if (currentPiece.direction === "right") {

        worldPosition.x += step * 0.75;
        worldPosition.y += step * 0.35;

    }


    /*
        Change height.
    */

    switch (currentPiece.slope) {

        case "down-vertical":
            worldPosition.z -= 100;
            break;

        case "down-steep":
            worldPosition.z -= 55;
            break;

        case "down-shallow":
            worldPosition.z -= 25;
            break;

        case "straight":
            break;

        case "up-shallow":
            worldPosition.z += 25;
            break;

        case "up-steep":
            worldPosition.z += 55;
            break;

        case "up-vertical":
            worldPosition.z += 100;
            break;

    }


    drawWorld();

    updateStatus();

    generateSimulationData();

}


/* ============================================================
   WORLD RENDERING
   ============================================================ */

function drawWorld() {

    const width = worldCanvas.width;
    const height = worldCanvas.height;


    worldContext.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        Terrain.
    */

    worldContext.fillStyle = "#8e987d";

    worldContext.fillRect(
        0,
        0,
        width,
        height
    );


    /*
        Isometric terrain grid.
    */

    worldContext.strokeStyle = "#7e896e";
    worldContext.lineWidth = 1;

    const gridSize = 40;

    for (
        let x = -height;
        x < width + height;
        x += gridSize
    ) {

        worldContext.beginPath();

        worldContext.moveTo(x, 0);
        worldContext.lineTo(x + height, height);

        worldContext.stroke();

    }


    for (
        let x = 0;
        x < width + height;
        x += gridSize
    ) {

        worldContext.beginPath();

        worldContext.moveTo(x, 0);
        worldContext.lineTo(x - height, height);

        worldContext.stroke();

    }


    /*
        Origin.

        Offset the logical coordinates into the
        center of the visible canvas.
    */

    const originX = width / 2;
    const originY = height / 2;


    /*
        Draw all pieces.
    */

    coaster.forEach((piece, index) => {

        const position = piece.position;

        const screenX =
            originX +
            position.x;

        const screenY =
            originY +
            position.y -
            position.z * 0.5;


        drawTrackPiece(
            worldContext,
            screenX,
            screenY,
            piece,
            1
        );


        /*
            Piece number.
        */

        worldContext.fillStyle = "#202020";
        worldContext.font = "11px Tahoma";

        worldContext.fillText(
            index + 1,
            screenX,
            screenY - 20
        );

    });


    /*
        Draw build position.
    */

    if (coaster.length > 0) {

        const x =
            originX +
            worldPosition.x;

        const y =
            originY +
            worldPosition.y -
            worldPosition.z * 0.5;


        worldContext.fillStyle =
            "#5095db";

        worldContext.beginPath();

        worldContext.arc(
            x,
            y,
            5,
            0,
            Math.PI * 2
        );

        worldContext.fill();

    }

}


/* ============================================================
   UNDO
   ============================================================ */

document
    .getElementById("undoButton")
    .addEventListener("click", undo);


function undo() {

    if (history.length === 0) {
        return;
    }


    coaster =
        history.pop();


    /*
        Recalculate world position.
    */

    worldPosition = {
        x: 0,
        y: 0,
        z: 0
    };


    coaster.forEach(piece => {

        advancePosition(piece);

    });


    drawWorld();

    updateStatus();

    generateSimulationData();

}


/* ============================================================
   POSITION CALCULATION
   ============================================================ */

function advancePosition(piece) {

    const step = 110;


    if (piece.direction === "straight") {

        worldPosition.x += step;

    }

    if (piece.direction === "left") {

        worldPosition.x += step * 0.75;
        worldPosition.y -= step * 0.35;

    }

    if (piece.direction === "right") {

        worldPosition.x += step * 0.75;
        worldPosition.y += step * 0.35;

    }


    switch (piece.slope) {

        case "down-vertical":
            worldPosition.z -= 100;
            break;

        case "down-steep":
            worldPosition.z -= 55;
            break;

        case "down-shallow":
            worldPosition.z -= 25;
            break;

        case "up-shallow":
            worldPosition.z += 25;
            break;

        case "up-steep":
            worldPosition.z += 55;
            break;

        case "up-vertical":
            worldPosition.z += 100;
            break;

    }

}


/* ============================================================
   CLEAR
   ============================================================ */

document
    .getElementById("clearButton")
    .addEventListener("click", clearCoaster);


function clearCoaster() {

    if (coaster.length === 0) {
        return;
    }


    history.push(
        JSON.parse(JSON.stringify(coaster))
    );


    coaster = [];


    worldPosition = {
        x: 0,
        y: 0,
        z: 0
    };


    drawWorld();

    updateStatus();

    generateSimulationData();

}


/* ============================================================
   STATUS
   ============================================================ */

function updateStatus() {

    document
        .getElementById("pieceCount")
        .textContent =
            `Pieces: ${coaster.length}`;

    document
        .getElementById("statusText")
        .textContent =
            coaster.length === 0
                ? "Ready"
                : "Layout modified";

}


/* ============================================================
   GRAPH DATA
   ============================================================ */

let graphType = "vertical";


const graphTabs =
    document.querySelectorAll(".graph-tab");


graphTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        graphTabs.forEach(
            other => other.classList.remove("active")
        );

        tab.classList.add("active");

        graphType = tab.dataset.graph;

        generateSimulationData();

    });

});


function generateSimulationData() {

    const width = graphCanvas.width;
    const height = graphCanvas.height;

    graphContext.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        Graph background.
    */

    graphContext.fillStyle = "#252a2c";

    graphContext.fillRect(
        0,
        0,
        width,
        height
    );


    /*
        Grid.
    */

    graphContext.strokeStyle = "#41484b";
    graphContext.lineWidth = 1;

    for (let x = 0; x < width; x += 50) {

        graphContext.beginPath();

        graphContext.moveTo(x, 0);
        graphContext.lineTo(x, height);

        graphContext.stroke();

    }

    for (let y = 0; y < height; y += 40) {

        graphContext.beginPath();

        graphContext.moveTo(0, y);
        graphContext.lineTo(width, y);

        graphContext.stroke();

    }


    if (coaster.length === 0) {

        graphContext.fillStyle = "#bfc5c7";
        graphContext.font = "14px Tahoma";

        graphContext.fillText(
            "Build track pieces to generate simulation data.",
            20,
            30
        );

        return;

    }


    /*
        Placeholder simulation.

        This is deliberately kept separate from the
        track editor because the actual physics will
        eventually be replaced by C++/WebAssembly.
    */

    graphContext.strokeStyle = "#5095db";
    graphContext.lineWidth = 3;

    graphContext.beginPath();


    coaster.forEach((piece, index) => {

        let value = 0;


        switch (graphType) {

            case "vertical":

                value =
                    slopeValue(piece.slope);

                break;


            case "forward":

                value =
                    forwardForce(piece);

                break;


            case "lateral":

                value =
                    lateralForce(piece);

                break;


            case "speed":

                value =
                    20 +
                    index * 3 -
                    slopeValue(piece.slope) * 2;

                break;


            case "height":

                value =
                    piece.position.z;

                break;


            case "banking":

                value =
                    bankingValue(piece.banking);

                break;

        }


        const x =
            20 +
            index *
            ((width - 40) /
            Math.max(coaster.length - 1, 1));


        const y =
            height / 2 -
            value * 20;


        if (index === 0) {

            graphContext.moveTo(x, y);

        } else {

            graphContext.lineTo(x, y);

        }

    });


    graphContext.stroke();

}


/* ============================================================
   GRAPH HELPERS
   ============================================================ */

function slopeValue(slope) {

    switch (slope) {

        case "down-vertical":
            return -2;

        case "down-steep":
            return -1.4;

        case "down-shallow":
            return -0.6;

        case "up-shallow":
            return 0.6;

        case "up-steep":
            return 1.4;

        case "up-vertical":
            return 2;

        default:
            return 0;

    }

}


function forwardForce(piece) {

    let value = 0;

    if (piece.slope.includes("down")) {
        value += 1;
    }

    if (piece.slope.includes("up")) {
        value -= 1;
    }

    if (piece.operation === "launch") {
        value += 2;
    }

    if (piece.operation === "brake") {
        value -= 2;
    }

    return value;

}


function lateralForce(piece) {

    if (piece.direction === "left") {
        return -1;
    }

    if (piece.direction === "right") {
        return 1;
    }

    return 0;

}


function bankingValue(banking) {

    switch (banking) {

        case "vertical-left":
            return -90;

        case "left":
            return -45;

        case "right":
            return 45;

        case "vertical-right":
            return 90;

        default:
            return 0;

    }

}


/* ============================================================
   SAVE JSON
   ============================================================ */

document
    .getElementById("saveJsonButton")
    .addEventListener("click", saveJson);


function saveJson() {

    const data = {

        version: 1,

        sections: coaster.map(piece => ({

            id: piece.id,

            direction: piece.direction,

            slope: piece.slope,

            banking: piece.banking,

            operation: piece.operation

        }))

    };


    downloadFile(
        JSON.stringify(data, null, 4),
        "coaster.json",
        "application/json"
    );

}


/* ============================================================
   SAVE CSV
   ============================================================ */

document
    .getElementById("saveCsvButton")
    .addEventListener("click", saveCsv);


function saveCsv() {

    let csv =
        "id,direction,slope,banking,operation\n";


    coaster.forEach(piece => {

        csv +=
            `"${piece.id}",` +
            `"${piece.direction}",` +
            `"${piece.slope}",` +
            `"${piece.banking}",` +
            `"${piece.operation}"\n`;

    });


    downloadFile(
        csv,
        "coaster.csv",
        "text/csv"
    );

}


/* ============================================================
   DOWNLOAD HELPER
   ============================================================ */

function downloadFile(
    content,
    filename,
    type
) {

    const blob =
        new Blob(
            [content],
            { type }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


/* ============================================================
   MAIN NAVIGATION
   ============================================================ */

const mainTabs =
    document.querySelectorAll(".main-tab");


mainTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const page =
            tab.dataset.page;


        mainTabs.forEach(
            other =>
                other.classList.remove("active")
        );


        document
            .querySelectorAll(".page")
            .forEach(pageElement =>
                pageElement.classList.remove("active")
            );


        tab.classList.add("active");


        document
            .getElementById(page)
            .classList.add("active");

    });

});


/* ============================================================
   INITIALIZE
   ============================================================ */

function initialize() {

    updatePreview();

    drawWorld();

    generateSimulationData();

    updateStatus();

}


initialize();