# Coaster Code

Coaster editor and code generator for coaster layouts

## Coaster Editor

This is the editor portion of the project. This webpage will allow users to place track pieces and built custom layouts. These layouts can be simulated to produce G-Force waves along with speed, banking, and height data.

### Files

index.html
style.css
app.js

icons/
    station.png
    straight.png
    drop.png
    turn-left.png
    turn-right.png
    lift.png
    launch.png
    inversion.png

### Icons

The icon files are intentionally blank template PNG files. Replace them with your own track-piece icons without changing the HTML or JavaScript.

### Run

Open index.html in a browser.

## Code Generation

This portion will take in the coaster data and generate C++ code from the layout

### Software Architecture

This is an outline of the software architecture used to produce the code

#### Wave Pattern Detector

#### Element Generator

#### Tag Generator

#### Tokenizer

### Run

needs to be implemented
will be generated through webpage inputing a json or file type for coaster data