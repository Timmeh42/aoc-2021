module.exports = function (input) {
    let part1, part2;
    const [x1, x2, y1, y2] = input.match(/-?\d+/g).map(s => +s);

    part1 = (y1 + 1) * y1 / 2;

    part2 = 0;

    let vels = new Set();

    let ySteps = new Map();
    let yStepsMax = -Infinity;
    for (let vy = -y1; vy >= y1; vy--) {
        for (let steps = 0, y = 0; y >= y1; y += vy - steps, steps++) {
            if (y >= y1 && y <= y2) {
                yStepsMax = Math.max(yStepsMax, steps);
                const vys = ySteps.get(steps);
                if (vys === undefined) {
                    ySteps.set(steps, [vy]);
                } else {
                    vys.push(vy);
                }
            }
        }
    }

    for (let vx = 0; vx <= x2; vx++) {

        if ((vx + 1) * vx / 2 < x1) {
            continue;
        }

        for (let steps = 0, x = 0; x <= x2 && steps <= yStepsMax; steps++) {
            if (x >= x1 && x <= x2) {
                const vys = ySteps.get(steps);
                if (vys !== undefined) {
                    for (let i = 0; i < vys.length; i++) {
                        vels.add(vx + vys[i] * x2);
                    }
                }
            }
            if (vx > steps) {
                x += vx - steps;
            }
        }
    }
    part2 = vels.size;
    return [part1, part2];
}
