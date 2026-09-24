const ICON_PATH = "icons/ui/";

class TrackEditor {
    constructor(previewCanvas) {
        this.previewCanvas = previewCanvas;
        this.ctx = previewCanvas.getContext("2d");

        this.currentPiece = {
            direction: "straight",
            slope: "straight",
            banking: "none",
            operation: "none",
            speed: 40,
            acceleration: 1
        };

        this.editingIndex = null;

        this.updateControls();
        this.drawPreview();
    }

    select(group, value) {
        if (!this.isValueAllowed(group, value)) {
            return;
        }

        this.currentPiece[group] = value;

        if (group === "operation") {
            this.updateOperationSettings();
        }

        this.updateControls();
        this.drawPreview();
    }

    setPiece(piece) {
        this.currentPiece = {
            direction: piece.direction,
            slope: piece.slope,
            banking: piece.banking,
            operation: piece.operation,
            speed: Number(piece.speed ?? 40),
            acceleration: Number(piece.acceleration ?? 1)
        };

        this.updateOperationSettings();
        this.updateControls();
        this.drawPreview();
    }

    isValid(piece = this.currentPiece) {
        return piece.slope === "straight" || piece.banking === "none";
    }

    isValueAllowed(group, value) {
        const candidate = {
            ...this.currentPiece,
            [group]: value
        };

        return this.isValid(candidate);
    }

    updateControls() {
        document.querySelectorAll(".track-button").forEach(button => {
            const group = button.dataset.group;
            const value = button.dataset.value;
            const allowed = this.isValueAllowed(group, value);

            button.disabled = !allowed;
            button.classList.toggle(
                "active",
                this.currentPiece[group] === value
            );
        });
    }

    updateOperationSettings() {
        const settings = document.getElementById("operationSettings");

        if (this.currentPiece.operation === "none") {
            settings.classList.add("hidden");
            return;
        }

        settings.classList.remove("hidden");

        document.getElementById("operationSpeed").value =
            this.currentPiece.speed;

        document.getElementById("operationAcceleration").value =
            this.currentPiece.acceleration;
    }

    createSegment() {
        const speed = Number(document.getElementById("operationSpeed").value);
        const acceleration = Number(
            document.getElementById("operationAcceleration").value
        );

        const segment = new TrackSegment({
            ...this.currentPiece,
            speed,
            acceleration
        });

        if (!segment.isValid()) {
            throw new Error("Invalid segment.");
        }

        return segment;
    }

    loadSegment(segment, index) {
        this.setPiece(segment);
        this.editingIndex = index;

        document.getElementById("buildButton").textContent = "UPDATE";
        document.getElementById("cancelEditButton").classList.remove("hidden");
    }

    exitEditMode() {
        this.editingIndex = null;

        document.getElementById("buildButton").textContent = "BUILD";
        document.getElementById("cancelEditButton").classList.add("hidden");
    }

    drawPreview() {
        const ctx = this.ctx;
        const canvas = this.previewCanvas;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#dfe2e7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawPreviewGrid();
        this.drawPieceImage(ctx);
    }

    drawPreviewGrid() {
        const ctx = this.ctx;
        const spacing = 20;

        ctx.strokeStyle = "rgba(80, 90, 100, 0.12)";
        ctx.lineWidth = 1;

        for (let x = 0; x <= this.previewCanvas.width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.previewCanvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= this.previewCanvas.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.previewCanvas.width, y);
            ctx.stroke();
        }
    }

    drawPieceImage(ctx) {
        const filename = this.getPreviewFilename();

        if (!filename) {
            return;
        }

        const image = new Image();

        image.onload = () => {
            ctx.clearRect(
                0,
                0,
                this.previewCanvas.width,
                this.previewCanvas.height
            );

            ctx.fillStyle = "#dfe2e7";
            ctx.fillRect(
                0,
                0,
                this.previewCanvas.width,
                this.previewCanvas.height
            );

            this.drawPreviewGrid();

            const padding = 12;
            const maxWidth = this.previewCanvas.width - padding * 2;
            const maxHeight = this.previewCanvas.height - padding * 2;
            const scale = Math.min(
                maxWidth / image.width,
                maxHeight / image.height
            );
            const width = image.width * scale;
            const height = image.height * scale;
            const x = (this.previewCanvas.width - width) / 2;
            const y = (this.previewCanvas.height - height) / 2;

            ctx.drawImage(image, x, y, width, height);
        };

        image.src = `${ICON_PATH}${filename}`;
    }

    getPreviewFilename() {
        const { direction, slope, banking, operation } = this.currentPiece;

        if (operation !== "none") {
            return `operation-${operation}.png`;
        }

        if (slope !== "straight") {
            return `slope-${slope}.png`;
        }

        if (banking !== "none") {
            return `bank-${banking}.png`;
        }

        return `direction-${direction}.png`;
    }
}
