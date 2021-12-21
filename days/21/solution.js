module.exports = function (input) {
    let part1, part2;
    const inputs = input.trim().split('\n').map(l => +(l.match(/\d+$/gm)[0]));

    const players = [...inputs];
    const scores = [0, 0];
    let dice = 1;
    let rollCount = 0;
    breaker:
    while (true) {
        let rollScore = 0;

        for (let player = 0; player <= 1; player++) {
            rollScore = 0;
            for (let roll = 0; roll < 3; roll++) {
                rollScore += dice;
                dice = dice % 100 + 1;
                rollCount++;
            }
            players[player] = (players[player] + rollScore - 1) % 10 + 1;
            scores[player] += players[player];
    
            if (scores[player] >= 1000) {
                part1 = scores[1 - player] * rollCount;
                break breaker;
            }
        }
    }

    part2 = Math.max(...simulate(inputs[0], inputs[1], 0, 0));

    return [part1, part2];
}

function simulate (player1, player2, score1, score2, cache = new Map()) {
    const index = ((player1 * 100 + player2) * 100 + score1) * 100 + score2;
    if (cache.has(index)) {
        return cache.get(index);
    }

    let res = [0, 0];
    for (let roll1 = 1; roll1 <= 3; roll1 ++) {
        for (let roll2 = 1; roll2 <= 3; roll2 ++) {
            for (let roll3 = 1; roll3 <= 3; roll3 ++) {
                const newPlayer1 = (player1 + roll1 + roll2 + roll3 - 1) % 10 + 1;
                if (score1 + newPlayer1 >= 21) {
                    res[0] += 1;
                } else {
                    const result = simulate(player2, newPlayer1, score2, score1 + newPlayer1, cache);
                    res[0] += result[1];
                    res[1] += result[0];
                }
            }
        }
    }
    cache.set(index, res);
    return res;
}