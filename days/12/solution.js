module.exports = function (input) {
    const lines = input.trim().split('\n').map(l => l.split('-'));
    let part1, part2;

    const map = new Map();
    for (let line of lines) {
        if (!map.has(line[0])) {
            map.set(line[0], {
                big: line[0] === line[0].toUpperCase(),
                links: [],
            });
        }
        if (!map.has(line[1])) {
            map.set(line[1], {
                big: line[1] === line[1].toUpperCase(),
                links: [],
            });
        }
        map.get(line[0]).links.push(line[1]);
        map.get(line[1]).links.push(line[0]);
    }

    part1 = explore('start', map, true).length;
    part2 = explore('start', map, false).length;

    return [part1, part2];
}

function explore (node, map, seenSmall, seen = new Set()) {
    const paths = [];
    if (node === 'end') {
        return ['end'];
    }
    const currNode = map.get(node);
    if (!currNode.big) {
        seen.add(node);
    }
    for (linkedNode of currNode.links) {
        let newSeenSmall = seenSmall;
        if (seen.has(linkedNode)) {
            if (newSeenSmall || linkedNode === 'start') {
                continue;
            } else {
                newSeenSmall = true;
            }
        }
        let pathsAhead = explore(linkedNode, map, newSeenSmall, new Set(seen));
        if (pathsAhead.length > 0) {
            pathsAhead = pathsAhead.map(p => node + ',' + p);
            paths.push(...pathsAhead);
        }
    }
    return paths;
}
