module.exports = function (input) {
    const lines = input.trim().split('\n').map(l => l.match(/\d+/g).map(s => parseInt(s)));
    const max = Math.max(...lines.flat());
    const dangers1 = new Int8Array(max * max);
    const dangers2 = new Int8Array(max * max);
    let count1 = 0;
    let count2 = 0;
    for (let i = 0; i < lines.length; i++) {
        const coords = lines[i];
        const x1 = coords[0],
              x2 = coords[2],
              y1 = coords[1],
              y2 = coords[3];
        const dy = Math.sign(y2 - y1),
              dx = Math.sign(x2 - x1);
        const cartesian = dx === 0 || dy === 0;

        const len = dy === 0 ? (x2 - x1)*dx : (y2 - y1)*dy;
        for (let i = 0; i <= len; i++) {
            const x = x1 + i * dx,
                  y = y1 + i * dy;
            const index = x + y * max;
            if (cartesian) {
                const current1 = dangers1[index];
                if (current1 === 0) {
                    dangers1[index] = current1 + 1;
                } else if (current1 === 1) {
                    dangers1[index] = current1 + 1;
                    count1 ++;
                }
            }
            const current2 = dangers2[index];
            if (current2 === 0) {
                dangers2[index] = current2 + 1;
            } else if (current2 === 1) {
                dangers2[index] = current2 + 1;
                count2 ++;
            }
        }
    }
    return [
        count1,
        count2
    ];
}