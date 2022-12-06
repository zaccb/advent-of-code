import fs from 'fs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const inputArr = inputRaw.split('');

// reusable signal processing func for both parts
const processSignal = (inputChars, minSequenceLength) => {
    // init vars for part 1
    const markerArr = [];
    let bestValidIndex = 0;
    let foundIndex = null;

    // process each char and short circuit if solution found earlier
    for (let i = 0; i < inputChars.length; i++) {
        const char = inputChars[i];
        
        if (markerArr.includes(char)) {
            // char already in array, invalidate index of last occurence
            // only if it is further right than last known valid index
            const thisValidIndex = markerArr.lastIndexOf(char) + 1;
            if (thisValidIndex > bestValidIndex) {
                bestValidIndex = thisValidIndex;
            }
        }

        // add this char to array
        markerArr.push(char);

        // enforce max arr size
        if (markerArr.length > minSequenceLength) {
            markerArr.shift();

            // update last valid index now that array elems have shifted
            if (bestValidIndex > 0) {
                bestValidIndex--;
            }

            // check for win condition
            if (bestValidIndex === 0) {
                // win found, break out of loop earlier
                foundIndex = i + 1;
                break;
            }
        }
    }

    return foundIndex;
}

// print solutions

// PART 1
// --------------------------
console.log(`The solution for part 1 is: ${processSignal(inputArr, 4)}`);
// the correct answer is: 1850

// PART 2
// --------------------------
console.log(`The solution for part 2 is: ${processSignal(inputArr, 14)}`);
// the correct answer is: 2823