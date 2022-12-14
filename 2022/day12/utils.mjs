// this is a loose min pri queue ADT
export class MinQueue {
    constructor(){
        this.contents = [];
    };

    // Getters
    get size() {
        return this.contents.length;
    }

    _sort(){
        this.contents.sort((a,b) => a.distance - b.distance);
    }

    print(){
        this._sort();
        console.log(this.contents);
    }

    enqueue(item){
        this.contents.push(item);
    }

    dequeue(){
        this._sort();
        return this.contents.shift();
    }

    updateKey(key,newValue){
        this.contents.map(elem => {
            if (elem.coordID === key) {
                elem.distance = newValue;
            }
            return elem;
        });
    }
    
    contains(key){
        return this.contents.some(item => item.coordID === key);
    }
}
