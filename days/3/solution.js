function filter(lines, pickOnes = true) {
    const lineLength = lines[0].length;
    for (let j = 0; j < lineLength; j++) {
        const lineCount = lines.length;
        if (lineCount === 1) {
            break;
        }
        const ones = lines.filter(b => b[j] === '1');
        const zeroes = lines.filter(b => b[j] === '0');
        if ((ones.length >= zeroes.length) == pickOnes) {
            lines = ones;
        } else {
            lines = zeroes;
        }
    }
    return lines[0];
}

module.exports = function (input) {
    const lines = input.trim().split('\n');


    const lineCount = lines.length;
    const lineLength = lines[0].length;
    let gamma = 0;
    for (let j = 0; j < lineLength; j++) {
        gamma = gamma << 1;
        let counter = 0;
        for (let i = 0; i < lineCount; i++) {
            if (lines[i][j] === '1') {
                counter++
            }
            if (counter * 2 >= lineCount) {
                gamma += 1;
                break;
            }
        }
    }
    const part1 = gamma * ((2 ** lineLength - 1) ^ gamma);




    const part2 = parseInt(filter(lines), 2) * parseInt(filter(lines, false), 2);
    return [part1, part2];
}
