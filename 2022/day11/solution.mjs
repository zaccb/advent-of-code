import fs from 'fs';
import helpers from '../helpers.mjs';
import { createMonkey } from './utils.mjs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const inputs = inputRaw.split(/\r\n\r\n/);

// create parseable strings from user input
const monkeyStringArrays = inputs.map(elem => {
    return elem.split(/\r\n/).map(elem => elem.trim());
});

const passItemWithReduction = (value, divisor) => {
    return divisor > 1n ? value % divisor : value;
};

const calcMonkeyBusiness = (monkeys, rounds, threatReductionFactor=1, tossReductionFactor=1) => {
    const monkeyMap = {};

    // create a map of monkey IDs for constant time, direct retrieval later
    monkeys.forEach(monkey => monkeyMap[monkey.ID] = monkey);

    while (rounds > 0) {
        rounds--;
    
        monkeys.forEach(monkey => {
            while (monkey.items.length > 0) {
                let item = monkey.items.shift();
                const operand = monkey.operation.operand;
                const divisor = monkey.divisor;
    
                // increase threat
                item = monkey.operation.func(item,operand);
                monkey.incrementInspectionCount();

                // descrease threat
                item = Math.floor(item / threatReductionFactor);
                
                if (item % divisor == 0) {
                    // throw to if true monkey
                    monkeyMap[monkey.trueMonkeyID].addItem(passItemWithReduction(item, tossReductionFactor));
                } else {
                    // throw to if false monkey
                    monkeyMap[monkey.falseMonkeyID].addItem(passItemWithReduction(item, tossReductionFactor));
                }
            }
        })   
    }

    return monkeys
        .map(monkey => monkey.inspectionCount)
        .sort(helpers.descending)
        .slice(0,2)
        .reduce(helpers.multiply);
};

// PART 1
// --------------------------
let monkeys = monkeyStringArrays.map(createMonkey);
let result = calcMonkeyBusiness(monkeys, 20, 3, 1);
console.log(`The level of monkey business for part 1 is ${result}`);
// correct answer is: 62491

// PART 2
// --------------------------
monkeys = monkeyStringArrays.map(createMonkey);
// get GCF of all prime divisors
const commonPrimeDivisor = monkeys.map(monkey => monkey.divisor).reduce(helpers.multiply);
result = calcMonkeyBusiness(monkeys, 10000, 1, commonPrimeDivisor);
console.log(`The level of monkey business for part 2 is ${result}`);
// correct answer is: 17408399184
