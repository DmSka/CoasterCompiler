/* ============================================================
   COASTER CODE
   Main application
   ============================================================ */


/* ============================================================
   CURRENT TRACK PIECE
   ============================================================ */

const currentPiece = {

    direction: "straight",

    slope: "straight",

    banking: "none",

    operation: "none",

    speed: 40,

    acceleration: 1.0

};


/* ============================================================
   COASTER
   ============================================================ */

let coaster = [];

let history = [];


let worldPosition = {

    x: 0,

    y: 0,

    z: 0

};


/* ============================================================
   CANVAS
   ============================================================ */

const worldCanvas =
    document.getElementById("worldCanvas");

const worldContext =
    worldCanvas.getContext("2d");


const previewCanvas =
    document.getElementById("previewCanvas");

const previewContext =
    previewCanvas.getContext("2d");


const graphCanvas =
    document.getElementById("graphCanvas");

const graphContext =
    graphCanvas.getContext("2d");


/* ============================================================
   OPERATION INPUTS
   ============================================================ */

const operationSettings =
    document.getElementById("operationSettings");

const operationSpeed =
    document.getElementById("operationSpeed");

const operationAcceleration =
    document.getElementById("operationAcceleration");


function updateOperationSettings() {

    if (currentPiece.operation === "none") {

        operationSettings.classList.add("hidden");

        return;
    }


    operationSettings.classList.remove("hidden");


    /*
        Set useful defaults depending on
        the operation.
    */

    if (currentPiece.operation === "launch") {

        operationSpeed.value =
            currentPiece.speed || 50;

        operationAcceleration.value =
            currentPiece.acceleration || 1.0;

    }


    if (currentPiece.operation === "lift") {

        operationSpeed.value =
            currentPiece.speed || 8;

        operationAcceleration.value =
            currentPiece.acceleration || 0.5;

    }


    if (currentPiece.operation === "brake") {

        operationSpeed.value =
            currentPiece.speed || 40;

        operationAcceleration.value =
            currentPiece.acceleration || 1.0;

    }

}


operationSpeed.addEventListener(
    "input",
    () => {

        currentPiece.speed =
            Number(operationSpeed.value);

        updatePreview();

    }
);


operationAcceleration.addEventListener(
    "input",
    () => {

        currentPiece.acceleration =
            Number(operationAcceleration.value);

        updatePreview();

    }
);


/* ============================================================
   TRACK BUTTONS
   ============================================================ */

const trackButtons =
    document.querySelectorAll(".track-button");


trackButtons.forEach(button => {

    button.addEventListener("click", () => {

        const group =
            button.dataset.group;

        const value =
            button.dataset.value;


        currentPiece[group] =
            value;


        document
            .querySelectorAll(
                `.track-button[data-group="${group}"]`
            )
            .forEach(otherButton => {

                otherButton.classList.remove("active");

            });


        button.classList.add("active");


        if (group === "operation") {

            updateOperationSettings();

        }


        updatePreview();

    });

});


