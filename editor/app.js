/* ================================================================
   COASTER CODE APPLICATION
   ================================================================ */


/* ================================================================
   CANVASES
   ================================================================ */

const previewCanvas =
    document.getElementById("previewCanvas");

const worldCanvas =
    document.getElementById("worldCanvas");


const graphCanvases = {

    vertical:
        document.getElementById(
            "verticalGraphCanvas"
        ),

    lateral:
        document.getElementById(
            "lateralGraphCanvas"
        ),

    forward:
        document.getElementById(
            "forwardGraphCanvas"
        ),

    speed:
        document.getElementById(
            "speedGraphCanvas"
        ),

    height:
        document.getElementById(
            "heightGraphCanvas"
        ),

    banking:
        document.getElementById(
            "bankingGraphCanvas"
        )
};


/* ================================================================
   GLOBAL STATE
   ================================================================ */

let editor;
let simulator;
let track;

let selectedDirection = "straight";
let selectedSlope = "straight";
let selectedBanking = "none";
let selectedOperation = "none";


/* ================================================================
   INITIALIZATION
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initializeApplication();

});


function initializeApplication() {

    /*
     * The existing source classes are responsible for their
     * normal construction. This preserves the existing project
     * architecture.
     */

    try {

        if (
            typeof Track !== "undefined"
        ) {
            track = new Track();
        }

    } catch (error) {

        console.warn(
            "Track initialization:",
            error
        );

    }


    try {

        if (
            typeof TrackEditor !== "undefined"
        ) {
            editor =
                new TrackEditor(
                    previewCanvas
                );
        }

    } catch (error) {

        console.warn(
            "TrackEditor initialization:",
            error
        );

    }


    try {

        if (
            typeof Simulator !== "undefined"
        ) {
            simulator =
                new Simulator();
        }

    } catch (error) {

        console.warn(
            "Simulator initialization:",
            error
        );

    }


    setupTrackButtons();
    setupBuildControls();
    setupSimulation();
    setupNavigation();
    setupFileControls();

    drawAll();

}


/* ================================================================
   DRAW EVERYTHING
   ================================================================ */

function drawAll() {

    drawPreview();

    drawWorld();

    drawAllGraphs();

}


/* ================================================================
   PREVIEW
   ================================================================ */

function drawPreview() {

    if (
        editor &&
        typeof editor.drawPreview === "function"
    ) {

        editor.drawPreview();

    }

}


/* ================================================================
   WORLD
   ================================================================ */

function drawWorld() {

    if (
        !worldCanvas
    ) {
        return;
    }


    /*
     * If the existing TrackEditor/Track system has its own
     * world drawing implementation, use it.
     */

    if (
        editor &&
        typeof editor.drawWorld === "function"
    ) {

        editor.drawWorld(
            worldCanvas
        );

        return;

    }


    const ctx =
        worldCanvas.getContext("2d");


    const width =
        worldCanvas.width;

    const height =
        worldCanvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
     * Subtle world grid.
     */

    ctx.strokeStyle =
        "rgba(80,70,55,.12)";

    ctx.lineWidth = 1;


    const gridSize = 40;


    for (
        let x = 0;
        x <= width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }

}


/* ================================================================
   TRACK BUTTONS
   ================================================================ */

function setupTrackButtons() {

    const buttons =
        document.querySelectorAll(
            ".track-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const type =
                    button.dataset.type;

                const value =
                    button.dataset.value;


                handleTrackSelection(
                    type,
                    value,
                    button
                );

            }
        );

    });

}


function handleTrackSelection(
    type,
    value,
    button
) {

    switch (type) {

        case "direction":

            selectedDirection =
                value;

            selectButtonGroup(
                "direction",
                value
            );

            break;


        case "slope":

            selectedSlope =
                value;

            selectButtonGroup(
                "slope",
                value
            );

            break;


        case "banking":

            selectedBanking =
                value;

            selectButtonGroup(
                "banking",
                value
            );

            break;


        case "operation":

            selectedOperation =
                value;

            selectButtonGroup(
                "operation",
                value
            );

            updateOperationSettings();

            break;

    }


    /*
     * Let the existing editor know about the selection
     * when it provides the appropriate method.
     */

    if (
        editor
    ) {

        if (
            typeof editor.setDirection === "function" &&
            type === "direction"
        ) {

            editor.setDirection(
                value
            );

        }


        if (
            typeof editor.setSlope === "function" &&
            type === "slope"
        ) {

            editor.setSlope(
                value
            );

        }


        if (
            typeof editor.setBanking === "function" &&
            type === "banking"
        ) {

            editor.setBanking(
                value
            );

        }


        if (
            typeof editor.setOperation === "function" &&
            type === "operation"
        ) {

            editor.setOperation(
                value
            );

        }

    }


    drawPreview();

}


