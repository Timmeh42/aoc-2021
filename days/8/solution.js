const digitDefs = [
    0b1110111,
    0b0010010,
    0b1011101,
    0b1011011,
    0b0111010,
    0b1101011,
    0b1101111,
    0b1010010,
    0b1111111,
    0b1111011,
]

const digitComparisons = [[],[],[],[],[],[],[],[],[],[]]

for (let x = 0; x <= 9; x++) {
    for (let y = 0; y <= 9; y++) {
        const xd = digitDefs[x];
        const yd = digitDefs[y];
        let same = xd & yd;
        let plus = xd & ~same;
        let minus = yd & ~same;
        digitComparisons[x][y] = {
            same: binDigits(same),
            plus: binDigits(plus),
            minus: binDigits(minus)
        };
    }
}

module.exports = function (input) {
    const lines = input.trim().split('\n');
    const ends = lines.map(l => l.split('|')[1]).join(' ');
    const c1 = ends.match(/\b\w{2}\b/g).length;
    const c4 = ends.match(/\b\w{4}\b/g).length;
    const c7 = ends.match(/\b\w{3}\b/g).length;
    const c8 = ends.match(/\b\w{7}\b/g).length;
    const part1 = c1 + c4 + c7 + c8;

    const displays = lines.map(l => l.split(' | ').map(s => s.split(' ')));

    let part2 = 0;
    for (let display of displays) {
        const knownDigits = new Array(10);
        const cache = new Map();
        let loops = 0;
        while (display[0].length) {
            for (let d = 0; d < display[0].length; d++) {

                const identity = identify(display[0][d], knownDigits, cache);
                if (identity != null) {
                    display[0].splice(d, 1);
                    loops = 0;
                }
            }
            loops ++;
            if (loops > 3) {
                break;
            }
        }
        let numba = 0;
        for (let d = 0; d < 4; d++) {
            numba += (10 ** d) * identify(display[1][3-d], knownDigits, cache);
        }
        part2 += numba;
    }


    return [part1, part2];
}

function identify(str, knownDigits, cache) {
    const binRep = str.split('').map(s => s.charCodeAt(0) - 97).reduce((sum, p) => sum + 2 ** p, 0)
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

        let possibleSets = [];
        for (let d = 0; d <= 9; d++) {
            if (!knownDigits[d]) continue;
            const possibles = new Set();
            for (let c = 0; c <= 9; c++) {
                // if we know what c is, then skip it, because it would hav ebeen caught earlier
                if (knownDigits[c] || c === 1 || c === 4 || c === 7 || c === 8) continue
                
                const comparison = digitComparisons[d][c];
                
                const same = binDigits(binRep & knownDigits[d]);   //pieces the same from a known digit to our unknown
                const minus = binDigits(binRep & ~(binRep & knownDigits[d]));        //pieces removed
                const plus = binDigits(knownDigits[d] & ~(binRep & knownDigits[d]));   //pieces added

                if (comparison.same === same && comparison.plus === plus && comparison.minus === minus) {
                    possibles.add(c)
                }
            }
            possibleSets.push(possibles);
        }
        if (possibleSets.length) {
            const possibles = possibleSets.reduce((inter, s) => intersection(inter, s))
            if (possibles.size === 1) {
                const answer = possibles.values().next().value;
                cache.set(binRep, answer);
                knownDigits[answer] = binRep;
                return answer
            }
        }
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

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}
