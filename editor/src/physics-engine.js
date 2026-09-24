/**
 * Physics boundary for the editor.
 *
 * The C++ simulator will compile to WebAssembly and expose the same contract:
 *   simulate(segments) -> { samples: WaveSample[] }
 *
 * WaveSample matches include/WaveSample.h:
 *   time, verticalG, lateralG, forwardG, speed, height, banking
 *
 * Until the WASM module is linked, this class uses a JS placeholder so the
 * rest of the pipeline (graphs, tokenizer, compiler) can run.
 */
class PhysicsEngine {
    constructor() {
        this.wasm = window.CoasterPhysics || null;
    }

    simulate(segments) {
        if (this.wasm && typeof this.wasm.simulateTrack === "function") {
            return this.normalize(this.wasm.simulateTrack(segments));
        }

        return this.placeholder(segments);
    }

    normalize(result) {
        if (Array.isArray(result)) {
            return { samples: result };
        }

        if (result && Array.isArray(result.samples)) {
            return result;
        }

        throw new Error("Physics engine returned an unrecognized result.");
    }

    placeholder(segments) {
        const samples = [];
        let speed = 0;
        let height = 0;

        segments.forEach((segment, segmentIndex) => {
            const count = 20;

            for (let i = 0; i < count; i++) {
                const t = i / Math.max(count - 1, 1);
                const verticalG = this.verticalG(segment);
                const lateralG = this.lateralG(segment);
                const forwardG = this.forwardG(segment);

                if (segment.operation === "launch") {
                    speed += segment.acceleration * 0.05;
                } else if (segment.operation === "brake") {
                    speed = Math.max(0, speed - segment.acceleration * 0.03);
                } else if (segment.operation === "lift") {
                    speed = Math.max(speed, 8);
                    height += 0.4;
                } else {
                    speed += verticalG * -0.15;
                    speed = Math.max(0, speed);
                }

                height += this.heightDelta(segment) * (1 / count);

                samples.push({
                    time: segmentIndex + t,
                    verticalG,
                    lateralG,
                    forwardG,
                    speed,
                    height,
                    banking: this.banking(segment)
                });
            }
        });

        return { samples };
    }

    verticalG(segment) {
        switch (segment.slope) {
            case "down-vertical":
                return -2.0;
            case "down-steep":
                return -1.5;
            case "down-shallow":
                return -0.6;
            case "up-shallow":
                return 0.6;
            case "up-steep":
                return 1.5;
            case "up-vertical":
                return 2.0;
            default:
                return 1.0;
        }
    }

    lateralG(segment) {
        if (segment.direction === "left") {
            return -1;
        }

        if (segment.direction === "right") {
            return 1;
        }

        return 0;
    }

    forwardG(segment) {
        if (segment.operation === "launch") {
            return segment.acceleration;
        }

        if (segment.operation === "brake") {
            return -segment.acceleration;
        }

        return 0;
    }

    banking(segment) {
        switch (segment.banking) {
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

    heightDelta(segment) {
        switch (segment.slope) {
            case "down-vertical":
                return -45;
            case "down-steep":
                return -28;
            case "down-shallow":
                return -12;
            case "up-shallow":
                return 12;
            case "up-steep":
                return 28;
            case "up-vertical":
                return 45;
            default:
                return 0;
        }
    }
}
