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
    const targetStack = stackSet[targetIndex];

    while (move.moveCount > 0) {
        // get single crate from top of source stack
        const crate = sourceStack.pop();
        // place single crate on top of target stack
        targetStack.push(crate);
        // decrement remaining move count
        move.moveCount = move.moveCount - 1;
    }
};

// parse move instructions
rawMoveList.map(moveStr => {
    // parse move
    const move = parseMove(moveStr);
    // move the crates!
    moveCrate(stacks, move);
});

// print solution
// correct answer is: QNHWJVJZW
console.log(`The solution for part 1 is: ${stacks.map(stack => stack.pop()).join('')}`);
