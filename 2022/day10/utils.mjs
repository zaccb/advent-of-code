import CONSTANTS from './constants.mjs';
import helpers from '../helpers.mjs';

const noopFunc = () => { /** noop */};

const isMathOp = op => {
    const result = op.slice(0,3);
    return validMathOps.includes(result);
};

const validMathOps = [
    CONSTANTS.OPS.add
];

const cycleCountByOp = {
    [CONSTANTS.OPS.noop]: 1,
    [CONSTANTS.OPS.add]: 2
};

const opFuncMap = {
    [CONSTANTS.OPS.noop]: noopFunc,
    [CONSTANTS.OPS.add]: (existingRegisterValue, opValue) => {
        return existingRegisterValue + opValue
    }
};

const initRegisterKey = (register, key) => {
    if (!register.hasOwnProperty(key)) {
        register[key] = 1;
    }
};

const parseOp = line => {
    const optionalParams = {}
    let name = line.slice(0,4);

    if (isMathOp(name)) {
        // add
        name = name.slice(0,3);
        optionalParams.registerKey = line.slice(3,4);
        optionalParams.arg = parseInt(line.slice(5));
    }

    const result = {name, ...optionalParams};
    return result;
};

export class CPU {
    constructor() {
        this._cycleCount = 0;
        this._register = {};
        this._signalStrengths = [];
        this._crt = new CRT(6,40);
    }

    // Getters
    get cycleCount() {
        return this._cycleCount;
    }

    get register() {
        return this._register;
    }

    get signalStrength() {
        return this._signalStrengths.reduce(helpers.sum);
    }

    // Methods
    tick(){
        this._crt.drawPixelAt(this._cycleCount);

        this._cycleCount = this._cycleCount + 1;

        switch(this._cycleCount) {
            case 20:
            case 60:
            case 100:
            case 140:
            case 180:
            case 220:
                // log signal strength
                this._signalStrengths.push(this._register.x * this._cycleCount)
                break;
        }
    }

    updateRegisterX(value){
        // update local state
        this._register['x'] = value;
        // update position of sprite
        this._crt.moveSprite(value);
    }

    getRegisterValueByKey(key) {
        return this._register[key];
    }

    processSignal(input){
        // parse input
        const op = parseOp(input);
        const ticks = cycleCountByOp[op.name];

        // increment cycles
        for(let i = 0; i < ticks; i++) {
            this.tick();
        }

        // process known operations
        switch(op.name) {
            case CONSTANTS.OPS.add:
                const opFunc = opFuncMap[op.name];
                initRegisterKey(this._register,op.registerKey);
                this.updateRegisterX(opFunc(this._register[op.registerKey], op.arg));
                break;
        }
    }

    display(){
        this._crt.printMatrix();
    }
}

export class CRT {
    constructor(height, width) {
        this._CONSTANTS = {
            pixelOn: '#',
            pixelOff: '.'
        };
        
        this._matrix = Array.from(Array(height)).map(() => Array.from(Array(width)).map(() => this._CONSTANTS.pixelOff));
        
        this._spriteCoords = {
            start: 0, end: 2 // initial position at first cycle
        };
    }

    // Getters
    get matrix(){
        return this._matrix;
    }

    // Methods
    moveSprite(centerPos) {
        this._spriteCoords = {
            start: centerPos - 1,
            end: centerPos + 1
        }
    }

    getRow(cycle) {
        if (cycle <= 40) { return 0; }
        if (cycle <= 80) { return 1; }
        if (cycle <= 120) { return 2; }
        if (cycle <= 160) { return 3; }
        if (cycle <= 200) { return 4; }
        return 5;
    }

    isWithinSpriteRange(pos) {
        return pos >= this._spriteCoords.start && pos <= this._spriteCoords.end;
    }

    drawPixelAt(cycle){
        const row = this.getRow(cycle);

        // normalize position based onn row offset calc
        let pos = row === 0 ? cycle : cycle - (40*row);
        pos = pos === 1 && cycle > 40 ? 0 : pos;

        if (this.isWithinSpriteRange(pos)) {
            // light pixel!
            this._matrix[row][pos] = this._CONSTANTS.pixelOn;
        }
    }

    printMatrix(){
        this._matrix.forEach(row => {
            let rowDisplay = '';
            row.forEach(val => {
                rowDisplay += val
            });
            console.log(rowDisplay);
        });
    }
}
