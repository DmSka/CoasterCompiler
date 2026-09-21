# Coaster Code

Coaster editor and code generator for coaster layouts

## Coaster Editor

This is the editor portion of the project. This webpage will allow users to place track pieces and built custom layouts. These layouts can be simulated to produce G-Force waves along with speed, banking, and height data.

### Files

index.html
style.css
app.js

| Icons |
|---|---|
| station.png |
| straight.png |
| drop.png |
| turn-left.png |
| turn-right.png |
| lift.png |
| launch.png |
| inversion.png |

### Icons

The icon files are intentionally blank template PNG files. Replace them with your own track-piece icons without changing the HTML or JavaScript.

### Run

Open index.html in a browser.


## Code Generation

This portion will take in the coaster data and generate C++ code from the layout.


### Tokens and Tags

Tokens are created from tags associated with each track element.

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
| **Value** | Start | Stop | Beginning of encoded value |
| **Value** | Type | Left turn | Integer |
| **Value** | Type | Straight | ASCII character |
| **Value** | Type | Right turn | Hexadecimal |
| **Value** | Value | Drop height | Encoded value |
| **Value** | End | Stop | End of encoded value |

### Software Architecture

This is an outline of the software architecture used to produce the code

#### Element Generator

This will take in the inputs for the graphs, and using straight track pieces, generate elements with their own information:

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

#### Tag Generator

Each of these elements is analyized for create tags for their information.

#### Tokenizer

Takes tags and creates tokens for their elements. 
needs to be implemented

### Run

needs to be implemented
will be generated through webpage inputing a json or file type for coaster data