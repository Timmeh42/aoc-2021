// @ts-nocheck
module.exports = function (input: string) {
    const lines = input.trim().split('\n');
    const vents = [];
    const dangers = {};
    for (let i = 0; i < lines.length; i++) {
        const coords = lines[i].match(/\d+/g).map(s => parseInt(s));
        if (coords[0] === coords[2]) {
            const x = coords[0];
            let y1 = coords[1],
                y2 = coords[3];
            if (coords[1] > coords[3]) {
                y1 = coords[3];
                y2 = coords[1];
            }
            for (let y = y1; y <= y2; y++) {
                // console.log(`${x},${y}`)
                dangers[`${x},${y}`] = (dangers[`${x},${y}`] || 0) + 1
            }
        } else if (coords[1] === coords[3]) {
            const y = coords[1];
            let x1 = coords[0],
                x2 = coords[2];
            if (coords[0] > coords[2]) {
                x1 = coords[2];
                x2 = coords[0];
            }
            for (let x = x1; x <= x2; x++) {
                // console.log(`${x},${y}`)
                dangers[`${x},${y}`] = (dangers[`${x},${y}`] || 0) + 1
            }
        }
    }
    // console.log(dangers)
    return Object.values(dangers).filter(n => n > 1).length;
}