/**
 * JS stand-in for include/Tokenizer.h + TagGenerator.
 * Consumes WaveSample arrays from the simulator. The native C++ pipeline
 * (ElementGenerator -> TagGenerator -> Tokenizer) should replace this
 * once that code is compiled to WASM or invoked from the same sample JSON.
 */
class Tokenizer {
    tokenize(input) {
        const samples = this.toSamples(input);

        if (!samples.length) {
            return "// No simulation data. Build a track and click SIMULATE.";
        }

        const elements = this.splitElements(samples);
        const lines = ["// Coaster Code tokens (JS preview of the C++ tokenizer)", ""];

        elements.forEach((element, index) => {
            const tags = this.tagsFor(element);
            const tokens = tags.map(tag => this.tokenFor(tag)).filter(Boolean);

            lines.push(`element ${index + 1}`);
            lines.push(`  time ${element.startTime.toFixed(2)}..${element.endTime.toFixed(2)}`);
            lines.push(`  tags ${tags.join(", ") || "(none)"}`);
            lines.push(`  tokens ${tokens.join(" ") || "(none)"}`);
            lines.push("");
        });

        return lines.join("\n");
    }

    toSamples(input) {
        if (Array.isArray(input)) {
            return input;
        }

        if (input && Array.isArray(input.samples)) {
            return input.samples;
        }

        if (input && input.vertical) {
            return input.vertical.map((point, i) => ({
                time: point.time,
                verticalG: point.value,
                lateralG: input.lateral?.[i]?.value ?? 0,
                forwardG: input.forward?.[i]?.value ?? 0,
                speed: input.speed?.[i]?.value ?? 0,
                height: input.height?.[i]?.value ?? 0,
                banking: input.banking?.[i]?.value ?? 0
            }));
        }

        return [];
    }

    splitElements(samples) {
        const elements = [];
        let current = [samples[0]];

        const isBoundary = sample =>
            Math.abs(sample.lateralG) < 0.2 &&
            Math.abs(sample.verticalG - 1) < 0.25 &&
            Math.abs(sample.forwardG) < 0.2;

        for (let i = 1; i < samples.length; i++) {
            const sample = samples[i];
            const prev = samples[i - 1];
            const crossedStraight = isBoundary(sample) && !isBoundary(prev);

            if (crossedStraight && current.length > 4) {
                elements.push(this.summarize(current));
                current = [sample];
            } else {
                current.push(sample);
            }
        }

        if (current.length) {
            elements.push(this.summarize(current));
        }

        return elements;
    }

    summarize(samples) {
        const n = samples.length;
        const sum = samples.reduce(
            (acc, sample) => {
                acc.verticalG += sample.verticalG;
                acc.lateralG += sample.lateralG;
                acc.forwardG += sample.forwardG;
                acc.speed += sample.speed;
                acc.height += sample.height;
                acc.banking += sample.banking;
                return acc;
            },
            { verticalG: 0, lateralG: 0, forwardG: 0, speed: 0, height: 0, banking: 0 }
        );

        return {
            startTime: samples[0].time,
            endTime: samples[n - 1].time,
            averageVerticalG: sum.verticalG / n,
            averageLateralG: sum.lateralG / n,
            averageForwardG: sum.forwardG / n,
            averageSpeed: sum.speed / n,
            speedDelta: samples[n - 1].speed - samples[0].speed,
            startHeight: samples[0].height,
            endHeight: samples[n - 1].height,
            averageBanking: sum.banking / n
        };
    }

    tagsFor(element) {
        const tags = [];

        if (element.averageLateralG > 0.35) {
            tags.push("RightTurn");
        } else if (element.averageLateralG < -0.35) {
            tags.push("LeftTurn");
        }

        if (element.averageForwardG > 0.2) {
            tags.push("Acceleration");
        } else if (element.averageForwardG < -0.2) {
            tags.push("Deceleration");
        }

        if (element.averageSpeed < 0.5) {
            tags.push("Stop");
        }

        if (element.averageVerticalG < -0.3) {
            tags.push("Ejector");
            tags.push("Drop");
        } else if (Math.abs(element.averageVerticalG) < 0.25) {
            tags.push("Floater");
        } else if (element.averageVerticalG > 1.2) {
            tags.push("Valley");
        }

        if (Math.abs(element.averageBanking) > 80) {
            tags.push("Stall");
        } else if (Math.abs(element.averageBanking) > 15) {
            tags.push("Banking");
        }

        return tags;
    }

    tokenFor(tag) {
        switch (tag) {
            case "Floater":
                return "int";
            case "Ejector":
                return "string";
            case "Stall":
                return "+";
            case "RightTurn":
                return "-";
            case "LeftTurn":
                return "=";
            case "Drop":
                return "value";
            case "Acceleration":
                return ";";
            case "Deceleration":
                return "brake";
            default:
                return tag.toLowerCase();
        }
    }
}
