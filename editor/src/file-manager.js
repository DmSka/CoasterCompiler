class FileManager {
    constructor(track, simulator) {
        this.track = track;
        this.simulator = simulator;
    }

    download(filename, content) {
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    saveTrack() {
        const data = {
            version: 1,
            type: "coaster-track",
            segments: this.track.serialize()
        };

        this.download("track-config.json", JSON.stringify(data, null, 4));
    }

    async loadTrack(file) {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!Array.isArray(data.segments)) {
            throw new Error("The selected file does not contain track segments.");
        }

        this.track.load(data.segments);
    }

    saveGraph() {
        this.download(
            "graph-data.json",
            JSON.stringify(this.simulator.toJSON(), null, 4)
        );
    }

    async loadGraph(file) {
        const text = await file.text();
        const data = JSON.parse(text);
        this.simulator.load(data);
    }
}
