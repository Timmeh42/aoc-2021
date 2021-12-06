module.exports = function (input) {
    const fishList = input.trim().split(',').map(s => parseInt(s));
    const groups = (new Array(9)).fill(0);
    for (let i = 0; i < fishList.length; i++) {
        groups[fishList[i]] += 1;
    }
    let part1 = 0;
    let part2 = 0;
    for (let day = 0; day < 256; day++) {
        let carry = 0;
        for (let g = 8; g >= 0; g--) {
            const newCarry = groups[g];
            groups[g] = carry;
            carry = newCarry;
            if (g === 0) {
                groups[8] = carry;
                groups[6] += carry;
            }
        }
        if (day === 79) {
            part1 = groups.reduce((sum, g) => sum + g);
        }
    }
    part2 = groups.reduce((sum, g) => sum + g);

    return [part1, part2];
}