module.exports = function (input) {
    const sections = input.trim().split('\n\n');
    let part1, part2;
    
    const pairResults = new Map();
    const ruleLines = sections[1].split('\n');
    for (let line of ruleLines) {
        const first = line[0];
        const second = line[1];
        const insert = line[6];
        pairResults.set(first + second, {
            first,
            second,
            insert,
            count: 0,
            newCount: 0,
            results: [first+insert, insert+second],
        });
    }
    const polymer = sections[0];
    const counts = new Map();
    for (let c = 0; c < polymer.length; c++) {
        const first = polymer[c];
        if (!counts.has(first)) {
            counts.set(first, 1);
        } else {
            counts.set(first, counts.get(first) + 1);
        }
        if (c === polymer.length - 1) break;
        const second = polymer[c + 1];
        const pair = first + second;
        if (pairResults.has(pair)) {
            pairResults.get(pair).count += 1;
        }
    }

    for (let t = 1; t <= 40; t++) {
        pairResults.forEach(contents => {
            pairResults.get(contents.results[0]).newCount += contents.count;
            pairResults.get(contents.results[1]).newCount += contents.count;
            counts.set(contents.insert, (counts.get(contents.insert) || 0) + contents.count);
        });
        pairResults.forEach(contents => {
            contents.count = contents.newCount;
            contents.newCount = 0;
        });
        if (t === 10) {
            part1 = Math.max(...counts.values()) - Math.min(...counts.values());
        }
    }
    part2 = Math.max(...counts.values()) - Math.min(...counts.values());

    return [part1, part2];
}
