module.exports = function (input) {
    const lines = input.trim().split('\n');
    const dangers1 = {};
    const dangers2 = {};
    for (let i = 0; i < lines.length; i++) {
        const coords = lines[i].match(/\d+/g).map(s => parseInt(s));
        let x1 = coords[0],
            x2 = coords[2],
            y1 = coords[1],
            y2 = coords[3];
        if (coords[0] > coords[2]) {
            x1 = coords[2];
            x2 = coords[0],
            y1 = coords[3],
            y2 = coords[1];
        }
        const dy = y2 === y1 ? 0 : y2 > y1 ? 1 : -1;
        const dx = x2 === x1 ? 0 : x2 > x1 ? 1 : -1;
        const len = Math.abs(y2 === y1 ? x2 - x1 : y2 - y1);
        // console.log(x1, y1, x2, y2)
        // console.log(dx, dy, len)
        for (let i = 0; i <= len; i++) {
            let x = x1 + i * dx,
                y = y1 + i * dy;
            const pos = `${x},${y}`;
            // console.log(pos)
            if (dx === 0 || dy === 0) {
                dangers1[pos] = (dangers1[pos] || 0) + 1
            }
            dangers2[pos] = (dangers2[pos] || 0) + 1
        }
    }
    // console.log(dangers2)
    return [Object.values(dangers1).filter(n => n > 1).length, Object.values(dangers2).filter(n => n > 1).length];
}