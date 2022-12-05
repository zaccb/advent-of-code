import fs from 'fs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const input = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const allPacks = input.split(/\r\n/);

// init a temp array to hold our groups of 3 packs
let group = [];

// programmatically generate a map of characters to values based on all valid input chars
const allValidChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const valueMap = {}
allValidChars.forEach((value, index) => valueMap[value] = index + 1);

const findCommonCharLCSInThree = (str1, str2, str3) => {
    // naive, modified LCS, efficieny is :garbage-fire:
    // TODO: improve with recursion
    for (let i = 0; i < str1.length; i++) {
        for (let j = 0; j < str2.length; j++) {
            for (let k =0; k < str3.length; k++) {
                if (str1[i] === str2[j] && str2[j] === str3[k]) {
                    return str1[i]
                }
            }
        } 
    }
};

let sum = 0;

allPacks.forEach(pack => {
    // add pack to temp arr
    group.push(pack);
    if(group.length === 3) {
        // calc result of this group of 3
        sum += valueMap[findCommonCharLCSInThree(...group)]
        // reset temp arr
        group = [];
    }
});

// print solution
console.log(sum);

// correct answer was: 2545 (real input), 70 (example data)