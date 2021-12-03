module.exports = function (input: string) {
    const lines = input.trim().split('\n');
    const lineCount = lines.length;
    const lineLength = lines[0].length;
    const bits: number[] = (new Array(lines[0].length)).fill(0);
    for (let i = 0; i < lineCount; i++) {
        const line = lines[i];
        for (let j = 0; j < lineLength; j++) {
            const bit = line[j];
            if (bit === '1') {
                bits[j]++;
            }
        }
    }
    for (let i = 0; i < lineLength; i++) {
        bits[i] = Math.round(bits[i] / lineCount);
    }
    const gamma = parseInt(bits.join(''), 2);
    return gamma * ((2 ** lineLength - 1) ^ gamma);
}