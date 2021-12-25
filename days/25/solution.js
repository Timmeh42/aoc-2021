module.exports = function (input) {
    let part1;

    let grid = input.trim().split('\n').map(l => l.split('').map(s => ({'.': 0, '>': 1, 'v': 2})[s]));
    let stuck = false;
    let steps = 0;
    while (stuck === false) {
        [grid, stuck] = simulate(grid);
        steps++;
    }
    part1 = steps;

    return [part1];
}

function simulate (grid) {
    let stuck = true;
    const newGrid = [];
    const newGrid2 = [];
    const width = grid[0].length;
    const height = grid.length;
    for (let y = 0; y < height; y++) {
        newGrid.push([...grid[y]]);
        newGrid2.push([...grid[y]]);
        for (let x = 0; x < width; x++) {
            if (grid[y][x] === 1 && grid[y][(x + 1) % width] === 0) {
                stuck = false;
                newGrid[y][x] = 0;
                newGrid[y][(x + 1) % width] = 1;
                newGrid2[y][x] = 0;
                newGrid2[y][(x + 1) % width] = 1;
            }
        }
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (newGrid[y][x] === 2 && newGrid[(y + 1) % height][x] === 0) {
                stuck = false;
                newGrid2[y][x] = 0;
                newGrid2[(y + 1) % height][x] = 2;
            }
        }
    }
    return [newGrid2, stuck];
}