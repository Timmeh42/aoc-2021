const digitComparisons = [
    [6,2,4,4,3,4,5,3,6,5],
    [2,2,1,2,2,1,1,2,2,2],
    [4,1,5,4,2,3,3,2,5,4],
    [4,2,4,5,3,4,4,3,5,5],
    [3,2,2,3,4,3,3,2,4,4],
    [4,1,3,4,3,5,5,2,5,5],
    [5,1,3,4,3,5,6,2,6,5],
    [3,2,2,3,2,2,2,3,3,3],
    [6,2,5,5,4,5,6,3,7,6],
    [5,2,4,5,4,5,5,3,6,6]
]

module.exports = function (input) {
    const lines = input.trim().split('\n');
    // const ends = lines.map(l => l.split('|')[1]).join(' ');
    // const c1 = ends.match(/\b\w{2}\b/g).length;
    // const c4 = ends.match(/\b\w{4}\b/g).length;
    // const c7 = ends.match(/\b\w{3}\b/g).length;
    // const c8 = ends.match(/\b\w{7}\b/g).length;
    // part1 = c1 + c4 + c7 + c8;

    const displays = lines.map(l => l.split(' | ').map(s => s.split(' ')));

    for (let display of displays) {
        const knownDigits = new Array(10);
        const cache = new Map();
        let loops = 0
        while (display[0].length) {
            for (let d = 0; d < display[0].length; d++) {

                const asd = identify(display[0][d], knownDigits, cache);
                if (asd) {
                    display[0].splice(d, 1);
                    loops = 0;
                }
            }
            loops ++;
            if (loops > 3) {
                console.log('bad loop');
                break;
            }
        }
        console.log('final known', knownDigits)
        let numba = 0
        for (let d = 0; d < 4; d++) {
            numba += (10 ** d) * identify(display[1][3-d], knownDigits, cache);
        }
        console.log(numba)
    }



    // return [part1, ];
}

function identify(str, knownDigits, cache) {
    const binRep = str.split('').map(s => s.charCodeAt(0) - 97).reduce((sum, p) => sum + 2 ** p, 0)
    console.log('identify', str, binRep);
    console.log('known', ...cache.entries());
    if (cache.has(binRep)) {
        return cache.get(binRep);
    }
    if (str.length === 2) {
        cache.set(binRep, 1);
        knownDigits[1] = binRep;
        return 1;
    } else if (str.length === 3) {
        cache.set(binRep, 7);
        knownDigits[7] = binRep;
        return 7;
    } else if (str.length === 4) {
        cache.set(binRep, 4);
        knownDigits[4] = binRep;
        return 4;
    } else if (str.length === 7) {
        cache.set(binRep, 8);
        knownDigits[8] = binRep;
        return 8;
    } else {

        let possibles = new Set();
        for (let d = 0; d < knownDigits.length; d++) {
            if (!knownDigits[d]) continue;
            // console.log('checking', d);
            for (let c = 0; c < digitComparisons[d].length; c++) {
                if (knownDigits[c] || c === 1 || c === 4 || c === 7 || c === 8) continue
                // console.log('checking', d, 'with', c);
                const comparison = digitComparisons[d][c];
                // console.log(comparison, binDigits(binRep && knownDigits[d]));
                if (str.length === digitComparisons[c][c] && comparison === binDigits(binRep && knownDigits[d])) {
                    possibles.add(c);
                }
            }
        }
        console.log(possibles)
        if (possibles.size === 1) {
            const answer = possibles.values().next().value;
            cache.set(binRep, answer);
            knownDigits[answer] = binRep;
            return answer
        }
        console.log('skipping...')
        return null;
    }
}

function binDigits (num) {
    let digs = 0;
    while (num > 0) {
        if (num % 2 === 1) {
            digs++;
        }
        num = Math.floor(num / 2);
    }
    return digs;
}

/*
1 2
2 5
3 5
4 4
5 5
6 6
7 4
8 7
9 6
0 6


6 6
9 6
0 6

2 5
3 5
5 5



  0 1 2 3 4 5 6 7 8 9
0 6 2 4 4 3 4 5 3 6 5 
1 2 2 1 2 2 1 1 2 2 2
2 4 1 5 4 2 3 3 2 5 4
3 4 2 4 5 3 4 4 3 5 5
4 3 2 2 3 4 3 3 2 4 4
5 4 1 3 4 3 5 5 2 5 5
6 5 1 3 4 3 5 6 2 6 5
7 3 2 2 3 2 2 2 3 3 3
8 6 2 5 5 4 5 6 3 7 6
9 5 2 4 5 4 5 5 3 6 6




*/