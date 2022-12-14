import fs from 'fs';
import helpers from '../helpers.mjs';
import { DIRS } from '../constants.mjs';
import { MinQueue } from './utils.mjs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const input = inputRaw.split(/\r\n/).map(str => str.split(''));

const serializeCoord = coords => {
    return `${coords.x}.${coords.y}`;
};

const deserializeCoord = coordID => {
    return { 
        y: parseInt(coordID.slice(coordID.indexOf('.') + 1)), 
        x: parseInt(coordID.slice(0,coordID.indexOf('.')))
    }
};

const isValid = (coords, matrix) => {
    let {x,y} = coords;
    const result = x >= 0 && y >= 0 && x < matrix[0].length && y < matrix.length;
    return result;
};

const getDistanceToNextPosition = (coordID, dir, matrix) => {
    const currentCoords = deserializeCoord(coordID);
    const nextCoords = { ...currentCoords };

    // update coords for next position
    switch(dir) {
        case DIRS.up:
            nextCoords.y = nextCoords.y - 1;
            break;
        case DIRS.down:
            nextCoords.y = nextCoords.y + 1;
            break;
        case DIRS.left:
            nextCoords.x = nextCoords.x - 1;
            break;
        case DIRS.right:
            nextCoords.x = nextCoords.x + 1;
            break;
    }

    // init object for sending back distance calc result
    const result = {
        coordID: serializeCoord(nextCoords),
        distance: null // assume position is outside of matrix unless we find it to explicitly be
    };

    if (isValid(nextCoords, matrix)) {
        // determine cost of traveling to next position
        const currentHeight = matrix[currentCoords.y][currentCoords.x];
        const nextHeight = matrix[nextCoords.y][nextCoords.x];
        const oneCharUp = String.fromCharCode(currentHeight.charCodeAt(0) + 1);

        if (nextHeight <= oneCharUp) {
            // we're allowed to travel this way
            // return the distance to this new position
            const delta = Math.abs(currentHeight.charCodeAt() - nextHeight.charCodeAt());
            result.distance = delta === 0 ? 1 : delta;
        } else {
            // we're not allowed to travel this way -- too high!
            result.distance = Infinity;
        }
    }

    return result;
}

// traverse matrix with a modified take on dijkstra's
const solvePath = (inputMatrix, startingCoords) => {
    const matrix = inputMatrix.map(row => {
        return row.map(col => {
            return col;
        })
    });

    // init a modified min pri queue to track the shortest distance position at any point
    const queue = new MinQueue();

    // init a distance map to all known points with an infinite distance
    const dist = {};
    const visited = [];

    // init start/end pointers as we'll find them when we build the distance map
    let coordsStart = {...startingCoords};
    let coordsEnd = null;

    matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            const coordID = serializeCoord({ x: colIndex, y: rowIndex});
            
            // init distance to infinity
            dist[coordID] = Infinity;
            queue.enqueue({
                coordID,
                distance: Infinity
            });

            if (coordsEnd === null && value === 'E') {
                // capture end position
                coordsEnd = {};
                coordsEnd.x = colIndex;
                coordsEnd.y = rowIndex;

                // normalize value for traversal comparison
                matrix[rowIndex][colIndex] = 'z'
            }
        });
    });

    // init starting coords to have a distance of 0
    const startingCoordID = serializeCoord(coordsStart);
    dist[startingCoordID] = 0;
    queue.updateKey(startingCoordID, 0);

    while(queue.size > 0) {
        // get next closest node
        const current = queue.dequeue();
        const { coordID, distance } = current;

        // visit this coord
        visited.push(coordID);

        // find distance to all adjacent positions
        Object.values(DIRS).forEach(dir => {
            // get distance of THIS dir only
            const result = getDistanceToNextPosition(coordID, dir, matrix);

            // update distance if this dir results in a valid position
            if (result.distance !== null) {
                dist[result.coordID] = Math.min(dist[result.coordID], result.distance + distance);

                if (queue.contains(result.coordID)) {
                    queue.updateKey(result.coordID, dist[result.coordID]);
                }
            }
        });
    }

    return dist[serializeCoord(coordsEnd)];
};

// PART 1
// --------------------------
let result = input
    .filter(line => line[0] === 'S')
    .map((e,index) => solvePath(input, { x:0, y:index }));
console.log(`The shortest path from a to E for part 1 is ${result} steps`);
// correct answer is: 420 (off by one error, solution is too low by 1 - 419)

// PART 2
// --------------------------
result = input.map((e, index) => solvePath(input, { x:0, y:index })).sort(helpers.ascending)[0];
console.log(`The shortest path from a to E for part 2 is ${result} steps`);
// correct answer is: 414 (off by one error, solution is too high by 1 - 415)
