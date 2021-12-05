module.exports = function (input) {
    const lines = input.trim().split('\n');
    const dangers1 = new Array(1000);
    const dangers2 = new Array(1000);
    for (let i = 0; i < lines.length; i++) {
        const coords = lines[i].match(/\d+/g).map(s => parseInt(s));
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

            if (!dangers1[x]) {
                dangers1[x] = new Array(1000);
                dangers2[x] = new Array(1000);
            }
            if (dx === 0 || dy === 0) {
                dangers1[x][y] = (dangers1[x][y] || 0) + 1
            }
            dangers2[x][y] = (dangers2[x][y] || 0) + 1
        }
    }
    return [
        dangers1.flat().filter(n => n > 1).length,
        dangers2.flat().filter(n => n > 1).length
    ];
}