module.exports = function (input) {
    const lines = input.trim().split('\n');
    const width = lines[0].length;
    const height = lines.length;
    const map = input.replace(/\n/g, '').split('').map(s => +s);
    let part1 = 0;
    const basins = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const level = map[x + y * width];
            if (level === 9) {
                continue
            }
            if (y != 0 && level > map[x + (y - 1) * width]) {
                continue;
            }
            if (y != height-1 && level > map[x + (y + 1) * width]) {
                continue;
            }
            if (x != 0 && level > map[x-1 + y * width]) {
                continue;
            }
            if (x != width-1 && level > map[x + 1 + y * width]) {
                continue;
            }
            basins.push(flood(map, x, y, width, height));
            part1 += level + 1;
        }
    }
    part2 = basins.sort((a, b) => b-a)
                .slice(0,3)
                .reduce((mul, b) => mul * b, 1)
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
        const px = point[0],
              py = point[1];
        nx = px-1;
        ny = py;
        if (nx >= 0 && !seen.has(nx + ny * width) && map[nx + ny * width] != 9) {
            queue.push([nx, ny]);
            seen.add(nx + ny * width);
        }
        nx = px+1;
        ny = py;
        if (nx < width && !seen.has(nx + ny * width) && map[nx + ny * width] != 9) {
            queue.push([nx, ny]);
            seen.add(nx + ny * width);
        }
        nx = px;
        ny = py-1;
        if (ny >= 0 && !seen.has(nx + ny * width) && map[nx + ny * width] != 9) {
            queue.push([nx, ny]);
            seen.add(nx + ny * width);
        }
        nx = px;
        ny = py+1;
        if (ny < height && !seen.has(nx + ny * width) && map[nx + ny * width] != 9) {
            queue.push([nx, ny]);
            seen.add(nx + ny * width);
        }
    }
    return area;
}