function selectButtonGroup(
    type,
    value
) {

    document
        .querySelectorAll(
            `.track-button[data-type="${type}"]`
        )
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.dataset.value === value
            );

        });

}


/* ================================================================
   OPERATION SETTINGS
   ================================================================ */

function updateOperationSettings() {

    const settings =
        document.getElementById(
            "operationSettings"
        );


    if (
        !settings
    ) {
        return;
    }


    if (
        selectedOperation === "launch" ||
        selectedOperation === "lift" ||
        selectedOperation === "brake"
    ) {

        settings.classList.remove(
            "hidden"
        );

    } else {

        settings.classList.add(
            "hidden"
        );

    }

}


/* ================================================================
   BUILD / CANCEL / UNDO / CLEAR
   ================================================================ */

function setupBuildControls() {

    const buildButton =
        document.getElementById(
            "buildButton"
        );

    const cancelButton =
        document.getElementById(
            "cancelButton"
        );

    const undoButton =
        document.getElementById(
            "undoButton"
        );

    const clearButton =
        document.getElementById(
            "clearButton"
        );


    if (
        buildButton
    ) {

        buildButton.addEventListener(
            "click",
            () => {

                buildTrack();

            }
        );

    }


    if (
        cancelButton
    ) {

        cancelButton.addEventListener(
            "click",
            () => {

                if (
                    editor &&
                    typeof editor.cancel === "function"
                ) {

                    editor.cancel();

                }

                drawAll();

            }
        );

    }


    if (
        undoButton
    ) {

        undoButton.addEventListener(
            "click",
            () => {

                if (
                    editor &&
                    typeof editor.undo === "function"
                ) {

                    editor.undo();

                }

                drawAll();

            }
        );

    }


    if (
        clearButton
    ) {

        clearButton.addEventListener(
            "click",
            () => {

                if (
                    editor &&
                    typeof editor.clear === "function"
                ) {

                    editor.clear();

                }

                drawAll();

            }
        );

    }

}


function buildTrack() {

    if (
        !editor
    ) {
        return;
    }


    /*
     * Read operation settings.
     */

    const speedInput =
        document.getElementById(
            "operationSpeed"
        );

    const accelerationInput =
        document.getElementById(
            "operationAcceleration"
        );


    const speed =
        speedInput
            ? Number(speedInput.value)
            : 20;


    const acceleration =
        accelerationInput
            ? Number(accelerationInput.value)
            : 1;


    /*
     * Try the normal editor API first.
     */

    if (
        typeof editor.build === "function"
    ) {

        editor.build({
            direction:
                selectedDirection,

            slope:
                selectedSlope,

            banking:
                selectedBanking,

            operation:
                selectedOperation,

            speed:
                speed,

            acceleration:
                acceleration
        });

    } else if (
        typeof editor.buildSegment === "function"
    ) {

        editor.buildSegment();

    }


    drawAll();

}


/* ================================================================
   SIMULATION
   ================================================================ */

function setupSimulation() {

    const button =
        document.getElementById(
            "simulateButton"
        );


    if (
        !button
    ) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if (
                simulator &&
                typeof simulator.simulate === "function"
            ) {

                simulator.simulate();

            } else if (
                simulator &&
                typeof simulator.run === "function"
            ) {

                simulator.run();

            }


            drawAllGraphs();

        }
    );

}


/* ================================================================
   ALL SIX GRAPHS
   ================================================================ */

function drawAllGraphs() {

    drawGraphCanvas(
        graphCanvases.vertical,
        "vertical",
        "matrix"
    );


    drawGraphCanvas(
        graphCanvases.lateral,
        "lateral",
        "matrix"
    );


    drawGraphCanvas(
        graphCanvases.forward,
        "forward",
        "matrix"
    );


    drawGraphCanvas(
        graphCanvases.speed,
        "speed",
        "paper"
    );


    drawGraphCanvas(
        graphCanvases.height,
        "height",
        "paper"
    );


    drawGraphCanvas(
        graphCanvases.banking,
        "banking",
        "paper"
    );

}


/* ================================================================
   GRAPH CANVAS
   ================================================================ */

function drawGraphCanvas(
    canvas,
    graphName,
    style
) {

    if (
        !canvas
    ) {
        return;
    }


    const rect =
        canvas.getBoundingClientRect();


    const width =
        Math.max(
            1,
            Math.floor(rect.width)
        );


    const height =
        Math.max(
            1,
            Math.floor(rect.height)
        );


    if (
        canvas.width !== width ||
        canvas.height !== height
    ) {

        canvas.width =
            width;

        canvas.height =
            height;

    }


    const ctx =
        canvas.getContext("2d");


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    if (
        style === "matrix"
    ) {

        drawMatrixGraph(
            ctx,
            canvas,
            graphName
        );

    } else {

        drawPaperGraph(
            ctx,
            canvas,
            graphName
        );

    }

}


