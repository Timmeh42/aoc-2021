module.exports = function (input) {
    let part1, part2;
    const instructions = input.trim().split('\n').map(l => l.split(' '));

    console.log(runMONAD(instructions, '96299896449997'))
    console.log(runMONAD(instructions, '31162141116841'))
    part1 = '96299896449997';
    part2 = '31162141116841';

    return [part1, part2];
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
