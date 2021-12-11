module.exports = function (input) {
    const width = input.indexOf('\n');
    const height = input.match(/\n/g).length + 1;

    const grid = input.split('\n').map(l => l.split('').map(s => +s));

    let part1, part2;

    let flashes = 0;
    for (let t = 0; true; t++) {
        let stepFlashes = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                stepFlashes += feed(x, y, grid, width, height);
            }
        }
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (grid[x][y] > 9) {
                    grid[x][y] = 0;
                }
             }
        }
        flashes += stepFlashes;
        if (t === 99) {
            part1 = flashes;
        }
        if (stepFlashes === width * height) {
            part2 = t + 1;
        }
        if (part1 && part2) {
            break;
        }
    }

    return [part1, part2];
}

function feed(x, y, grid, width, height) {
    const level = grid[x][y] += 1;
    let flashes = 0;
    if (level === 10) {
        flashes += 1;
        const xMin = Math.max(x-1, 0);
        const yMin = Math.max(y-1, 0);
        const xMax = Math.min(x+1, width-1);
        const yMax = Math.min(y+1, height-1);
        for (let dx = xMin; dx <= xMax; dx++){
            for (let dy = yMin; dy <= yMax; dy++){
                flashes += feed(dx, dy, grid, width, height);
            }
        }
    }
    return flashes;
}