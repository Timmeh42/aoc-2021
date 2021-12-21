module.exports = function (input) {
    let part1, part2;
    const scannerClouds = input.trim().split('\n\n').map(s => s.split('\n').slice(1).map(l => l.split(',').map(n => +n)));

    let scanners = [];
    for (let s = 0; s < scannerClouds.length; s++) {
        const scanner = scannerClouds[s];
        const scannerObject = {
            id: s,
            known: new Map(),
        }
        scanners.push(scannerObject);

        let knowables = [];
        
        for (let beacon of scanner) {
            let distances = scanner.map(b => [b, distance(beacon, b)]);
            distances = distances.sort((a, b) => a[1] - b[1]);
            let topN = 2;
            let closestN = distances.slice(1, 1 + topN);
            let furthest = closestN[topN-1][0];
            let score = closestN.reduce((sum, t) => sum + t[1], 0) / topN;

            let boundingCubeSize = Math.max(
                Math.abs(furthest[0] - beacon[0]),
                Math.abs(furthest[1] - beacon[1]),
                Math.abs(furthest[2] - beacon[2]),
            );

            if (Math.abs(beacon[0]) + boundingCubeSize <= 1000 && Math.abs(beacon[1]) + boundingCubeSize <= 1000 && Math.abs(beacon[2]) + boundingCubeSize <= 1000) {
                knowables.push([beacon, score, closestN]);
                if (scannerObject.known.has(score)) {
                    throw ('DUPE SCORE FOUND', score)
                }
                scannerObject.known.set(score, {
                    score,
                    position: beacon,
                    closest: closestN,
                });
            }
        }

    }

    let trueBeacons = new Map();
    for (let beacon of scannerClouds[0]) {
        const index = JSON.stringify(beacon);
        trueBeacons.set(index, beacon);
    }
    let knownCloud = new Map(scanners[0].known);
    const scannerPositions = [
        [0, 0, 0],
    ];

    const knownScanners = [0];
    while (knownScanners.length < scannerClouds.length) {
        for (let scanner of scanners.slice(1)) {
            if (knownScanners.includes(scanner.id)) continue;

            const anchors = [];
            for (let beacon of scanner.known.values()) {
                if (knownCloud.has(beacon.score)) {
                    anchors.push(beacon.score);
                }
            }
            if (anchors.length < 3) {
                continue;
            }

            let chosenRotation;
            for (let rotation = 0; rotation < 24; rotation++) {
                const beaconDistances = [];
                for (let anchor of anchors) {
                    const beaconPos = scanner.known.get(anchor).position;
                    const rotatedPosition = rotate(beaconPos, rotation);
                    beaconDistances.push(distance(rotatedPosition, knownCloud.get(anchor).position))
                }
                const avgDistance = beaconDistances.reduce((sum, d) => sum + d) / beaconDistances.length;
                if (beaconDistances[0] === avgDistance) {
                    chosenRotation = rotation;
                    break;
                }
            }
            
            if (chosenRotation !== undefined) {
                knownScanners.push(scanner.id);
                const refBeacon = scanner.known.get(anchors[0]);
                const refAnchor = knownCloud.get(anchors[0]);
                const refPosition = rotate(refBeacon.position, chosenRotation);
                const scannerOffset = [
                    refAnchor.position[0] - refPosition[0],
                    refAnchor.position[1] - refPosition[1],
                    refAnchor.position[2] - refPosition[2],
                ];
                scannerPositions.push(scannerOffset);
                for (let beacon of scannerClouds[scanner.id]) {
                    let trueBeacon = rotate(beacon, chosenRotation);
                    trueBeacon[0] += scannerOffset[0];
                    trueBeacon[1] += scannerOffset[1];
                    trueBeacon[2] += scannerOffset[2];
                    const index = JSON.stringify(trueBeacon);
                    trueBeacons.set(index, trueBeacon);
                }

                for (let [anchor, beacon] of scanner.known.entries()) {
                    let trueBeacon = rotate(beacon.position, chosenRotation);
                    trueBeacon[0] += scannerOffset[0];
                    trueBeacon[1] += scannerOffset[1];
                    trueBeacon[2] += scannerOffset[2];
                    beacon.position = trueBeacon;
                    knownCloud.set(anchor, beacon);
                }
            }
        }
    }
    part1 = trueBeacons.size;

    let maxDist = 0;
    for (let scanner1 of scannerPositions) {
        for (let scanner2 of scannerPositions) {
            const dist = Math.abs(scanner1[0] - scanner2[0]) + Math.abs(scanner1[1] - scanner2[1]) + Math.abs(scanner1[2] - scanner2[2]);
            if (dist > maxDist) {
                maxDist = dist;
            }
        }
    }
    part2 = maxDist;

    return [part1, part2];
}


function distance (a, b) {
    return (a[0] - b[0])**2 + (a[1] - b[1])**2 + (a[2] - b[2])**2;
}

function rotate (pos, i) {
    const [x, y, z] = pos;
    return [
        [x, y, z],
        [-y, x, z],
        [-x, -y, z],
        [y, -x, z],
    
        [-y, -x, -z],
        [x, -y, -z],
        [y, x, -z],
        [-x, y, -z],
    
        [-z, y, x],
        [-y, -z, x],
        [z, -y, x],
        [y, z, x],
    
        [-y, z, -x],
        [-z, -y, -x],
        [y, -z, -x],
        [z, y, -x],
    
        [x, -z, y],
        [z, x, y],
        [-x, z, y],
        [-z, -x, y],
    
        [z, -x, -y],
        [x, z, -y],
        [-z, x, -y],
        [-x, -z, -y]
    ][i];
}