/* ============================================================
   TRACK DRAWING
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


    /* --------------------------------------------------------
       SLOPE
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       DIRECTION
       -------------------------------------------------------- */

    let directionAngle = 0;


    if (piece.direction === "left") {

        directionAngle =
            -Math.PI * 0.15;

    }


    if (piece.direction === "right") {

        directionAngle =
            Math.PI * 0.15;

    }


    const angle =
        slopeAngle +
        directionAngle;


    /* --------------------------------------------------------
       BANKING
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       DIMENSIONS
       -------------------------------------------------------- */

    const length =
        105 * scale;

    const railSpacing =
        15 * scale;


    const dx =
        Math.cos(angle) *
        length;

    const dy =
        Math.sin(angle) *
        length;


    const px =
        Math.cos(
            angle + Math.PI / 2
        ) *
        railSpacing;

    const py =
        Math.sin(
            angle + Math.PI / 2
        ) *
        railSpacing;


    /* --------------------------------------------------------
       SUPPORTS
       -------------------------------------------------------- */

    context.strokeStyle =
        "#555b58";

    context.lineWidth =
        4 * scale;


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


    /* --------------------------------------------------------
       RAILS
       -------------------------------------------------------- */

    context.save();

    context.rotate(bankAngle);


    context.strokeStyle =
        "#343a3d";

    context.lineWidth =
        5 * scale;


    context.beginPath();

    context.moveTo(
        -px,
        -py
    );

    context.lineTo(
        dx - px,
        dy - py
    );


    context.moveTo(
        px,
        py
    );

    context.lineTo(
        dx + px,
        dy + py
    );

    context.stroke();


    /* --------------------------------------------------------
       RAIL HIGHLIGHTS
       -------------------------------------------------------- */

    context.strokeStyle =
        "#858c90";

    context.lineWidth =
        2 * scale;


    context.beginPath();

    context.moveTo(
        -px,
        -py - 2
    );

    context.lineTo(
        dx - px,
        dy - py - 2
    );


    context.moveTo(
        px,
        py - 2
    );

    context.lineTo(
        dx + px,
        dy + py - 2
    );

    context.stroke();


    /* --------------------------------------------------------
       CROSS TIES
       -------------------------------------------------------- */

    const tieCount = 6;


    for (
        let i = 0;
        i <= tieCount;
        i++
    ) {

        const t =
            i / tieCount;


        const cx =
            dx * t;

        const cy =
            dy * t;


        const crossX =
            Math.cos(
                angle + Math.PI / 2
            ) *
            (railSpacing + 4 * scale);


        const crossY =
            Math.sin(
                angle + Math.PI / 2
            ) *
            (railSpacing + 4 * scale);


        context.strokeStyle =
            "#5e5144";

        context.lineWidth =
            3 * scale;


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


    /* ========================================================
       OPERATION VISUALS
       ======================================================== */


    if (piece.operation === "lift") {

        context.strokeStyle =
            "#777777";

        context.lineWidth =
            3 * scale;


        for (let i = 0; i < 5; i++) {

            const t =
                i / 4;


            const cx =
                dx * t;

            const cy =
                dy * t;


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

        context.strokeStyle =
            "#555555";

        context.lineWidth =
            7 * scale;


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

        context.strokeStyle =
            "#40484b";

        context.lineWidth =
            4 * scale;


        for (let i = 0; i < 3; i++) {

            const t =
                0.25 + i * 0.18;


            const cx =
                dx * t;

            const cy =
                dy * t;


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

    const width =
        previewCanvas.width;

    const height =
        previewCanvas.height;


    previewContext.clearRect(
        0,
        0,
        width,
        height
    );


    /* --------------------------------------------------------
       BACKGROUND
       -------------------------------------------------------- */

    previewContext.fillStyle =
        "#9ca68e";

    previewContext.fillRect(
        0,
        0,
        width,
        height
    );


    /* --------------------------------------------------------
       GROUND GRID
       -------------------------------------------------------- */

    previewContext.strokeStyle =
        "#7f896f";

    previewContext.lineWidth =
        1;


    for (
        let x = -height;
        x < width;
        x += 25
    ) {

        previewContext.beginPath();

        previewContext.moveTo(
            x,
            0
        );

        previewContext.lineTo(
            x + height,
            height
        );

        previewContext.stroke();

    }


    for (
        let x = 0;
        x < width + height;
        x += 25
    ) {

        previewContext.beginPath();

        previewContext.moveTo(
            x,
            0
        );

        previewContext.lineTo(
            x - height,
            height
        );

        previewContext.stroke();

    }


    /* --------------------------------------------------------
       TRACK
       -------------------------------------------------------- */

    drawTrackPiece(
        previewContext,
        width / 2 - 50,
        height / 2,
        currentPiece,
        0.9
    );


    /* --------------------------------------------------------
       PIECE INFORMATION
       -------------------------------------------------------- */

    previewContext.fillStyle =
        "#202020";

    previewContext.font =
        "11px Tahoma";


    previewContext.fillText(
        currentPiece.direction,
        8,
        16
    );


    previewContext.fillText(
        currentPiece.slope,
        8,
        31
    );


    previewContext.fillText(
        currentPiece.banking,
        8,
        46
    );


    previewContext.fillText(
        currentPiece.operation,
        8,
        61
    );


    if (currentPiece.operation !== "none") {

        previewContext.fillText(
            `${currentPiece.speed} mph`,
            8,
            76
        );


        previewContext.fillText(
            `${currentPiece.acceleration} g/s`,
            8,
            91
        );

    }

}


/* ============================================================
   BUILD
   ============================================================ */

document
    .getElementById("buildButton")
    .addEventListener(
        "click",
        buildPiece
    );


function buildPiece() {

    history.push(
        JSON.parse(
            JSON.stringify(coaster)
        )
    );


    const piece = {

        id:
            crypto.randomUUID(),

        direction:
            currentPiece.direction,

        slope:
            currentPiece.slope,

        banking:
            currentPiece.banking,

        operation:
            currentPiece.operation,

        speed:
            currentPiece.operation !== "none"
                ? Number(currentPiece.speed)
                : null,

        acceleration:
            currentPiece.operation !== "none"
                ? Number(currentPiece.acceleration)
                : null,

        position: {

            x:
                worldPosition.x,

            y:
                worldPosition.y,

            z:
                worldPosition.z

        }

    };


    coaster.push(piece);


    advancePosition(piece);


    drawWorld();

    updateStatus();

    generateSimulationData();

}


/* ============================================================
   POSITION
   ============================================================ */

function advancePosition(piece) {

    const step = 110;


    if (piece.direction === "straight") {

        worldPosition.x += step;

    }


    if (piece.direction === "left") {

        worldPosition.x +=
            step * 0.75;

        worldPosition.y -=
            step * 0.35;

    }


    if (piece.direction === "right") {

        worldPosition.x +=
            step * 0.75;

        worldPosition.y +=
            step * 0.35;

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

}


/* ============================================================
   WORLD
   ============================================================ */

function drawWorld() {

    const width =
        worldCanvas.width;

    const height =
        worldCanvas.height;


    worldContext.clearRect(
        0,
        0,
        width,
        height
    );


    worldContext.fillStyle =
        "#8e987d";

    worldContext.fillRect(
        0,
        0,
        width,
        height
    );


    /* --------------------------------------------------------
       GRID
       -------------------------------------------------------- */

    worldContext.strokeStyle =
        "#7e896e";

    worldContext.lineWidth =
        1;


    const gridSize = 40;


    for (
        let x = -height;
        x < width + height;
        x += gridSize
    ) {

        worldContext.beginPath();

        worldContext.moveTo(
            x,
            0
        );

        worldContext.lineTo(
            x + height,
            height
        );

        worldContext.stroke();

    }


    for (
        let x = 0;
        x < width + height;
        x += gridSize
    ) {

        worldContext.beginPath();

        worldContext.moveTo(
            x,
            0
        );

        worldContext.lineTo(
            x - height,
            height
        );

        worldContext.stroke();

    }


    /* --------------------------------------------------------
       ORIGIN
       -------------------------------------------------------- */

    const originX =
        width / 2;

    const originY =
        height / 2;


    /* --------------------------------------------------------
       PIECES
       -------------------------------------------------------- */

    coaster.forEach(
        (piece, index) => {

            const position =
                piece.position;


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


            worldContext.fillStyle =
                "#202020";

            worldContext.font =
                "11px Tahoma";


            worldContext.fillText(
                index + 1,
                screenX,
                screenY - 20
            );

        }
    );


    /* --------------------------------------------------------
       BUILD POSITION
       -------------------------------------------------------- */

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
    .addEventListener(
        "click",
        undo
    );


function undo() {

    if (history.length === 0) {

        return;

    }


    coaster =
        history.pop();


    worldPosition = {

        x: 0,

        y: 0,

        z: 0

    };


    coaster.forEach(
        piece => {

            advancePosition(piece);

        }
    );


    drawWorld();

    updateStatus();

    generateSimulationData();

}


/* ============================================================
   CLEAR
   ============================================================ */

document
    .getElementById("clearButton")
    .addEventListener(
        "click",
        clearCoaster
    );


function clearCoaster() {

    if (coaster.length === 0) {

        return;

    }


    history.push(
        JSON.parse(
            JSON.stringify(coaster)
        )
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
   GRAPH
   ============================================================ */

let graphType = "vertical";


document
    .querySelectorAll(".graph-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".graph-tab")
                    .forEach(other => {

                        other.classList.remove(
                            "active"
                        );

                    });


                tab.classList.add(
                    "active"
                );


                graphType =
                    tab.dataset.graph;


                generateSimulationData();

            }
        );

    });


function generateSimulationData() {

    const width =
        graphCanvas.width;

    const height =
        graphCanvas.height;


    graphContext.clearRect(
        0,
        0,
        width,
        height
    );


    graphContext.fillStyle =
        "#252a2c";

    graphContext.fillRect(
        0,
        0,
        width,
        height
    );


    /* --------------------------------------------------------
       GRID
       -------------------------------------------------------- */

    graphContext.strokeStyle =
        "#41484b";

    graphContext.lineWidth =
        1;


    for (
        let x = 0;
        x < width;
        x += 50
    ) {

        graphContext.beginPath();

        graphContext.moveTo(
            x,
            0
        );

        graphContext.lineTo(
            x,
            height
        );

        graphContext.stroke();

    }


    for (
        let y = 0;
        y < height;
        y += 40
    ) {

        graphContext.beginPath();

        graphContext.moveTo(
            0,
            y
        );

        graphContext.lineTo(
            width,
            y
        );

        graphContext.stroke();

    }


    if (coaster.length === 0) {

        graphContext.fillStyle =
            "#bfc5c7";

        graphContext.font =
            "14px Tahoma";


        graphContext.fillText(
            "Build track pieces to generate simulation data.",
            20,
            30
        );


        return;

    }


    /* --------------------------------------------------------
       TEMPORARY GRAPH
       -------------------------------------------------------- */

    graphContext.strokeStyle =
        "#5095db";

    graphContext.lineWidth =
        3;


    graphContext.beginPath();


    coaster.forEach(
        (piece, index) => {

            let value = 0;


            switch (graphType) {

                case "vertical":

                    value =
                        slopeValue(
                            piece.slope
                        );

                    break;


                case "forward":

                    value =
                        forwardForce(
                            piece
                        );

                    break;


                case "lateral":

                    value =
                        lateralForce(
                            piece
                        );

                    break;


                case "speed":

                    value =
                        piece.speed !== null
                            ? piece.speed
                            : 20 + index * 3;

                    break;


                case "height":

                    value =
                        piece.position.z;

                    break;


                case "banking":

                    value =
                        bankingValue(
                            piece.banking
                        );

                    break;

            }


            const x =
                20 +
                index *
                (
                    (width - 40) /
                    Math.max(
                        coaster.length - 1,
                        1
                    )
                );


            let y;


            if (graphType === "speed") {

                y =
                    height -
                    value * 3;

            }

            else if (graphType === "height") {

                y =
                    height / 2 -
                    value * 1.5;

            }

            else if (graphType === "banking") {

                y =
                    height / 2 -
                    value;

            }

            else {

                y =
                    height / 2 -
                    value * 20;

            }


            if (index === 0) {

                graphContext.moveTo(
                    x,
                    y
                );

            }

            else {

                graphContext.lineTo(
                    x,
                    y
                );

            }

        }
    );


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


    if (
        piece.slope.includes(
            "down"
        )
    ) {

        value += 1;

    }


    if (
        piece.slope.includes(
            "up"
        )
    ) {

        value -= 1;

    }


    if (
        piece.operation === "launch"
    ) {

        value +=
            piece.acceleration || 0;

    }


    if (
        piece.operation === "brake"
    ) {

        value -=
            piece.acceleration || 0;

    }


    if (
        piece.operation === "lift"
    ) {

        value +=
            piece.acceleration || 0;

    }


    return value;

}


function lateralForce(piece) {

    if (
        piece.direction === "left"
    ) {

        return -1;

    }


    if (
        piece.direction === "right"
    ) {

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
    .addEventListener(
        "click",
        saveJson
    );


function saveJson() {

    const data = {

        version: 1,

        sections:
            coaster.map(
                piece => ({

                    id:
                        piece.id,

                    direction:
                        piece.direction,

                    slope:
                        piece.slope,

                    banking:
                        piece.banking,

                    operation:
                        piece.operation,

                    speed:
                        piece.speed,

                    acceleration:
                        piece.acceleration

                })
            )

    };


    downloadFile(
        JSON.stringify(
            data,
            null,
            4
        ),
        "coaster.json",
        "application/json"
    );

}


/* ============================================================
   SAVE CSV
   ============================================================ */

document
    .getElementById("saveCsvButton")
    .addEventListener(
        "click",
        saveCsv
    );


function saveCsv() {

    let csv =
        "id,direction,slope,banking,operation,speed,acceleration\n";


    coaster.forEach(
        piece => {

            csv +=
                `"${piece.id}",` +
                `"${piece.direction}",` +
                `"${piece.slope}",` +
                `"${piece.banking}",` +
                `"${piece.operation}",` +
                `"${piece.speed ?? ""}",` +
                `"${piece.acceleration ?? ""}"\n`;

        }
    );


    downloadFile(
        csv,
        "coaster.csv",
        "text/csv"
    );

}


/* ============================================================
   DOWNLOAD
   ============================================================ */

function downloadFile(
    content,
    filename,
    type
) {

    const blob =
        new Blob(
            [content],
            { type: type }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* ============================================================
   MAIN NAVIGATION
   ============================================================ */

document
    .querySelectorAll(".main-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const page =
                    tab.dataset.page;


                document
                    .querySelectorAll(".main-tab")
                    .forEach(other => {

                        other.classList.remove(
                            "active"
                        );

                    });


                document
                    .querySelectorAll(".page")
                    .forEach(
                        pageElement => {

                            pageElement.classList.remove(
                                "active"
                            );

                        }
                    );


                tab.classList.add(
                    "active"
                );


                document
                    .getElementById(page)
                    .classList.add(
                        "active"
                    );

            }
        );

    });


/* ============================================================
   INITIALIZE
   ============================================================ */

function initialize() {

    updateOperationSettings();

    updatePreview();

    drawWorld();

    generateSimulationData();

    updateStatus();

}


initialize();