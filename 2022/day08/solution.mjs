import fs from 'fs';
import helpers from '../helpers.mjs';
import { DIRS } from '../constants.mjs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const matrix = inputRaw.split(/\r\n/).map(elem => elem.split('').map(Number));

const atEdge = (x,y) => x === 0 || y === 0 || x === xMax || y === yMax;
const zerosToOnes = num => num < 1 ? 1 : num;

// init starting coords, known scenic scores, and count of visible trees
let countVisible = 0;
const scores = [];
const coords = {
    x: 0,
    y: 0
}

// init x/y coord max
const xMax = matrix[0].length - 1;
const yMax = matrix.length - 1;

const advanceCoords = obj => {
    if (obj.x < xMax) {
        obj.x = obj.x + 1;
    } else {
        obj.y = obj.y + 1;
        obj.x = 0;
    }
};

const isVisible = (height, dir, coords, count=0) => {
    const { x, y } = coords;

    // base case
    if (atEdge(x,y)) {
        return {
            visibleFromEdge: true,
            visibleTreeCount: count
        };
    }

    switch(dir) {
        case DIRS.up:
            if (matrix[y+1][x] < height) {
                // recurse
                return isVisible(height, dir, {
                    x: x,
                    y: y+1
                }, count + 1);
            }
            break;
        case DIRS.left:
            if (matrix[y][x-1] < height) {
                // recurse
                return isVisible(height, dir, {
                    x: x-1,
                    y: y
                }, count + 1);
            }
            break;
        case DIRS.right:
            if (matrix[y][x+1] < height) {
                // recurse
                return isVisible(height, dir, {
                    x: x+1,
                    y: y
                }, count + 1);
            }
            break;
        case DIRS.down:
            if (matrix[y-1][x] < height) {
                // recurse
                return isVisible(height, dir, {
                    x: x,
                    y: y-1
                }, count + 1);
            }
            break;
    }

    // a higher tree was found between source and edge
    return {
        visibleFromEdge: false,
        visibleTreeCount: count + 1
    };
}

while(yMax >= coords.y) {
    const { x, y } = coords;
    let currentVisible = false;

    // at edge, therefore, visible
    if (atEdge(x,y)) {
        // matrix[y][x] = 'X';
        countVisible += 1;
        advanceCoords(coords);
        continue;
    }

    const scenicScore = [];

    // check all directions
    Object.values(DIRS).forEach(dir => {
        const result = isVisible(matrix[y][x], dir, {x,y});

        if (result.visibleFromEdge) {
            if (!currentVisible) {
                currentVisible = true;
            } 
        }

        scenicScore.push(result.visibleTreeCount);
    });

    scores.push(scenicScore.map(zerosToOnes).reduce(helpers.multiply));

    if (currentVisible) {
        countVisible += 1
    };

    advanceCoords(coords);
}

// PART 1
// --------------------------
console.log(`There are ${countVisible} trees visible from the edge of the grid`);
// correct answer is: 1829

// PART 2
// --------------------------
const result = scores.sort(helpers.descending)[0];
console.log(`The highest scenic score is ${result}`);
// correct answer is: 291840
