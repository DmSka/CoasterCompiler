# Coaster Code source outline

Editor JavaScript is the UI and data layer. Physics and code generation belong in C++.

```text
HTML UI (index.html + app.js)
    |
    v
TrackEditor / Track / TrackSegment     layout authoring
    |
    v
PhysicsEngine                          JS placeholder, later WASM
    |                                  C++ WaveSample[] contract
    v
Simulator                              graphs + sample JSON
    |
    +--> graphs in the editor
    +--> Tokenizer  (JS preview of include/Tokenizer.h)
    +--> Compiler   (JS preview of C++ codegen)
```

## app.js
Application entry point at `editor/app.js`.
- Creates Track, TrackEditor, Simulator, FileManager
- Connects UI events
- Switches pages/tabs
- Draws graph output

## track-segment.js
One track piece: direction, slope, banking, operation, speed, acceleration.
Validation rule: sloped track must be unbanked.

## track-editor.js
Left-side Track Editor: property selection, preview, BUILD/UPDATE.

## track.js
Owns the layout: add/update/undo/clear, isometric draw, hit testing.

## physics-engine.js
Boundary for the C++ physics module compiled to WebAssembly.

Expected WASM surface:
```text
window.CoasterPhysics.simulateTrack(segments) -> { samples: WaveSample[] }
```

`WaveSample` matches `include/WaveSample.h`:
`time`, `verticalG`, `lateralG`, `forwardG`, `speed`, `height`, `banking`.

Until that module exists, a JS placeholder produces the same sample shape.

## simulator.js
Turns physics samples into graph series for the editor. Does not own physics.

## file-manager.js
Save/load `track-config.json` and `graph-data.json`.

## tokenizer.js
JS preview of ElementGenerator + TagGenerator + Tokenizer.
Replace with the native pipeline once it consumes the same sample JSON.

## compiler.js
JS preview of generated C++. Replace with the native code generator later.
