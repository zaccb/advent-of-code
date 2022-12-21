class Node {
    constructor(name, size=0) {
        this._size = parseInt(size);
        this._name = name;
        this._children = [];
        this._parent = [];
    }

    // Getters
    get size() {
        if (this instanceof File) {
            return this._size;
        } else {
            return this.getSize();
        } 
    }

    get name() {
        return this._name;
    }

    get children() {
        return this._children;
    }

    get parent() {
        return this._parent;
    }

    // Setters
    set size(size) {
        this._size = size;
    }

    set name(name) {
        this._name = name;
    }

    set parent(node) {
        this._parent = node;
    }

    // Methods
    addChild(node) {
        node.parent = this;
        this.children.push(node);
    }

    getSize() {
        const visited = [];
        const nodesToVisit = [...this.children];
        let sum = 0;
    
        while (nodesToVisit.length > 0) {
            // let current = nodesToVisit.shift();
            // sum += current.size;

            let current = nodesToVisit.shift();
            // only continue if this node hasn't been visited
            if (!visited.includes(current)) {
                // console.log('adding: ', current.name);
                if (current instanceof File) {
                    sum += current.size;
                }
                visited.push(current)
                if(current.children.length > 0){
                    nodesToVisit.push(...current.children);
                }
            }
        }

        return sum;
    }

    sumChildrenUnderNSize(n) {
        const visited = [];
        const nodesToVisit = [...this.children];
        let sum = 0;
    
        while (nodesToVisit.length > 0) {
            let current = nodesToVisit.shift();
            // only continue if this node hasn't been visited
            if (!visited.includes(current)) {
                if (current instanceof Dir) {
                    const currentSize = current.getSize();
                    if (currentSize <= n) {
                        sum += currentSize;
                    }
                }
                visited.push(current)
                if(current.children.length > 0){
                    nodesToVisit.push(...current.children);
                }
            }
        }

        return sum;
    }
}

export class File extends Node {
    constructor(filename, size) {
        super(filename, size);
    }
}

export class Dir extends Node {
    constructor(dirname) {
        super(dirname);
    }
}

export class Tree {
    constructor(rootNode) {
        this._root = rootNode;
    }

    get root(){
        return this._root;
    }
}

export const treeHelpers = {
    getSize: obj => obj.getSize()
}
