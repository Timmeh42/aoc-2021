module.exports = function (input) {
    const lines = input.split('\n');
    let x = 0,
        y1 = 0,
        y2 = 0,
        aim = 0;

    for (let line of lines) {
        const [instr, val] = line.split(' ');
        const delta = parseInt(val);
        if (instr == 'forward') {
            x += delta;
            y2 += delta * aim
        }
        if (instr == 'up') {
            y1 -= delta;
            aim -= delta;
        }
        if (instr == 'down') {
            y1 += delta;
            aim += delta;
        }
    }

    return [x * y1, x * y2];
}