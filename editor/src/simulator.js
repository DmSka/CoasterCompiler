class Simulator {
    constructor(physicsEngine = new PhysicsEngine()) {
        this.physics = physicsEngine;
        this.samples = [];
        this.graphData = Simulator.emptyGraphs();
    }

    static emptyGraphs() {
        return {
            vertical: [],
            forward: [],
            lateral: [],
            speed: [],
            height: [],
            banking: []
        };
    }

    run(segments) {
        const payload = segments.map(segment =>
            typeof segment.toJSON === "function" ? segment.toJSON() : segment
        );

        const result = this.physics.simulate(payload);
        this.samples = result.samples || [];
        this.graphData = this.graphsFromSamples(this.samples);
        return this.graphData;
    }

    graphsFromSamples(samples) {
        const graphs = Simulator.emptyGraphs();

        samples.forEach(sample => {
            const time = sample.time;

            graphs.vertical.push({ time, value: sample.verticalG });
            graphs.forward.push({ time, value: sample.forwardG });
            graphs.lateral.push({ time, value: sample.lateralG });
            graphs.speed.push({ time, value: sample.speed });
            graphs.height.push({ time, value: sample.height });
            graphs.banking.push({ time, value: sample.banking });
        });

        return graphs;
    }

    toJSON() {
        return {
            version: 1,
            type: "coaster-graph",
            graphs: this.graphData,
            samples: this.samples
        };
    }

    load(data) {
        if (!data || typeof data !== "object") {
            throw new Error("Invalid graph JSON.");
        }

        if (Array.isArray(data.samples) && data.samples.length) {
            this.samples = data.samples;
            this.graphData = this.graphsFromSamples(data.samples);
            return;
        }

        if (data.graphs && typeof data.graphs === "object") {
            this.graphData = {
                ...Simulator.emptyGraphs(),
                ...data.graphs
            };
            this.samples = this.samplesFromGraphs(this.graphData);
            return;
        }

        throw new Error("Invalid graph JSON.");
    }

    samplesFromGraphs(graphs) {
        const length = (graphs.vertical || []).length;
        const samples = [];

        for (let i = 0; i < length; i++) {
            samples.push({
                time: graphs.vertical[i]?.time ?? i,
                verticalG: graphs.vertical[i]?.value ?? 1,
                lateralG: graphs.lateral[i]?.value ?? 0,
                forwardG: graphs.forward[i]?.value ?? 0,
                speed: graphs.speed[i]?.value ?? 0,
                height: graphs.height[i]?.value ?? 0,
                banking: graphs.banking[i]?.value ?? 0
            });
        }

        return samples;
    }
}
