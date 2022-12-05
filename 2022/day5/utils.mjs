const getMoveIndices = move => [move.sourceStack - 1, move.targetStack - 1]

// given a raw string, create an object containing KVPs with the actual moves 
const parseMove = moveStr => {
    // trim first text fragment
    let moveSet = moveStr.substr(moveStr.indexOf(' ') + 1);
    
    // parse # of crates to be moved
    const moveCount = parseInt(moveSet.substr(0,moveSet.indexOf(' ')));
    
    // reduce moveset to exclude # of crates
    moveSet = moveSet.substr(moveSet.indexOf('from') + 5);

    // parse source/target crate stacks
    const sourceStack = parseInt(moveSet.substr(0,moveSet.indexOf(' ')));
    const targetStack = parseInt(moveSet.substr(moveSet.indexOf('to') + 3));

    return({
        moveCount,
        sourceStack,
        targetStack
    });
};

// stack configuration of the real input
const stacksReal = [
    ['C','Z','N','B','M','W','Q','V'],
    ['H','Z','R','W','C','B'],
    ['F','Q','R','J'],
    ['Z','S','W','H','F','N','M','T'],
    ['G','F','W','L','N','Q','P'],
    ['L','P','W'],
    ['V','B','D','R','G','C','Q','J'],
    ['Z','Q','N','B','W'],
    ['H','L','F','C','G','T','J']
];

// stack configuration of the real input
const stacksExample = [
    ['Z','N'],
    ['M','C','D'],
    ['P']
];

export {
    getMoveIndices,
    parseMove,
    stacksReal,
    stacksExample
};
