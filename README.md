# Coaster Code

A roller-coaster editor and programming language that uses coaster track layouts to generate executable code.

## Coaster Editor

The Coaster Editor is the front-end portion of the project. It allows users to build custom roller-coaster layouts by placing and connecting predefined track pieces.

Within the Editor there 

The completed layout can be simulated to produce:

- Vertical G-force
- Lateral G-force
- Forward G-force
- Speed
- Banking
- Height

This data is then used by the code-generation portion of the project.

### Files

```text
index.html
style.css
app.js
```

### Track Piece Icons

The editor uses image files for the different track pieces.

| Icon | Track Element |
|---|---|
| `station.png` | Station |
| `straight.png` | Straight |
| `drop.png` | Drop |
| `turn-left.png` | Left Turn |
| `turn-right.png` | Right Turn |
| `lift.png` | Lift |
| `launch.png` | Launch |
| `inversion.png` | Inversion |

The icon files are intentionally provided as blank template PNGs. Replace them with custom track-piece icons without changing the HTML or JavaScript.

### Running the Editor

Open `index.html` in a web browser.

---

## Code Generation

The Code Generation system converts simulated coaster data into a sequence of tags and tokens, which are then used to generate C++ code.

The process is:

```text
Coaster Layout
      |
      v
   Simulation
      |
      v
  G-Force Data
      |
      v
Element Generator
      |
      v
  Tag Generator
      |
      v
    Tokenizer
      |
      v
 C++ Code Generator
      |
      v
 Generated C++ Code
```

## Software Architecture

### 1. Element Generator

The Element Generator takes the simulated coaster data and divides it into individual elements.

Straight sections of track are used as boundaries between elements. Each element contains information describing the track behavior during that section.

### Element Information

| Element Information | Unit |
|---|---|
| **Start Time** | `seconds` |
| **End Time** | `seconds` |
| **Average Lateral G** | `g` |
| **Average Vertical G** | `g` |
| **Average Forward G** | `g` |
| **Average Speed** | `mph` |
| **Speed Delta** | `mph` |
| **Start Height** | `feet` |
| **End Height** | `feet` |
| **Average Height** | `feet` |
| **Start Banking** | `degrees` |
| **End Banking** | `degrees` |
| **Average Banking** | `degrees` |

---

### 2. Tag Generator

The Tag Generator analyzes each element and identifies track features that correspond to programming-language constructs.

For example:

```text
Floater      -> int
Ejector      -> string
Stall        -> +
Double Down  -> if
Station      -> print
```

These tags provide the intermediate representation between the physical coaster elements and programming-language tokens.

---

### 3. Tokenizer

The Tokenizer converts the tags generated from the coaster elements into programming-language tokens.

**Status:** To be implemented.

### Tokens and Tags

| Category | Token | Track Tag(s) | Meaning |
|---|---|---|---|
| **Type** | `int` | Floater | Integer value |
| **Type** | `string` | Ejector | String / character value |
| **Mathematics** | `+` | Stall | Addition |
| **Mathematics** | `-` | Right turn, Banking | Subtraction |
| **Mathematics** | `=` | Left turn, Banking | Assignment |
| **Boolean** | `if` | Double down | Conditional statement |
| **Boolean** | `for` | Double up | For loop |
| **Boolean** | `while` | Double inversion | While loop |
| **Semantics** | `;` | Acceleration | End of statement |
| **Semantics** | `(` | Ejector, Banking, Left turn | Start of expression |
| **Semantics** | `)` | Ejector, Banking, Right turn | End of expression |
| **I/O** | `print` | Station block | Output |
| **I/O** | `input` | Chain lift block | User input |

---

### 4. Value Encoding

Values are encoded using specific track features within the coaster layout.

| Component | Track Feature | Purpose |
|---|---|---|
| **Value Start** | Stop | Marks the beginning of a value |
| **Type** | Left Turn | Integer |
| **Type** | Straight | ASCII character |
| **Type** | Right Turn | Hexadecimal |
| **Value** | Drop Height | Determines the value |
| **Value End** | Stop | Marks the end of a value |

This allows physical properties of the coaster, such as drop height and track direction, to represent values in the generated program.

---

### 5. C++ Code Generator

The C++ Code Generator takes the generated tokens and produces valid C++ source code.

**Status:** To be implemented.

The intended process is:

```text
Tags
  |
  v
Tokens
  |
  v
Syntax / Structure
  |
  v
C++ Source Code
```

---

## Input and Output

### Input

The code-generation system will accept simulated coaster data as either:

- JSON
- Coaster data file

Example:

```text
Coaster Layout
      |
      v
  Export Data
      |
      v
 JSON / Data File
```

### Output

The final output will be a C++ source file generated from the coaster's track layout and simulated data.

```text
Coaster Data
     |
     v
Generated C++ Code
```

## Current Development Status

| Component | Status |
|---|---|
| Coaster Editor | In Development |
| Track Piece System | In Development |
| Coaster Simulation | Planned |
| Element Generator | Planned |
| Tag Generator | Planned |
| Tokenizer | Not Implemented |
| C++ Code Generator | Not Implemented |
| JSON Input | Planned |
| Code Generation Pipeline | Planned |

## Project Goal

The goal of Coaster Code is to create a programming language where **roller-coaster design becomes a method of writing programs**.

Physical coaster elements, forces, and track features are interpreted as programming constructs. A completed coaster can therefore be transformed from:

```text
Track Layout
     ↓
Physical Simulation
     ↓
G-Force / Speed / Height Data
     ↓
Elements
     ↓
Tags
     ↓
Tokens
     ↓
C++ Code
```

The final result is a programming language where the structure and properties of a roller coaster determine the behavior of the generated program.
