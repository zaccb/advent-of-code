import helpers from '../helpers.mjs';

const OPERATOR_FUNCS = {
    '*': helpers.multiply,
    '+': helpers.sum,
    '^': helpers.square
};

const getMonkeyId = str => str.slice(str.indexOf(' ') + 1,str.indexOf(' ') + 2);
const getStartingItems = str => str.slice(str.indexOf(':') + 2).split(', ').map(Number);
const getTargetMonkeyID = str => str.slice(-1);
const getDivisor = str => parseInt(str.slice(str.lastIndexOf(' ') + 1));

const getOperation = str => {
    const equation = str.slice(str.indexOf('=') + 2);
    let operator = equation.slice(equation.indexOf(' ') + 1, equation.indexOf(' ') + 2);
    const operand = equation.slice(equation.lastIndexOf(' ') + 1);

    // normalize operation when we're dealing with old * old edge case
    if (operand === 'old') {
        operator = '^'
    }

    return {
        func: OPERATOR_FUNCS[operator],
        operand: parseInt(operand)
    }
};
    
export const createMonkey = monkeyStrArr => {
    // parse properties about this Monkey
    const ID = getMonkeyId(monkeyStrArr[0]);
    const startingItems = getStartingItems(monkeyStrArr[1]);
    const operation = getOperation(monkeyStrArr[2]);
    const divisor = getDivisor(monkeyStrArr[3]);
    const trueMonkeyID = getTargetMonkeyID(monkeyStrArr[4]);
    const falseMonkeyID = getTargetMonkeyID(monkeyStrArr[5]);

    // create Monkey obj and store it in place
    const monkey = new Monkey(
        ID, 
        startingItems, 
        divisor, 
        trueMonkeyID, 
        falseMonkeyID, 
        operation
    );

    return monkey;
};

export class Monkey {
    constructor(
        monkeyID,
        startingItems, 
        divisor,
        trueMonkeyID,
        falseMonkeyID,
        operation
    ) {
        this._ID = monkeyID;
        this._items = [...startingItems];
        this._divisor = divisor;
        this._trueMonkeyID = trueMonkeyID;
        this._falseMonkeyID = falseMonkeyID;
        this._operation = operation;
        this._inspectionCount = 0;
    }

    // Getter
    get ID() {
        return this._ID;
    }
    get items(){
        return this._items;
    }
    get trueMonkeyID(){
        return this._trueMonkeyID;
    }
    get falseMonkeyID(){
        return this._falseMonkeyID;
    }
    get operation(){
        return this._operation;
    }
    get divisor(){
        return this._divisor;
    }
    get inspectionCount(){
        return this._inspectionCount;
    }

    // Setters
    set items(arr) {
        this._items = arr;
    }

    // Methods
    addItem(item){
        this._items.push(item);
    }
    incrementInspectionCount(){
        this._inspectionCount = this._inspectionCount + 1;
    }
}
