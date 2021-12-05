module.exports = function (input) {
    const items = input.trim().split('\n\n');
    const nums = items.shift().split(',').map(s => parseInt(s));
    const boards = items.map(s => ({
        squares: s.trim().split(/\s+/).map(s => parseInt(s)),
        bingos: (new Array(25)).fill(0),
    }));

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const boardCount = boards.length;
        for (let b = 0; b < boardCount; b++) {
            const board = boards[b];
            const squares = board.squares;
            const bingos = board.bingos;
            const squareCount = squares.length;
            for (let s = 0; s < squareCount; s++) {
                const bingoX = s % 5;
                const bingoY = 5 + ~~(s / 5);
                if (squares[s] === num) {
                    squares[s] = null;
                    const bingo = ++bingos[bingoX] === 5 || ++bingos[bingoY] === 5;
                    if (bingo) {
                        const total = squares.reduce((sum, s) => sum + s);
                        const score = total * num;
                        return score;
                    }
                    break;
                }
            }
        }
    }
    return 0;
}