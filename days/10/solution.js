const syntaxScores = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};
const autoScores = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
};
const opens = ['(', '[', '{', '<'];
const pairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
}

module.exports = function (input) {
    const lines = input.trim().split('\n');
    let part1 = 0;
    let p2list = [];
    for (let line of lines) {
        const stack = [];
        let corrupt = false;
        for (let i = 0; i < line.length; i++) {
            if (opens.includes(line[i])) {
                stack.push(line[i]);
            } else {
                const compare = stack.pop();
                if (line[i] !== pairs[compare]) {
                    part1 += syntaxScores[line[i]];
                    corrupt = true;
                    break;
                }
            }
        }
        if (!corrupt) {
            let autocheckerScore = 0;
            while (stack.length) {
                const top = stack.pop();
                autocheckerScore *= 5;
                autocheckerScore += autoScores[pairs[top]];
            }
            p2list.push(autocheckerScore);
        }
    }
    p2list.sort((a, b) => a - b);
    let part2 = p2list[ ~~(p2list.length / 2) ];
    return [part1, part2];
}
