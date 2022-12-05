import fs from 'fs';

// parse input file to array
// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const input = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const rounds = input.split(/\r\n/);

// init sum
let sum = 0;

// map point value of each choice I make
const mapPointsOfChoice = {
    X:1, Y:2, Z: 3
};

// map a normalization of ABC->XYZ to make things easier to think about
const mapTheirChoiceToMine = {
    A: 'X', B: 'Y', C: 'Z'
};

// map a given choice to whatever beats it
const mapChoicesThatBeat = {
    X: 'Y', Y: 'Z', Z: 'X' 
};

rounds.forEach(round => {
    // break round into two separate moves
    let [ elf, self ] = round.split(' ');
    // normalize elf choice
    elf = mapTheirChoiceToMine[elf];

    // get points based on my current choice
    sum += mapPointsOfChoice[self];

    // handle draw
    if (elf === self) {
        sum += 3;
    } else {
        // handle win/loss scenario
        if (mapChoicesThatBeat[elf] === self) {
            // I won :)
            sum += 6
        }
        // I lost :(
        // loss is zero points so no code needed: )
    }
});

// print solution
// correct answer is: 
console.log(sum);
