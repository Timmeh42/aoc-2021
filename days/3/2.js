function filter(lines, pickOnes = true) {
    const lineLength = lines[0].length;
    for (let j = 0; j < lineLength; j++) {
        const ones = [],
              zeroes = [];
        const lineCount = lines.length;
        for (let i = 0; i < lineCount; i++) {
            const line = lines[i];
            if (line[j] === '1') {
                ones.push(line);
            } else {
                zeroes.push(line);
            }
        }
        lines = (ones.length >= zeroes.length) == pickOnes ? ones : zeroes;
        if (lines.length === 1) {
            break;
        }
    }
    return lines[0];
}

module.exports = function (input) {
    const lines = input.trim().split('\n');
    const oxy = parseInt(filter(lines), 2);
    const co2 = parseInt(filter(lines, false), 2);
    return oxy * co2;
}
