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
    X: 1, Y: 2, Z: 3
};

// map a normalization of ABC->XYZ to make things easier to think about
const mapTheirChoiceToMine = {
    A: 'X', B: 'Y', C: 'Z'
};

// map a given choice to whatever beats it
const mapChoicesThatBeat = {
    X: 'Y', Y: 'Z', Z: 'X' 
};

// TODO: can I get derive this from `mapChoicesThatBeat`, instead of having a second map?
// map a given choice to whatever loses to it
const mapChoicesThatLose = {
    X: 'Z', Y: 'X', Z: 'Y' 
};

rounds.forEach(round => {
    // break round into two separate moves
    let [ elf, need ] = round.split(' ');
    // normalize elf choice
    elf = mapTheirChoiceToMine[elf];

    // calc points based on the `need` portion of the cypher
    switch(need) {
        case 'Y': // I need to DRAW
            sum += mapPointsOfChoice[elf]; // points for my choice
            sum += 3; // points for result
            // TODO: Is a map or some CONST better for points calc of result?
            break;
        case 'Z': // I need to WIN
            sum += mapPointsOfChoice[mapChoicesThatBeat[elf]]; // points for my choice
            sum += 6; // points for the result
            break;
        default: // I need to LOSE 
            sum += mapPointsOfChoice[mapChoicesThatLose[elf]]; // points for my choice
            // no points for result :(
    }
});

// print solution
console.log(sum);
