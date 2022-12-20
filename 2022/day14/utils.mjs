// debug methods
export const printMatrixToConsole = () => {
    matrix.forEach(row => {
        let line = '';
        row.forEach(cell => {
            line += cell;
        });
        console.log(line);
    });
}

export const printMatrixToFile = () => {
    let buffer = '';
    matrix.forEach(row => {
        row.forEach(cell => {
            buffer += cell;
        });
        buffer += "\n";
    });

    fs.writeFileSync('debug.txt', buffer);
};
