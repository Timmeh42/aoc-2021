module.exports = function (input: string) {
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
    return gamma * ((2 ** lineLength - 1) ^ gamma);
}