/* ================================================================
   GET GRAPH DATA
   ================================================================ */

function getGraphData(
    graphName
) {

    if (
        !simulator ||
        !simulator.graphData
    ) {

        return [];

    }


    const data =
        simulator.graphData[
            graphName
        ];


    if (
        !Array.isArray(data)
    ) {

        return [];

    }


    return data;

}


/* ================================================================
   MATRIX GRAPH
   ================================================================ */

function drawMatrixGraph(
    ctx,
    canvas,
    graphName
) {

    const width =
        canvas.width;

    const height =
        canvas.height;


    /*
     * Grid.
     */

    ctx.save();

    ctx.strokeStyle =
        "rgba(74,255,130,.16)";

    ctx.lineWidth = 1;


    const gridSize = 20;


    for (
        let x = 0;
        x <= width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }


    const data =
        getGraphData(
            graphName
        );


    if (
        data.length === 0
    ) {

        ctx.fillStyle =
            "#45d879";

        ctx.font =
            "10px monospace";

        ctx.fillText(
            "NO DATA",
            10,
            height - 10
        );

        ctx.restore();

        return;

    }


    let min =
        Math.min(...data);

    let max =
        Math.max(...data);


    if (
        min === max
    ) {

        min -= 1;
        max += 1;

    }


    /*
     * Zero axis.
     */

    if (
        min <= 0 &&
        max >= 0
    ) {

        const zeroY =
            height -
            (
                (0 - min) /
                (max - min)
            ) *
            height;


        ctx.strokeStyle =
            "rgba(74,255,130,.35)";

        ctx.beginPath();

        ctx.moveTo(
            0,
            zeroY
        );

        ctx.lineTo(
            width,
            zeroY
        );

        ctx.stroke();

    }


    /*
     * Graph line.
     */

    ctx.beginPath();


    data.forEach(
        (value, index) => {

            const x =
                data.length === 1
                    ? 0
                    :
                    (
                        index /
                        (data.length - 1)
                    ) *
                    width;


            const normalized =
                (
                    value - min
                ) /
                (
                    max - min
                );


            const y =
                height -
                normalized *
                (height - 8) -
                4;


            if (
                index === 0
            ) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#54f58b";

    ctx.lineWidth = 2;

    ctx.shadowColor =
        "#54f58b";

    ctx.shadowBlur = 5;

    ctx.stroke();

    ctx.shadowBlur = 0;


    /*
     * Data points.
     */

    ctx.fillStyle =
        "#8affad";


    const interval =
        Math.max(
            1,
            Math.floor(
                data.length / 30
            )
        );


    data.forEach(
        (value, index) => {

            if (
                index % interval !== 0
            ) {
                return;
            }


            const x =
                data.length === 1
                    ? 0
                    :
                    (
                        index /
                        (data.length - 1)
                    ) *
                    width;


            const normalized =
                (
                    value - min
                ) /
                (
                    max - min
                );


            const y =
                height -
                normalized *
                (height - 8) -
                4;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                1.5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );


    ctx.restore();

}


/* ================================================================
   PAPER GRAPH
   ================================================================ */

function drawPaperGraph(
    ctx,
    canvas,
    graphName
) {

    const width =
        canvas.width;

    const height =
        canvas.height;


    ctx.save();


    /*
     * Graph paper.
     */

    ctx.strokeStyle =
        "rgba(105,91,65,.20)";

    ctx.lineWidth = 1;


    const gridSize = 15;


    for (
        let x = 0;
        x <= width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }


    const data =
        getGraphData(
            graphName
        );


    if (
        data.length === 0
    ) {

        ctx.fillStyle =
            "#756a57";

        ctx.font =
            "10px monospace";

        ctx.fillText(
            "NO DATA",
            10,
            height - 10
        );

        ctx.restore();

        return;

    }


    let min =
        Math.min(...data);

    let max =
        Math.max(...data);


    if (
        min === max
    ) {

        min -= 1;
        max += 1;

    }


    /*
     * Zero line.
     */

    if (
        min <= 0 &&
        max >= 0
    ) {

        const zeroY =
            height -
            (
                (0 - min) /
                (max - min)
            ) *
            height;


        ctx.strokeStyle =
            "rgba(70,61,45,.4)";

        ctx.beginPath();

        ctx.moveTo(
            0,
            zeroY
        );

        ctx.lineTo(
            width,
            zeroY
        );

        ctx.stroke();

    }


    /*
     * Slightly imperfect line to give it
     * the hand-drawn look.
     */

    ctx.beginPath();


    data.forEach(
        (value, index) => {

            const x =
                data.length === 1
                    ? 0
                    :
                    (
                        index /
                        (data.length - 1)
                    ) *
                    width;


            const normalized =
                (
                    value - min
                ) /
                (
                    max - min
                );


            let y =
                height -
                normalized *
                (height - 10) -
                5;


            y +=
                Math.sin(
                    index * 1.73
                ) *
                .7;


            if (
                index === 0
            ) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#4e4639";

    ctx.lineWidth = 2;

    ctx.stroke();


    /*
     * Hand-drawn points.
     */

    ctx.fillStyle =
        "#4e4639";


    const interval =
        Math.max(
            1,
            Math.floor(
                data.length / 20
            )
        );


    data.forEach(
        (value, index) => {

            if (
                index % interval !== 0
            ) {
                return;
            }


            const x =
                data.length === 1
                    ? 0
                    :
                    (
                        index /
                        (data.length - 1)
                    ) *
                    width;


            const normalized =
                (
                    value - min
                ) /
                (
                    max - min
                );


            let y =
                height -
                normalized *
                (height - 10) -
                5;


            y +=
                Math.sin(
                    index * 1.73
                ) *
                .7;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                1.3,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );


    ctx.restore();

}


/* ================================================================
   NAVIGATION DRAWERS
   ================================================================ */

function setupNavigation() {

    const drawers =
        document.querySelectorAll(
            ".desk-drawer"
        );


    const pages =
        document.querySelectorAll(
            ".page"
        );


    drawers.forEach(
        drawer => {

            drawer.addEventListener(
                "click",
                () => {

                    const pageId =
                        drawer.dataset.page;


                    drawers.forEach(
                        item => {

                            item.classList.toggle(
                                "active",
                                item === drawer
                            );

                        }
                    );


                    pages.forEach(
                        page => {

                            page.classList.toggle(
                                "active",
                                page.id === pageId
                            );

                        }
                    );


                    if (
                        pageId === "editorPage"
                    ) {

                        requestAnimationFrame(
                            () => {

                                drawAll();

                            }
                        );

                    }

                }
            );

        }
    );

}


/* ================================================================
   FILE CONTROLS
   ================================================================ */

function setupFileControls() {

    const saveJsonButton =
        document.getElementById(
            "saveJsonButton"
        );

    const loadJsonButton =
        document.getElementById(
            "loadJsonButton"
        );

    const saveGraphButton =
        document.getElementById(
            "saveGraphButton"
        );

    const loadGraphButton =
        document.getElementById(
            "loadGraphButton"
        );

    const fileInput =
        document.getElementById(
            "fileInput"
        );


    if (
        saveJsonButton
    ) {

        saveJsonButton.addEventListener(
            "click",
            () => {

                if (
                    typeof files !== "undefined" &&
                    typeof files.saveJson === "function"
                ) {

                    files.saveJson();

                } else if (
                    typeof fileManager !== "undefined" &&
                    typeof fileManager.saveJson === "function"
                ) {

                    fileManager.saveJson();

                }

            }
        );

    }


    if (
        loadJsonButton &&
        fileInput
    ) {

        loadJsonButton.addEventListener(
            "click",
            () => {

                fileInput.click();

            }
        );

    }


    if (
        fileInput
    ) {

        fileInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];


                if (
                    !file
                ) {
                    return;
                }


                if (
                    typeof files !== "undefined" &&
                    typeof files.loadJson === "function"
                ) {

                    files.loadJson(
                        file
                    );

                } else if (
                    typeof fileManager !== "undefined" &&
                    typeof fileManager.loadJson === "function"
                ) {

                    fileManager.loadJson(
                        file
                    );

                }


                requestAnimationFrame(
                    () => {

                        drawAll();

                    }
                );

            }
        );

    }


    if (
        saveGraphButton
    ) {

        saveGraphButton.addEventListener(
            "click",
            () => {

                if (
                    typeof files !== "undefined" &&
                    typeof files.saveGraph === "function"
                ) {

                    files.saveGraph();

                } else if (
                    typeof fileManager !== "undefined" &&
                    typeof fileManager.saveGraph === "function"
                ) {

                    fileManager.saveGraph();

                }

            }
        );

    }


    if (
        loadGraphButton
    ) {

        loadGraphButton.addEventListener(
            "click",
            () => {

                if (
                    typeof files !== "undefined" &&
                    typeof files.loadGraph === "function"
                ) {

                    files.loadGraph();

                } else if (
                    typeof fileManager !== "undefined" &&
                    typeof fileManager.loadGraph === "function"
                ) {

                    fileManager.loadGraph();

                }


                requestAnimationFrame(
                    () => {

                        drawAllGraphs();

                    }
                );

            }
        );

    }

}


/* ================================================================
   RESIZE
   ================================================================ */

window.addEventListener(
    "resize",
    () => {

        requestAnimationFrame(
            () => {

                drawAll();

            }
        );

    }
);