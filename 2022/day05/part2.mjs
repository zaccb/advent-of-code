import fs from 'fs';
import {
    getMoveIndices,
    parseMove,
    stacksReal as stacks
} from './utils.mjs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const input = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const rawMoveList = input.split(/\r\n/);

const moveCrate = (stackSet, move) => {
    // derive 0-based stack indices from 1-based move instructions
    const [ sourceIndex, targetIndex ] = getMoveIndices(move);

    // get refs to individual stacks to make them easier to work with
    const sourceStack = stackSet[sourceIndex];

    // // slice from source and put on the end of target stack
    stackSet[targetIndex] = stackSet[targetIndex].concat(sourceStack.slice(-1 * move.moveCount));

    // retcon the source stack since .slice() is a shallow copy only
    if (move.moveCount < sourceStack.length) {
        // there's at least 1 element in the source stack
        stackSet[sourceIndex] = sourceStack.slice(0,sourceStack.length - move.moveCount);
    } else {    
        // the source stack should now be empty
        stackSet[sourceIndex] = [];
    }
}

// parse move instructions
rawMoveList.map(moveStr => {
    // parse move
    const move = parseMove(moveStr);
    // move the crates!
    moveCrate(stacks, move);
});

// print solution
// correct answer is: BPCZJLFJW
console.log(`The solution for part 2 is: ${stacks.map(stack => stack.pop()).join('')}`);
