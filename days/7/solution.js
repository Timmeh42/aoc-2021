module.exports = function (input) {
    const crabs = input.trim().split(',').map(s => parseInt(s));
    const max = Math.max(...crabs);
    let part1 = Infinity;
    let part2 = Infinity;
    for (let x = 0; x < max; x++) {
        let fuelCost1 = 0;
        let fuelCost2 = 0;
        for (let crab of crabs) {
            const mabs = Math.abs(crab - x)
            fuelCost1 += mabs;
            fuelCost2 += (mabs * (mabs + 1))/2;
        }
        if (fuelCost1 < part1) {
            part1 = fuelCost1;
        }
        if (fuelCost2 < part2) {
            part2 = fuelCost2;
        }
    }
    return [part1, part2];
}