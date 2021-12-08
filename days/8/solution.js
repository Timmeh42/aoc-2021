module.exports = function (input) {
    const part1 = input.match(/\|.+/g)
                    .join(' ')
                    .match(/\b(?:\w{2,4}|\w{7})\b/g)
                    .length;

    const lines = input.trim().split('\n');

    let part2 = 0;
    for (let line of lines) {
        const display = line.split(' | ');
        const inputs = display[0].split(' ').map(d => toBits(d));
        const outputs = display[1].split(' ').map(d => toBits(d));
        const digits = new Array(10);
        digits[1] = inputs.find(s => countOnes(s) === 2);
        digits[4] = inputs.find(s => countOnes(s) === 4);
        digits[7] = inputs.find(s => countOnes(s) === 3);
        digits[8] = inputs.find(s => countOnes(s) === 7);
        for (let digit of inputs) {
            if (countOnes(digit) === 5) {
                if (countOnes(digit & digits[7]) === 3) {
                    digits[3] = digit;
                } else if (countOnes(digit & digits[4]) === 3) {
                    digits[5] = digit;
                } else {
                    digits[2] = digit;
                }
            } else if (countOnes(digit) === 6) {
                if (countOnes(digit & digits[7]) === 2) {
                    digits[6] = digit;
                } else if (countOnes(digit & digits[4]) === 4) {
                    digits[9] = digit;
                } else {
                    digits[0] = digit;
                }
            }
        }

        for (let d = 0; d < 4; d++) {
            const digToFind = outputs[d];
            const dig = digits.indexOf(digToFind);
            part2 += (10 ** (3-d)) * dig;
        }
    }

    return [part1, part2];
}

function countOnes(num) {
    let count = 0;
    while (num) {
        count += num & 1;
        num = num >> 1;
    }
    return count;
}

function toBits(str) {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        num += 1 << (str.charCodeAt(i) - 97);
    }
    return num;
}