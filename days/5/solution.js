module.exports = function (input) {
    const lines = input.trim().split('\n').map(l => l.match(/\d+/g).map(s => parseInt(s)));
    const max = Math.max(...lines.flat());
    const dangers1 = new Int8Array(max * max);
    const dangers2 = new Int8Array(max * max);
    for (let i = 0; i < lines.length; i++) {
        const coords = lines[i];
        const x1 = coords[0],
              x2 = coords[2],
              y1 = coords[1],
              y2 = coords[3];
        const dy = Math.sign(y2 - y1),
              dx = Math.sign(x2 - x1);
        const len = Math.abs(dy === 0 ? x2 - x1 : y2 - y1);

        for (let i = 0; i <= len; i++) {
            let x = x1 + i * dx,
                y = y1 + i * dy;
            const index = x + y * max;
            if (dx === 0 || dy === 0) {
                dangers1[index] += 1;
            }
            dangers2[index] += 1;
        }
    }
    return [
        dangers1.filter(n => n > 1).length,
        dangers2.filter(n => n > 1).length
    ];
}