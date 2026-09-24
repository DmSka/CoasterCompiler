class TrackSegment {
    constructor(data = {}) {
        this.direction = data.direction ?? "straight";
        this.slope = data.slope ?? "straight";
        this.banking = data.banking ?? "none";
        this.operation = data.operation ?? "none";
        this.speed = Number(data.speed ?? 40);
        this.acceleration = Number(data.acceleration ?? 1);
        this.position = data.position ?? { x: 0, y: 0, z: 0 };
    }

    isValid() {
        if (this.slope !== "straight" && this.banking !== "none") {
            return false;
        }

        return true;
    }

    toJSON() {
        return {
            direction: this.direction,
            slope: this.slope,
            banking: this.banking,
            operation: this.operation,
            speed: this.speed,
            acceleration: this.acceleration,
            position: { ...this.position }
        };
    }

    static fromJSON(data) {
        const segment = new TrackSegment(data);

        if (!segment.isValid()) {
            throw new Error(
                "Invalid track segment: sloped track must be unbanked."
            );
        }

        return segment;
    }
}
