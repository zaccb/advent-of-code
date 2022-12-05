import fs from 'fs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const input = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const couplets = input.split(/\r\n/);

// programmatically generate a map of characters to values based on all valid input chars
const allValidChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const valueMap = {}
allValidChars.forEach((value, index) => valueMap[value] = index + 1);

const getSinglePacks = couplet => {
    const len = couplet.length;
    // create single packs by splitting a full string in 2
    return [
        couplet.substring(0, len/2),
        couplet.substring(len/2, len)
    ]
};

const findCommonCharLCS = (str1, str2) => {
    // modified recursive LCS, could be more efficient with pointers?
    for (let i = 0; i < str2.length; i++) {
        if (str1[0] == str2[i]) {
            return str1[0]
        }
    }
    return findCommonCharLCS(str1.substring(1), str2);
};

let sum = 0;

couplets.forEach(couplet => {
    const [ pack1, pack2 ] = getSinglePacks(couplet);
    const result = findCommonCharLCS(pack1, pack2);
    sum += valueMap[result];
});

// print solution
console.log(sum);

// correct answer is: 7997 (real input), 157 (example data)