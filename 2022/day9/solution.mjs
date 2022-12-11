import fs from 'fs';
import helpers from '../helpers.mjs';
import { DIRS } from '../constants.mjs';

const FILENAME = './input.txt';
// const FILENAME = './sample1.txt';
// const FILENAME = './sample2.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const inputs = inputRaw.split(/\r\n/);

const trackVisitedPosition = (map, serialCoords) => {
    // takes an x/y value that is serialized as X.Y
    // and adds to the map if it has not yet been visited
    if (!map.hasOwnProperty(serialCoords)) {
        // add to map
        map[serialCoords] = 1;
    }
};

const moveHead = (dir, stepsRemaining, rope, positionMap) => {
    const headCoords = rope[0];
    
    // base case
    if (stepsRemaining === 0) {
        return;
    }

    switch(dir) {
        case DIRS.right:
            headCoords.x = headCoords.x + 1;
            break;
        case DIRS.left:
            headCoords.x = headCoords.x - 1;
            break;
        case DIRS.down:
            headCoords.y = headCoords.y - 1;
            break;
        case DIRS.up:
            headCoords.y = headCoords.y + 1;
            break;
    }

    // sync movement to other knots in rope
    moveKnots(rope, positionMap);

    // recurse
    return moveHead(dir, stepsRemaining-1, rope, positionMap);
};

const moveKnots = (rope, positionMap, pos=1) => {
    // get a reference to this knot and the one before it
    const coordsCurrent = rope[pos];
    const coordsPrev = rope[pos-1];

    const deltaX = Math.abs(coordsPrev.x - coordsCurrent.x);
    const deltaY = Math.abs(coordsPrev.y - coordsCurrent.y);

    // base case, no move is needed b/c tail is within 1 of head
    if (deltaX < 2 && deltaY < 2) {
        return;
    }

    // move horizontal
    if (deltaX > 0) {
        if (coordsPrev.x > coordsCurrent.x) {
            // head is ahead 
            coordsCurrent.x = coordsCurrent.x + 1;
        } else {
            // head is behind
            coordsCurrent.x = coordsCurrent.x - 1;
        }
    }

    // move vertical
    if (deltaY > 0) {
        if (coordsPrev.y > coordsCurrent.y) {
            // head is above
            coordsCurrent.y = coordsCurrent.y + 1;
        } else {
            // head is below
            coordsCurrent.y = coordsCurrent.y - 1;
        }
    }

    if (pos < rope.length - 1) {
        // recurse to next knot
        moveKnots(rope, positionMap, pos + 1);
    } else {
        // end recursion
        // log unique position of tail
        trackVisitedPosition(positionMap, `${coordsCurrent.y}.${coordsCurrent.x}`);
    }
}

// init an array representation of all knots in the rope + head/tail
const rope1 = [
    {x:0,y:0}, // Head
    {x:0,y:0}  // Tail
];

const rope2 = [
    {x:0,y:0}, // Head
    {x:0,y:0}, // Knot 1
    {x:0,y:0}, // Knot 2
    {x:0,y:0}, // Knot 3
    {x:0,y:0}, // Knot 4
    {x:0,y:0}, // Knot 5
    {x:0,y:0}, // Knot 6
    {x:0,y:0}, // Knot 7
    {x:0,y:0}, // Knot 8
    {x:0,y:0}, // Tail (a.k.a. knot 9)
];

// init map of visited coords with starting position
const visitedPostionsMap1 = {'0.0':1};
const visitedPostionsMap2 = {'0.0':1};

// move head & all knots in rope for each input move
inputs.forEach(move => {
    const [ dir, stepCount ] = move.split(' ');

    // move H/T for rope in part1
    moveHead(dir, stepCount, rope1, visitedPostionsMap1);

    // move H/T for rope in part2
    moveHead(dir, stepCount, rope2, visitedPostionsMap2);
});

// PART 1
// --------------------------
let result = Object.values(visitedPostionsMap1).reduce(helpers.sum);
console.log(`The count of unique tail positions for part 1 is ${result}`);
// correct answer is: 5930

// PART 2
// --------------------------
result = Object.values(visitedPostionsMap2).reduce(helpers.sum);
console.log(`The count of unique tail positions for part 2 is ${result}`);
// correct answer is: 2443
