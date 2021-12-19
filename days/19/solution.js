module.exports = function (input) {
    let part1, part2;
    const scannerClouds = input.trim().split('\n\n').map(s => s.split('\n').slice(1).map(l => l.split(',').map(n => +n)));

    // const distances = scanners[0].map(b => Math.sqrt(b[0]**2 + b[1]**2 + b[2]**2));
    // distances.sort((a, b) => b - a)
    // console.log(distances)
    let allKnowns = []
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
    console.log(scanners)

    return [part1, part2];
}


function distance (a, b) {
    return (a[0] - b[0])**2 + (a[1] - b[1])**2 + (a[2] - b[2])**2;
}