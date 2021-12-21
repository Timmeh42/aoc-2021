module.exports = function (input) {
    let part1, part2;
    const lines = input.split('\n');

    let snailNum = parentify(eval(lines[0]));
    let res = 'BREAK';
    while (res === 'BREAK') {
        res = exploreOrSplit(snailNum);
    }

    for (let line of lines.slice(1)) {
        snailNum = parentify([snailNum, eval(line)]);
        let res = 'BREAK';
        while (res === 'BREAK') {
            res = exploreOrSplit(snailNum);
        }
    }

    part1 = magnitude(snailNum);

    let magnitudes = [];
    for (let line1 of lines) {
        for (let line2 of lines) {
            if (line1 == line2) {
                break;
            }
            let snailNum = parentify([eval(line1), eval(line2)]);
            let res = 'BREAK';
            while (res === 'BREAK') {
                res = exploreOrSplit(snailNum);
            }
            magnitudes.push(magnitude(res));
        }
    }
    magnitudes.sort((a, b) => b - a);
    part2 = magnitudes[0];

    return [part1, part2];
}

function exploreOrSplit (snailNum, route = []) {
    route.push(0);
    let res = explode(snailNum[0], route);
    if (res !== snailNum[0]) {
        if (res === 'BREAK') return 'BREAK';
        snailNum[0] = res;
        if (Array.isArray(res)) {
            res.parent = snailNum;
        }
        return 'BREAK';
    }
    route.push(1);
    res = explode(snailNum[1], route);
    if (res !== snailNum[1]) {
        if (res === 'BREAK') return 'BREAK';
        snailNum[1] = res;
        if (Array.isArray(res)) {
            res.parent = snailNum;
        }
        return 'BREAK';
    }
    route.push(0);
    res = split(snailNum[0], route);
    if (res !== snailNum[0]) {
        if (res === 'BREAK') return 'BREAK';
        snailNum[0] = res;
        if (Array.isArray(res)) {
            res.parent = snailNum;
        }
        return 'BREAK';
    }
    route.push(1);
    res = split(snailNum[1], route);
    if (res !== snailNum[1]) {
        if (res === 'BREAK') return 'BREAK';
        snailNum[1] = res;
        if (Array.isArray(res)) {
            res.parent = snailNum;
        }
        return 'BREAK';
    }
    return snailNum;
}

function explode (snailNum, route = []) {
    if (Array.isArray(snailNum)) {
        if (route.length >= 4) {
            addLeft(snailNum[0], snailNum, [...route]);
            addRight(snailNum[1], snailNum, [...route]);
            return 0;
        }
        route.push(0);
        let res = explode(snailNum[0], route);
        if (res !== snailNum[0]) {
            if (res === 'BREAK') return 'BREAK';
            snailNum[0] = res;
            if (Array.isArray(res)) {
                res.parent = snailNum;
            }
            return 'BREAK';
        }
        route.push(1);
        res = explode(snailNum[1], route);
        if (res !== snailNum[1]) {
            if (res === 'BREAK') return 'BREAK';
            snailNum[1] = res;
            if (Array.isArray(res)) {
                res.parent = snailNum;
            }
            return 'BREAK';
        }
    }
    route.pop();
    return snailNum;
}

function split (snailNum, route = []) {
    if (Array.isArray(snailNum)) {
        route.push(0);
        let res = split(snailNum[0], route);
        if (res !== snailNum[0]) {
            if (res === 'BREAK') return 'BREAK';
            snailNum[0] = res;
            if (Array.isArray(res)) {
                res.parent = snailNum;
            }
            return 'BREAK';
        }
        route.push(1);
        res = split(snailNum[1], route);
        if (res !== snailNum[1]) {
            if (res === 'BREAK') return 'BREAK';
            snailNum[1] = res;
            if (Array.isArray(res)) {
                res.parent = snailNum;
            }
            return 'BREAK';
        }
    } else {
        if (snailNum >= 10) {
            return [Math.floor(snailNum/2), Math.ceil(snailNum/2)];
        }
    }
    route.pop();
    return snailNum;
}

function addLeft (add, snailNum, route) {
    let branch;
    while (branch !== 1) {
        branch = route.pop();
        snailNum = snailNum.parent;
        if (snailNum === null) {
            return;
        }
    }
    branch = 0;
    while (true) {
        if (Array.isArray(snailNum[branch])) {
            snailNum = snailNum[branch];
            branch = 1;
        } else {
            snailNum[branch] = snailNum[branch] + add;
            return;
        }
    }
}

function addRight (add, snailNum, route) {
    let branch;
    while (branch !== 0) {
        branch = route.pop();
        snailNum = snailNum.parent;
        if (snailNum === null) {
            return;
        }
    }
    branch = 1;
    while (true) {
        if (Array.isArray(snailNum[branch])) {
            snailNum = snailNum[branch];
            branch = 0;
        } else {
            snailNum[branch] = snailNum[branch] + add;
            return;
        }
    }
}

function parentify (snailNum, parent = null) {
    snailNum.parent = parent;
    if (Array.isArray(snailNum[0])) {
        parentify(snailNum[0], snailNum);
    }
    if (Array.isArray(snailNum[1])) {
        parentify(snailNum[1], snailNum);
    }
    return snailNum;
}

function magnitude (snailNum) {
    let result = 0;
    if (Array.isArray(snailNum[0])) {
        result += 3 * magnitude(snailNum[0]);
    } else {
        result += 3 * snailNum[0];
    }
    if (Array.isArray(snailNum[1])) {
        result += 2 * magnitude(snailNum[1]);
    } else {
        result += 2 * snailNum[1];
    }
    return result;
}