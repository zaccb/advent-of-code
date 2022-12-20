import fs from 'fs';
import helpers from '../helpers.mjs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();

// init some unreasonably large x range so that we can accomodate
// the bounds of part 1 and unbounded part 2
const rangeX = 1000;
let maxY = 0;

const createXVal = val => {
    return parseInt(val);
}
const createYVal = val => {
    const num = parseInt(val);
    num > maxY && (maxY = num);
    return parseInt(num);
}

const paths = inputRaw
    .split(/\r\n/)
    .map(line => {
        return line
        .split(' -> ')
        .map(coord => {
            const [ x, y ] = coord.split(',');
            return { x: createXVal(x), y: createYVal(y) }
        })
    });

const startingChar = () => CHARS.air;
const CHARS = {
    air: '.',
    rock: '#',
    sand: '+'
};

const createPath = matrix => pathCoords => {
    let lastCoords = pathCoords[0];
    pathCoords.forEach((coord, index) => {
        let { x, y } = coord;
        if (index === 0) {
            // start of rock path
            setMatrix(matrix)(x,y);          
        } else {
            while (y !== lastCoords.y) {
                setMatrix(matrix)(x,y);

                if (y > lastCoords.y) {
                    y--;
                } else {
                    y++;
                }
            }

            while (x !== lastCoords.x) {
                setMatrix(matrix)(x, y);

                if (x > lastCoords.x) {
                    x--;
                } else {
                    x++;
                }
            }
        }

        lastCoords = coord;
    })
};

const setMatrix = matrix => (x,y) => {
    matrix[y][x] = CHARS.rock;
};

const dropSand = matrix => coords => {
    const { x, y } = coords;
    
    // base case
    if (y >= maxY) {
        // sand will fall of left edge or
        // sand will fall down forever
        // i.e. sand will never stop
        return false;
    }

    // fall priority - down, down left, down right, rest

    // check down
    if (isEmptyPosition(matrix)({ x, y: y+1 })) {
        // recurse falling down one
        return dropSand(matrix)({ x, y: y+1 })
    }

    // check down left
    if (isEmptyPosition(matrix)({ x: x-1, y: y+1 })) {
        // recurse falling down + left
        return dropSand(matrix)({ x: x-1, y: y+1 })
    }

    // check down right
    if (isEmptyPosition(matrix)({ x: x+1, y: y+1 })) {
        // recurse falling down + right
        return dropSand(matrix)({ x: x+1, y: y+1 })
    }

    // can't go anywhere so some to rest
    matrix[y][x] = CHARS.sand;
    return true;
};

const isEmptyPosition = matrix => coords => {
    const { x,y } = coords;
    return matrix[y][x] === CHARS.air
};

const simulate = showFloor => {
    // init matrix representing cross-section
    const arrayHeight = maxY + 1;
    const arrayWidth = rangeX + 1;
    const matrix = Array.from(Array(arrayHeight)).map(() => Array.from(Array(arrayWidth)).map(startingChar));

    const createPaths = paths => {
        // draw the path of each rock in the starting matrix
        paths.forEach(createPath(matrix));

        if (showFloor) {
            // reset the maxY value
            maxY = maxY + 2;

            // add the floor
            let x = arrayWidth;
            let y = arrayHeight + 1;

            matrix.push(Array.from(Array(x)).map(()=>CHARS.air));
            matrix.push(Array.from(Array(x)).map(()=>CHARS.air));

            while (x > 0) {
                matrix[y][x-1] = CHARS.rock;
                x--;
            }
        }
    }

    createPaths(paths);

    let grainCount = 0;
    let atRest = true;
    
    do {
        const x = 500;
        const y = 0;

        grainCount++;
        atRest = dropSand(matrix)({ x, y });

        if (showFloor && matrix[y][x] === CHARS.sand) {
            // end loop if we have a floor and want to stop when the chamber is full
            atRest = false;
        }
    } while (atRest);

    return grainCount;
}

// PART 1
// --------------------------
let result = simulate();
console.log(`A total of ${result} grains fell before falling off into infinity.`);
// correct answer is: 828

// PART 2
// --------------------------
result = simulate(true);
console.log(`A total of ${result} grains fell before the cave entrance was blocked.`);
// correct answer is: 25500
