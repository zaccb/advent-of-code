import fs from 'fs';
import PriorityQueue from 'javascript-priority-queue';

// init max queue ADT
const queue = new PriorityQueue.default('max');

// parse input file to array
// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const input = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const calories = input.split(/\r/).map(entry => {
    return entry === `\n` ? null : parseInt(entry);
});

// create an ending datum
calories.push(null);

// init vars
let counter = 1;
let sum = 0;

calories.forEach(entry => {
    if (entry !== null) {
        // add calories
        sum += entry;
    } else {
        // this elf has no more calories, add sum total cals to queue
        queue.enqueue(sum, sum);
        // reset vars for next elf
        counter += 1;
        sum = 0;
    }
});

// print solution
// correct answer is: 71502
console.log(queue.peek());
