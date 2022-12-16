import fs from 'fs';
import helpers from '../helpers.mjs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();

const input1 = inputRaw.split(/\r\n\r\n/).map(str => str.split(/\r\n/).map(str => JSON.parse(str)));
const input2 = inputRaw
                    .split(/\r\n/)
                    .map(line => {
                        if(line !== '') {
                            return JSON.parse(line);
                        }
                    }).filter(Boolean);

const TEST_RESULT = {
    pass: '1',
    fail: '-1',
    inconclusive: '0'
};

const dividerPackets = [
    [[2]],
    [[6]]
];

const mixedFirstElemTypeToArray = (list1, list2) => {
    if (typeof list1[0] !== typeof list2[0]){
        if (Number.isInteger(list1[0])) {
            list1[0] = [list1[0]];
        } else {
            list2[0] = [list2[0]];
        }
    }
};

const compare = (list1, list2) => {
    // check the list count edge cases
    if (list1.length === 0 && list2.length > 0) {
        // pair IS CORRECT order
        return TEST_RESULT.pass;
    }
    if (list1.length > 0 && list2.length === 0) {
        // pair IS NOT CORRECT order
        return TEST_RESULT.fail;
    }
    if(list1.length === 0 && list2.length === 0) {
        // we cannot make a decision about the input
        return TEST_RESULT.inconclusive;
    }

    // handle mixed types
    if (typeof list1[0] !== typeof list2[0]) {
        // cast any int to ARRAY
        mixedFirstElemTypeToArray(list1, list2);
        // recurse
        return compare(list1, list2);
    }
    
    // recurse on nested arrays
    if (Array.isArray(list1[0]) && Array.isArray(list2[0])) {
        const resultOfFirstElem = compare(list1[0], list2[0]);
        switch(resultOfFirstElem) {
            case TEST_RESULT.inconclusive:
                // continue
                return compare(list1.slice(1), list2.slice(1));
            case TEST_RESULT.pass:
            case TEST_RESULT.fail:
                // return result up the call stack, no need to continue recursion
                return resultOfFirstElem;
        }
    }

    // this can only be a NUMBER now, right?
    if (list1[0] < list2[0]) {
        // pair IS CORRECT order
        return TEST_RESULT.pass;
    }
    if (list1[0] > list2[0]) {
        // pair IS NOT CORRECT order
        return TEST_RESULT.fail;
    }

    // found no issue, continue looking on a smaller array
    return compare(list1.slice(1), list2.slice(1));
}

const processSignal = inputArr => {
    let indicesOfCorrectPairs = [];

    inputArr.forEach((input, index) => {
        const [ left, right ] = input;
        const result = compare(left, right);
        switch(result) {
            case TEST_RESULT.pass:
                indicesOfCorrectPairs.push(index + 1);
                break;
        }
    });

    return indicesOfCorrectPairs.reduce(helpers.sum);
};

// PART 1
// --------------------------
let result = processSignal(input1);
console.log(`The sum of indices of pairs in the right order for part 1 is ${result}`);
// correct answer is: 6086

// PART 2
// --------------------------
// modify the input for part 2 by adding the divider packets
dividerPackets.forEach(packet => {
    input2.push(packet);
});

// sort now that we have all packets w/compare func as custom sort comparator
input2.sort((a,b) => compare(b,a));

// calc result
result = dividerPackets.map(packet => input2.indexOf(packet) + 1).reduce(helpers.multiply);
console.log(`The decoder key for part 2 is ${result}`);
// correct answer is: 27930