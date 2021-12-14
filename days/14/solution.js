module.exports = function (input) {
    const sections = input.trim().split('\n\n');
    let part1, part2;

    // part 1 starts here

    let counts = new Map();
    let start, end;
    for (let c = 0; c < sections[0].length; c++) {
        const newPolymer = {
            label: sections[0].charCodeAt(c),
            next: null,
        }
        if (!start) {
            start = newPolymer;
        } else {
            end.next = newPolymer;
        }
        end = newPolymer;
        counts.set(newPolymer.label, (counts.get(newPolymer.label) || 0) + 1);
    }
    
    const rules = new Map();
    const ruleLines = sections[1].split('\n');
    for (let line of ruleLines) {
        const first = line.charCodeAt(0);
        const second = line.charCodeAt(1);
        const insert = line.charCodeAt(6);
        if (!rules.has(first)) {
            rules.set(first, new Map());
        }
        rules.get(first).set(second, insert);
    }
    for (let t = 0; t < 10; t++) {
        let pointer = start;
        while (pointer != end) {
            const insert = rules.get(pointer.label)?.get(pointer.next.label);
            if (insert) {
                pointer.next = {
                    label: insert,
                    next: pointer.next,
                }
                pointer = pointer.next;
                counts.set(insert, (counts.get(insert) || 0) + 1);
            }
            pointer = pointer.next;
        }
    }
    let leastCommon = Math.min(...counts.values())
    let mostCommon = Math.max(...counts.values())
    part1 = mostCommon - leastCommon;

    // part 2 starts here

    counts = new Map();
    const pairResults = new Map();
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

    for (let t = 0; t < 40; t++) {
        pairResults.forEach(contents => {
            pairResults.get(contents.results[0]).newCount += contents.count;
            pairResults.get(contents.results[1]).newCount += contents.count;
            counts.set(contents.insert, (counts.get(contents.insert) || 0) + contents.count);
        });
        pairResults.forEach(contents => {
            contents.count = contents.newCount;
            contents.newCount = 0;
        });
    }
    leastCommon = Math.min(...counts.values())
    mostCommon = Math.max(...counts.values())
    part2 = mostCommon - leastCommon;

    return [part1, part2];
}
