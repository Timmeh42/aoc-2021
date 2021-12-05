module.exports = function (input) {
    const depths = input.split('\n').map(s => parseInt(s));
    let part1 = 0;
    let part2 = 0;
    for (let i = 3; i < depths.length; i++) {
        if (depths[i] > depths[i-1]) {
            part1 += 1;
        }
        if (depths[i] > depths[i-3]) {
            part2 += 1;
        }
    }
    return [part1, part2];
}