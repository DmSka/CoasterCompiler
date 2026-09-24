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
- banking icon fixed
- insert own icons for undo and clear
- input for speed and accelartion should be above those icons, the spacing shouldn't move just should be visible
- the tabs on the button should go under the track segment preview. They should be alligned within the panel just look different 