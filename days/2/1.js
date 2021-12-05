module.exports = function (input) {
    const lines = input.split('\n');
    let x = 0,
        y = 0;

    for (let line of lines) {
        const [instr, val] = line.split(' ');
        const delta = parseInt(val);
        if (instr == 'forward') {
            x += delta;
        }
        if (instr == 'up') {
            y -= delta;
        }
        if (instr == 'down') {
            y += delta;
        }
    }

    return x * y;
}