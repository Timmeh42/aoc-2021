module.exports = function (input) {
    const part1 = input.match(/\|.+/g)
                    .join(' ')
                    .match(/\b(?:\w{2,4}|\w{7})\b/g)
                    .length;

    const lines = input.trim().split('\n');
    const displays = lines.map(l => l.split(' | ').map(s => s.split(' ')));

    let part2 = 0;
    for (let display of displays) {
        const digits = [];
        digits[1] = display[0].find(s => s.length === 2);
        digits[4] = display[0].find(s => s.length === 4);
        digits[7] = display[0].find(s => s.length === 3);
        digits[8] = display[0].find(s => s.length === 7);
        for (let digit of display[0]) {
            if (digit.length === 5) {
                if (overlap(digit, digits[7]) === 3) {
                    digits[3] = digit;
                } else if (overlap(digit, digits[4]) === 3) {
                    digits[5] = digit;
                } else {
                    digits[2] = digit;
                }
            } else if (digit.length === 6) {
                if (overlap(digit, digits[7]) === 2) {
                    digits[6] = digit;
                } else if (overlap(digit, digits[4]) === 4) {
                    digits[9] = digit;
                } else {
                    digits[0] = digit;
                }
            }
        }

        for (let d = 0; d < 4; d++) {
            const digToFind = display[1][d];
            const dig = digits.findIndex(di => (overlap(di, digToFind) === di.length) && (di.length === digToFind.length));
            part2 += (10 ** (3-d)) * dig;
        }
    }

    return [part1, part2];
}

function overlap(a, b) {
    let area = 0;
    for (let i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) >= 0) {
            area++;
        }
    }
    return area;
}