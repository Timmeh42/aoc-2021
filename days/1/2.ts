module.exports = function (input: string) {
    const depths: number[] = input.split('\n').map(s => parseInt(s));
    let increases = 0;
    for (let i = 3; i < depths.length; i++) {
        if (depths[i] > depths[i-3]) {
            increases += 1;
        }
    }
    return increases;
}