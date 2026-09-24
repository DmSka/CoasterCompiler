class Track {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.segments = [];
        this.history = [];
        this.recalculatePositions();
    }

    add(segment) {
        const newSegment = segment instanceof TrackSegment
            ? segment
            : new TrackSegment(segment);

        if (!newSegment.isValid()) {
            throw new Error("Invalid track segment.");
        }

        this.history.push(this.serialize());
        this.segments.push(newSegment);
        this.recalculatePositions();
    }

    update(index, segment) {
        if (index < 0 || index >= this.segments.length) {
            return;
        }

        const newSegment = segment instanceof TrackSegment
            ? segment
            : new TrackSegment(segment);

        if (!newSegment.isValid()) {
            throw new Error("Invalid track segment.");
        }

        this.history.push(this.serialize());
        this.segments[index] = newSegment;
        this.recalculatePositions();
    }

    undo() {
        if (this.history.length === 0) {
            return;
        }

        const previous = this.history.pop();

        this.segments = previous.map(data => TrackSegment.fromJSON(data));
        this.recalculatePositions();
    }

    clear() {
        if (this.segments.length > 0) {
            this.history.push(this.serialize());
        }

        this.segments = [];
        this.recalculatePositions();
    }

    serialize() {
        return this.segments.map(segment => segment.toJSON());
    }

    load(data) {
        if (!Array.isArray(data)) {
            throw new Error("Track JSON must contain a segments array.");
        }

        const loaded = data.map(segment => TrackSegment.fromJSON(segment));

        this.history.push(this.serialize());
        this.segments = loaded;
        this.recalculatePositions();
    }

    recalculatePositions() {
        let x = 0;
        let y = 0;
        let z = 0;
        let heading = 0;

        this.segments.forEach(segment => {
            segment.position = { x, y, z };

            const length = 70;

            if (segment.direction === "left") {
                heading -= Math.PI / 8;
            } else if (segment.direction === "right") {
                heading += Math.PI / 8;
            }

            let verticalDelta = 0;

            switch (segment.slope) {
                case "down-vertical":
                    verticalDelta = -45;
                    break;
                case "down-steep":
                    verticalDelta = -28;
                    break;
                case "down-shallow":
                    verticalDelta = -12;
                    break;
                case "up-shallow":
                    verticalDelta = 12;
                    break;
                case "up-steep":
                    verticalDelta = 28;
                    break;
                case "up-vertical":
                    verticalDelta = 45;
                    break;
            }

            x += Math.cos(heading) * length;
            z += Math.sin(heading) * length;
            y += verticalDelta;
        });
    }

    worldPoint(position) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        return {
            x: centerX + position.x * 0.85 - position.z * 0.45,
            y: centerY + position.y * 0.75 + position.x * 0.18 + position.z * 0.18
        };
    }

    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#8e987d";
        ctx.fillRect(0, 0, width, height);
        this.drawGrid();

        this.segments.forEach((segment, index) => {
            const point = this.worldPoint(segment.position);

            this.drawSegment(ctx, point.x, point.y, segment);

            ctx.fillStyle = "#25292d";
            ctx.font = "10px Tahoma";
            ctx.fillText(String(index + 1), point.x + 7, point.y - 7);
        });
    }

    drawGrid() {
        const ctx = this.ctx;
        const spacing = 40;

        ctx.strokeStyle = "rgba(60, 70, 55, 0.18)";
        ctx.lineWidth = 1;

        for (let x = 0; x <= this.canvas.width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
    }

    drawSegment(ctx, x, y, segment) {
        const railColor = segment.operation === "brake"
            ? "#8b3434"
            : segment.operation === "launch"
                ? "#c98a2e"
                : "#d8d8d2";

        ctx.save();
        ctx.translate(x, y);

        ctx.strokeStyle = "rgba(0,0,0,.25)";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-30, 10);
        ctx.lineTo(30, 10);
        ctx.stroke();

        ctx.strokeStyle = railColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-30, 5);
        ctx.lineTo(30, 5);
        ctx.stroke();

        ctx.strokeStyle = "#42474b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-24, 5);
        ctx.lineTo(-24, 27);
        ctx.moveTo(24, 5);
        ctx.lineTo(24, 27);
        ctx.stroke();

        ctx.restore();
    }

    hitTest(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        let nearest = null;
        let distance = Infinity;

        this.segments.forEach((segment, index) => {
            const point = this.worldPoint(segment.position);
            const dx = point.x - x;
            const dy = point.y - y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < distance && d <= 35) {
                distance = d;
                nearest = index;
            }
        });

        return nearest;
    }
}
