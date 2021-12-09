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
    let index;
    while (queue.length) {
        area += 1;
        const [px, py] = queue.pop();
        index = px + py * width - 1;
        if (px - 1 >= 0 && !seen.has(index) && map[index] != 9) {
            queue.push([px - 1, py]);
            seen.add(index);
        }
        index = px + py * width + 1;
        if (px + 1 < width && !seen.has(index) && map[index] != 9) {
            queue.push([px + 1, py]);
            seen.add(index);
        }
        index = px + (py - 1) * width;
        if (py - 1 >= 0 && !seen.has(index) && map[index] != 9) {
            queue.push([px, py - 1]);
            seen.add(index);
        }
        index = px + (py + 1) * width;
        if (py + 1 < height && !seen.has(index) && map[index] != 9) {
            queue.push([px, py + 1]);
            seen.add(index);
        }
    }
    return area;
}

