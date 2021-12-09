module.exports = function (input) {
    const lines = input.trim().split('\n');
    const width = lines[0].length;
    const height = lines.length;
    const map = input.replace(/\n/g, '');
    let part1 = 0;
    const lowPoints = [];
    const basins = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let low = true;
            if (y != 0) {
                low = low && lines[y][x] < lines[y-1][x];
            }
            if (y != height-1) {
                low = low && lines[y][x] < lines[y+1][x];
            }
            if (x != 0) {
                low = low && lines[y][x] < lines[y][x-1];
            }
            if (x != width-1) {
                low = low && lines[y][x] < lines[y][x+1];
            }
            if (low) {
                lowPoints.push([x, y]);
                basins.push(flood(lines, x, y, width, height));
                part1 += +lines[y][x] + 1;
            }
        }
    }
    part2 = basins.sort((a, b) => b-a)
                .slice(0,3)
                .reduce((mul, b) => mul * b)
                ;

    return [part1, part2];
}

function flood (map, x, y, width, height) {
    const queue = [[x,y]];
    const seen = new Set();
    let area = -1;
    let nx, ny;
    while (queue.length) {
        area += 1;
        const point = queue.pop();
        nx = point[0]-1;
        ny = point[1];
        if (nx >= 0 && !seen.has(`${nx},${ny}`) && map[ny][nx] != '9') {
            queue.push([nx, ny]);
            seen.add(`${nx},${ny}`);
        }
        nx = point[0]+1;
        ny = point[1];
        if (nx < width && !seen.has(`${nx},${ny}`) && map[ny][nx] != '9') {
            queue.push([nx, ny]);
            seen.add(`${nx},${ny}`);
        }
        nx = point[0];
        ny = point[1]-1;
        if (ny >= 0 && !seen.has(`${nx},${ny}`) && map[ny][nx] != '9') {
            queue.push([nx, ny]);
            seen.add(`${nx},${ny}`);
        }
        nx = point[0];
        ny = point[1]+1;
        if (ny < height && !seen.has(`${nx},${ny}`) && map[ny][nx] != '9') {
            queue.push([nx, ny]);
            seen.add(`${nx},${ny}`);
        }
    }
    return area;
}

