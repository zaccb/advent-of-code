import fs from 'fs';
import { CPU } from './utils.mjs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const inputs = inputRaw.split(/\r\n/);

// init a CPU and give a singla input for each line of user input
const cpu = new CPU();

inputs.forEach(line => {
    cpu.processSignal(line);
});

// PART 1
// --------------------------
console.log(`The sum of signal strengths for part 1 is ${cpu.signalStrength}`);
// correct answer is: 13220

// Part 2
// --------------------------
cpu.display();
// correct answer is: RUAKHBEK
