module.exports = function (input) {
    let part1, part2;
    const [x1, x2, y1, y2] = input.match(/-?\d+/g).map(s => +s);

    part1 = (y1 + 1) * y1 / 2;

    let velocities = new Set();
    for (let vx = 0; vx <= x2; vx++) {

        if ((vx + 1) * vx / 2 < x1) {
            continue;
        }

        for (let steps = 0, x = 0; steps <= vx && x <= x2; steps++) {
            if (x >= x1 && x <= x2) {
                for (let vy = y1; vy <= -y1; vy++) {
                    for (let step = 0, y = 0; steps === vx ? y >= y1 : step < steps; step++) {
                        y += vy - step;
                        if (step >= steps-1 && y >= y1 && y <= y2) {
                            velocities.add(vx + ',' + vy);
                            if (step > steps) break;
                        }
                    }
                }
            }
            x += vx - steps;
        }

    }
    part2 = velocities.size;
    return [part1, part2];
}
