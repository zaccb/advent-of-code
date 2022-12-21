import fs from 'fs';
import helpers from '../helpers.mjs';
import { Dir, File, Tree, treeHelpers } from './utils.mjs';

// const FILENAME = './sample.txt';
const FILENAME = './input.txt';
const inputRaw = fs.readFileSync(FILENAME, { encoding: "utf-8" }).trim();
const lines = inputRaw.split(/\r\n/);

const buildDirTreeFromUserInput = (userInputLines, dirSizeMap) => {
    // build directory from tree 
    let currentPath = '/';
    const root = new Dir(currentPath);
    const tree = new Tree(root);

    // track where we're in the tree
    let currentParent = tree.root;

    userInputLines.shift();

    // parse each userInputLine into a Dir, File, or command and traverse or attach to tree
    while (userInputLines.length > 0) {
        const current = userInputLines.shift();

        // is a child node - Dir
        if (current.slice(0,3) === 'dir') {
            const currentDirName = current.slice(current.indexOf(' ') + 1);
            const node = new Dir(currentDirName);
            dirSizeMap[`${currentPath}/${currentDirName}`] = node;
            // create Dir and add to current parent
            currentParent.addChild(node);
        }

        // is a child node - File
        if (Number.isInteger(parseInt(current[0]))) {
            const currentFileSize = parseInt(current.slice(0,current.indexOf(' ')));
            const currentFileName = current.slice(current.indexOf(' ') + 1);

            // create File and add to current parent
            currentParent.addChild(new File(currentFileName, currentFileSize));
        }

        // is a user command
        if (current.slice(0,1) === '$') {
            const currentCommand = current.slice(1,4).trim();

            // user is going into a Dir
            if (currentCommand === 'cd') {
                const currentDirName = current.slice(5);

                if (currentDirName !== '..') {
                    // we're going into a dir so update path and parent node
                    currentParent = dirSizeMap[`${currentPath}/${currentDirName}`];
                    currentPath += '/' + currentDirName;
                } else {
                    // we're going up a dir!
                    currentPath = currentPath.slice(0,currentPath.lastIndexOf('/'));
                    currentParent = currentParent.parent;
                }
            }
        }
    }

    return tree;
};

// init dir size map we can use to quickly track unique filepath sizes
const dirSizeMap = {};

// init dir tree we can use for both parts
const tree = buildDirTreeFromUserInput(lines, dirSizeMap);

// PART 1
// --------------------------
// correct answer is: 1444896
let result = tree.root.sumChildrenUnderNSize(100000);
console.log(`The sum of dir sizes in tree under 100k is ${result}`, );

// init params for part 2
const totalSizeOfFileSystem = 70000000;
const freeSpaceNeeded = 30000000;

// calc space needed
const spaceUsed = tree.root.getSize();
const spaceLeft = totalSizeOfFileSystem - spaceUsed;
const spaceNeededToReclaim = freeSpaceNeeded - spaceLeft;

// find all dir sizes under target and get highest val
result = Object
    .values(dirSizeMap)
    .map(treeHelpers.getSize)
    .filter(helpers.noMoreThanN(spaceNeededToReclaim))
    .sort(helpers.ascending)[0];

// PART 2
// --------------------------
// correct answer is: 404395
console.log(`The smallest directory we can delete to reclaim needed space is ${result}`, );
