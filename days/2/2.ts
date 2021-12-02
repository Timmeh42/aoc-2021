module.exports = function (input: string) {
    const lines = input.split('\n');
    let x = 0,
        y = 0,
        aim = 0;

    for (let line of lines) {
        const [instr, val] = line.split(' ');
        const delta = parseInt(val);
        if (instr == 'forward') {
            x += delta;
            y += delta * aim
        }
        if (instr == 'up') {
            aim -= delta;
        }
        if (instr == 'down') {
            aim += delta;
        }
    }

    return x * y;
}