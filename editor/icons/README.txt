This is an outline of icons and there status

# UI

## Direction

- [x] direction-left
- [x] direction-right
- [x] direction-straight

## Slope

- [x] slope-down-shallow
- [x] slope-down-steep
- [x] slope-down-vertical
- [x] slope-straight
- [x] slope-up-shallow
- [x] slope-up-steep
- [x] slope-up-vertical

## Banking 

- [x] bank-left
- [x] bank-right
- [x] bank-none
- [x] bank-vertical-left
- [x] bank-vertical-right

## Operation

- [x] operation-brake
- [x] operation-launch
- [x] operation-lift
- [ ] operation-none

## Other

- [x] Simulate


# Track

Track Segments will be generated in 3d based on the properties of the segment and the previous segment

## Allowance table

This shows what segments are allowed to follow a previous segment

straight <-> shallow/steep
shallow <-> steep
steep <-> vertical

unbanked <-> vertical-bank/bank
vertical-bank <-> bank

- shallow slope 
    - banked
    - turn

- steep slope
    - turn

- vertical slope
    - turn

- outer banked turns are also allowed

- operation pieces can go on anything



I am not sure how to handle inversion yet
- 


## Transition

### Slope

- [ ] straight -> up-shallow
- [ ] straight -> up-steep

- [ ] down-shallow -> straight
- [ ] down-steep -> straight

- [ ] up-shallow -> up-steep
- [ ] up-steep -> up-vertical

- [ ] down-steep -> down-shallow
- [ ] down-vertical -> down-steep


### Banking

- [ ] none -> right
- [ ] none -> right-vertical
- [ ] none -> left
- [ ] none -> left-vertical

- [ ] right -> none
- [ ] right-vertical -> none
- [ ] left -> none
- [ ] left-vertical -> none

- [ ] right -> right-vertical
- [ ] right-vertical -> right

- [ ] left -> left-vertical
- [ ] left-vertical -> left


## Stagnant 

### Slope

- [ ] straight
- [ ] down-shallow
- [ ] down-steep
- [ ] down-vertical
- [ ] up-shallow
- [ ] up-steep
- [ ] up-vertical

### 


Reworks for UI.
- remove a lot of  the labels for stuff, remove blueprint preview, remove the title at the top, remove the track world, add back the icon to the simulate button, remove piece builder, remove turns, sloep, banking labels, remove speical modifiers labels, remove the labels none, launch, lift, brake, remove the Coaster code and track system online at the top, please remove live data and force monitor tags, the tabs at the button should be part of the bottom panel, they should be much smaller and be connected, also remove the background between the 3 columns on the button,the banking is better but still doesnt go in a circle, the buuttons for that panel should all be more rounded on the edges and have darker colors when selected. the build track button should be large and in the middle underneath the turns and slope buttons. on either side of that will be the undo and clear buttons as rounded circles, those should look like an eraser, and whiteout, I can make those icons if needed. the crts look very stretched out please make it go all the way to the bottom and top of the screen, also do this with the speed height and banking tab