import fs from 'fs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const input = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const pairs = input.split(/\r\n/);

const result1 = pairs.map(pair => {
    const s1 = parseInt(pair.substring(0,pair.indexOf('-')));
    const e1 = parseInt(pair.substring(pair.indexOf('-')+1, pair.indexOf(',')));
    const s2 = parseInt(pair.substring(pair.indexOf(',')+1, pair.lastIndexOf('-')));
    const e2 = parseInt(pair.substring(pair.lastIndexOf('-')+1));

    // handle edge case where the maximum/minimum is shared, and is always a containing range
    if (s1 === s2 || e1 === e2) {
        return true;
    }

    // first pair has inner start
    if (s1 > s2 ) {
        // first pair has inner start AND inner end
        if (e1 <= e2) {
            return true;
        }
        return false;
    }

    // second pair starts within first
    if (s2 <= e1) {
        // second pair ends within first
        if (e2 <= e1) {
            return true;
        }
    }

    return false;
});

// print part 1 solution
// correct answer is: 462
console.log(`The solution for part 1 is: ${result1.filter(Boolean).length}`);

const result2 = pairs.map(pair => {
    const s1 = parseInt(pair.substring(0,pair.indexOf('-')));
    const e1 = parseInt(pair.substring(pair.indexOf('-')+1, pair.indexOf(',')));
    const s2 = parseInt(pair.substring(pair.indexOf(',')+1, pair.lastIndexOf('-')));
    const e2 = parseInt(pair.substring(pair.lastIndexOf('-')+1));

    // handle edge case where the maximum/minimum is shared, and is always a containing range
    if (s1 === s2 || e1 === e2) {
        return true;
    }

    // second pair starts before the first
    if (s1 > s2 ) {
        // second pair end overlaps with first pair start
        if (e2 >= s1) {
            return true;
        }
        return false;
    }

    // second pair starts before first ends
    if (s2 <= e1) {
        return true;
    }

    return false;
});

// print part 2 solution
// correct answer is: 835
console.log(`The solution for part 1 is: ${result2.filter(Boolean).length}`);
