module.exports = function (input) {
    const items = input.trim().split('\n\n');
    const nums = items[0].split(',').map(s => parseInt(s));
    const boards = items.slice(1).map(s => ({
        bingo: false,
        squares: s.trim().split(/\s+/).map(s => parseInt(s)),
        bingos: (new Array(10)).fill(0),
    }));

    let wins = 0;
    const winScores = [];
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const boardCount = boards.length;
        for (let board of boards) {
            if (board.bingo) {
                continue;
            }
            const squares = board.squares;
            const squareCount = squares.length;
            for (let s = 0; s < squareCount; s++) {
                if (squares[s] === num) {
                    const bingoX = s % 5;
                    const bingoY = 5 + ~~(s / 5);
                    squares[s] = null;
                    if (++board.bingos[bingoX] === 5 || ++board.bingos[bingoY] === 5) {
                        wins++;
                        board.bingo = true;
                        if (wins === 1) {
                            const total = squares.reduce((sum, s) => sum + s);
                            winScores[0] = total * num;
                        } else if (wins === boardCount) {
                            const total = squares.reduce((sum, s) => sum + s);
                            winScores[1] = total * num;
                            return winScores;
                        }
                    }
                    break;
                }
            }
        }
    }
    return 0;
}