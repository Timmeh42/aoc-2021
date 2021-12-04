function scoreBoard(board: string): number {
    const nums = board.match(/\d+/g) || [];
    return nums.map(n => parseInt(n)).reduce((sum, num) => sum + num, 0);
}

module.exports = function (input: string) {
    const items = input.trim().split('\n\n');
    const nums = (items.shift() as string).split(',');
    const boards = items;

    const horizontal = /x *x *x *x *x/g;
    const vertical = /(x(\s+\w+\s*){4}){4}x/g;
    const criss = /(x(\s+\w+\s*){5}){4}x/g;
    const cross = /(x(\s+\w+\s*){3}){4}x/g;
    const winnables = [
        horizontal, 
        vertical,
    ]

    for (let num of nums) {
        const numRegex = new RegExp(`\\b${num}\\b`, 'g');
        for (let b = 0; b < boards.length; b++) {
            const newBoard = boards[b].replace(numRegex, 'x')
            for (let winnable of winnables) {
                if (newBoard.match(winnable)) {
                    const score = scoreBoard(newBoard);
                    return score * parseInt(num);
                }
            }
            boards[b] = newBoard;
        }
    }
    return 0;
}