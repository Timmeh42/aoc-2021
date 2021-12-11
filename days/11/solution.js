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
        for (let dx = x-1; dx <= x+1; dx++){
            for (let dy = y-1; dy <= y+1; dy++){
                if (dx >= 0 && dy >= 0 && dx < width && dy < height) {
                    flashes += feed(dx, dy, grid, width, height);
                }
            }
        }
    }
    return flashes;
}