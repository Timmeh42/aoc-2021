module.exports = function (input) {
    let part1, part2;
    let inputs = input.trim().split('\n').map(l => [l[1] === 'n', l.match(/-?\d+/g).map(s => +s)]);
    inputs = inputs.map(l => ({
        on: l[0],
        x1: l[1][0],
        x2: l[1][1],
        y1: l[1][2],
        y2: l[1][3],
        z1: l[1][4],
        z2: l[1][5],
    }));

    const reactor = new Set();
    for (let cuboid of inputs) {
        if (
            cuboid.x1 <= 50 && cuboid.x2 >= -50 &&
            cuboid.y1 <= 50 && cuboid.y2 >= -50 &&
            cuboid.z1 <= 50 && cuboid.z2 >= -50
        ) {
            for (let x = cuboid.x1; x <= cuboid.x2; x++) {
                for (let y = cuboid.y1; y <= cuboid.y2; y++) {
                    for (let z = cuboid.z1; z <= cuboid.z2; z++) {
                        const index = `${x},${y},${z}`;
                        if (cuboid.on) {
                            reactor.add(index);
                        } else {
                            reactor.delete(index);
                        }
                    }
                }
            }
        }
    }
    part1 = reactor.size;

    let cuboids = [];
    let newCuboids = [];
    let expected = 0;
    for (let cuboid of inputs) {
        newCuboids = [];
        for (let existing of cuboids) {
            if (
                cuboid.x1 <= existing.x2 && cuboid.x2 >= existing.x1 &&
                cuboid.y1 <= existing.y2 && cuboid.y2 >= existing.y1 &&
                cuboid.z1 <= existing.z2 && cuboid.z2 >= existing.z1
            ) {
                const splitResult = splitCuboid(existing, cuboid);
                expected += splitResult.length - 1;
                newCuboids.push(...splitResult);
            } else {
                newCuboids.push(existing);
            }
        }
        if (cuboid.on) {
            newCuboids.push(cuboid);
            expected += 1;
        }
        cuboids = newCuboids;
    }

    let coverage = 0;
    for (let cuboid of cuboids) {
        const delta = (cuboid.x2 - cuboid.x1 + 1) * (cuboid.y2 - cuboid.y1 + 1) * (cuboid.z2 - cuboid.z1 + 1);
        coverage += delta;
    }
    part2 = coverage;

    return [part1, part2];
}

function splitCuboid (existing, secting) {
    newBoids = [];
    if (secting.x1 <= existing.x2 && secting.x1 > existing.x1) {
        newBoids.push({...existing, x2: secting.x1 - 1});
        existing = {...existing, x1: secting.x1};
    }
    if (secting.x2 < existing.x2 && secting.x2 >= existing.x1) {
        newBoids.push({...existing, x1: secting.x2 + 1});
        existing = {...existing, x2: secting.x2};
    }

    if (secting.y1 <= existing.y2 && secting.y1 > existing.y1) {
        newBoids.push({...existing, y2: secting.y1 - 1});
        existing = {...existing, y1: secting.y1};
    }
    if (secting.y2 < existing.y2 && secting.y2 >= existing.y1) {
        newBoids.push({...existing, y1: secting.y2 + 1});
        existing = {...existing, y2: secting.y2};
    }

    if (secting.z1 <= existing.z2 && secting.z1 > existing.z1) {
        newBoids.push({...existing, z2: secting.z1 - 1});
        existing = {...existing, z1: secting.z1};
    }
    if (secting.z2 < existing.z2 && secting.z2 >= existing.z1) {
        newBoids.push({...existing, z1: secting.z2 + 1});
        existing = {...existing, z2: secting.z2};
    }
    return newBoids;
}
