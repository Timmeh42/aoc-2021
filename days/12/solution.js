module.exports = function (input) {
    const lines = input.trim().split('\n').map(l => l.split('-'));
    let part1, part2;

    const map = new Map();
    for (let line of lines) {
        const node1 = map.get(line[0]) || {
            label: line[0],
            big: line[0] === line[0].toUpperCase(),
            links: [],
        };
        const node2 = map.get(line[1]) || {
            label: line[1],
            big: line[1] === line[1].toUpperCase(),
            links: [],
        };
        map.set(line[0], node1);
        map.set(line[1], node2);
        node1.links.push(node2);
        node2.links.push(node1);
    }

    part1 = explore(map.get('start'), map, true);
    part2 = explore(map.get('start'), map, false);

    return [part1, part2];
}

function explore (node, map, seenSmall, seen = []) {
    let paths = 0;
    if (node.label === 'end') {
        return 1;
    }
    if (!node.big) {
        seen.push(node);
    }
    for (linkedNode of node.links) {
        let newSeenSmall = seenSmall;
        if (seen.includes(linkedNode)) {
            if (newSeenSmall || linkedNode.label === 'start') {
                continue;
            } else {
                newSeenSmall = true;
            }
        }
        paths += explore(linkedNode, map, newSeenSmall, [...seen]);
    }
    return paths;
}
