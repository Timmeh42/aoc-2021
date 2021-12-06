module.exports = function (input) {
    const fishList = eval('[' + input + ']');
    const groups = (new Array(9)).fill(0);
    for (let i = 0; i < fishList.length; i++) {
        groups[fishList[i]] += 1;
    }
    for (let day = 0; day < 80; day++) {
        groups[(day+7) % 9] += groups[day % 9]
    }
    const part1 = groups.reduce((sum, g) => sum + g);
    
    for (let day = 80; day < 256; day++) {
        groups[(day+7) % 9] += groups[day % 9]
    }
    const part2 = groups.reduce((sum, g) => sum + g);

    return [part1, part2];
}