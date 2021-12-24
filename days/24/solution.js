module.exports = function (input) {
    let part1, part2;
    const instructions = input.trim().split('\n').map(l => l.split(' '));

    const sections = input.trim().split('inp w').slice(1).map(s => s.split('\n').filter((l, i) => i === 4 || i === 5 || i === 15).map(s => +(s.match(/-?\d+/g)[0])))

    part1 = findBest(sections);
    part2 = findBest(sections, false);

    return [part1, part2];
}

function findBest (sections, bigger = true) {
    const stack = [];
    const digits = [];
    for (let s = 0; s < sections.length; s++) {
        const section = sections[s];
        if (section[0] === 1) {
            const digit = bigger ? 9 : 1;
            digits.push(digit)
            stack.push({
                digit: digits.length - 1,
                value: digit + section[2],
            });
        } else {
            const stored = stack.pop();
            let digit = stored.value + section[1];
            if (bigger && digit > 9) {
                const diff = digit - 9;
                stored.value -= diff;
                digits[stored.digit] -= diff;
                digit = 9;
            } else if (!bigger && digit < 1) {
                const diff = 1 - digit;
                stored.value += diff;
                digits[stored.digit] += diff;
                digit = 1;
            }
            digits.push(digit);
        }
    }
    return digits.reduce((big, n) => big * 10 + n);
}

function runMONAD (instructions, input) {

    let w = 0, x = 0, y = 0, z = 0;
    const registers = {w,x,y,z};

    let inputBuffer = input.split('').map(n => +n);

    for (let instruction of instructions) {
        switch (instruction[0]) {
            case ('inp'): {
                const register = instruction[1];
                registers[register] = inputBuffer.shift();
                break;
            }
            case ('add'): {
                const A = instruction[1];
                const B = instruction[2];
                if (B.charCodeAt(0) > 64) {
                    registers[A] = registers[A] + registers[B];
                } else {
                    registers[A] = registers[A] + parseInt(B);
                }
                break;
            }
            case ('mul'): {
                const A = instruction[1];
                const B = instruction[2];
                if (B.charCodeAt(0) > 64) {
                    registers[A] = registers[A] * registers[B];
                } else {
                    registers[A] = registers[A] * parseInt(B);
                }
                break;
            }
            case ('div'): {
                const A = instruction[1];
                const B = instruction[2];
                if (B.charCodeAt(0) > 64) {
                    registers[A] = ~~(registers[A] / registers[B]);
                } else {
                    registers[A] = ~~(registers[A] / parseInt(B));
                }
                break;
            }
            case ('mod'): {
                const A = instruction[1];
                const B = instruction[2];
                if (B.charCodeAt(0) > 64) {
                    registers[A] = registers[A] % registers[B];
                } else {
                    registers[A] = registers[A] % parseInt(B);
                }
                break;
            }
            case ('eql'): {
                const A = instruction[1];
                const B = instruction[2];
                if (B.charCodeAt(0) > 64) {
                    registers[A] = +(registers[A] == registers[B]);
                } else {
                    registers[A] = +(registers[A] == parseInt(B));
                }
                break;
            }
        }
    }

    return registers.z === 0;
}
