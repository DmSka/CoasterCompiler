# Coaster Code

Simple first-phase web interface for the Coaster Code project.

## Files

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

## Icons

The icon files are intentionally blank template PNG files. Replace them with your own track-piece icons without changing the HTML or JavaScript.

## Run

Open index.html in a browser.

No server is required.

## Project direction

The current page is only the editor/interface foundation.

The intended pipeline is:

Coaster Editor
    ->
G-force data + time
    ->
G Force Tokenizer
    ->
Token stream
    ->
C++ Compiler

The current token output is placeholder logic. It should later be replaced by a tokenizer that recognizes G-force patterns.
