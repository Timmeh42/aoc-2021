module.exports = function (input) {
    let part1, part2;
    const numbers1 = input.trim().match(/\w/g).map(n => ({A: 0, B: 1, C: 2, D: 3})[n]);
    const numbers2 = [...numbers1];
    numbers2.splice(4, 0, ...[3,2,1,0,3,1,0,2]);
    const burrows1 = flatToXY(numbers1, 4, 2);
    const burrows2 = flatToXY(numbers2, 4, 4);

    part1 = simulate({
        hallway: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        burrows: burrows1,
    }, 2);
    
    part2 = simulate({
        hallway: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        burrows: burrows2,
    }, 4);
    return [part1, part2];
}

function flatToXY (array, width, height) {
    const transposed = [];
    for (let x = 0; x < width; x++) {
        transposed[x] = [];
        for (let y = 0; y < height; y++) {
            transposed[x][height - 1 - y] = array[x + (y * width)];
        }
    }
    return transposed;
}

function simulate (state, depth, cache = new Map()) {

    const cacheIndex = JSON.stringify(state);
    if (cache.has(cacheIndex)) {
        return cache.get(cacheIndex);
    }

    if (state.burrows.every((b, bi) => b.length === depth && b.every(o => o === bi))) {
        return 0;
    }

    let possibleFutures = [];
    // hallway -> burrows
    for (let h = 0; h < 7; h++) {
        const occupant = state.hallway[h];
        if (occupant !== undefined) {
            const burrowX = occupant + 2;
            const burrow = state.burrows[occupant];
            if (burrow.length < depth && burrow.every(o => o === occupant)) {
                let distance = depth - burrow.length + 1;
                if (h !== burrowX && h !== burrowX - 1) {
                    distance -= 1;
                    let hallwaySlice = [];
                    if (h < burrowX) {
                        distance += (burrowX - h) * 2 - (h === 0 ? 2 : 1);
                        hallwaySlice = state.hallway.slice(h+1, burrowX);
                    } else {
                        distance += (h - burrowX) * 2 + (h === 6 ? 0 : 1);
                        hallwaySlice = state.hallway.slice(burrowX, h);
                    }
                    if (hallwaySlice.some(n => n !== undefined)) {
                        continue;
                    }
                }
                const nextState = {
                    hallway: [...state.hallway],
                    burrows: [[...state.burrows[0]], [...state.burrows[1]], [...state.burrows[2]], [...state.burrows[3]]],
                };
                nextState.hallway[h] = undefined;
                nextState.burrows[occupant].push(occupant);
                const result = simulate(nextState, depth, cache);
                if (result !== null) {
                    const score = result + distance * 10 ** occupant;
                    possibleFutures.push(score);
                }
            }
        }
    }

    // burrows -> hallway
    for (let b = 0; b < state.burrows.length; b++) {
        const burrow = state.burrows[b];
        if (burrow.length > 0 && burrow.some(o => o !== b)) {
            const occupant = burrow[burrow.length - 1];
            for (let h = 0; h < 7; h++) {
                if (state.hallway[h] === undefined) {
                    const burrowX = b + 2;
                    let distance = depth - burrow.length + 2;
                    if (h !== burrowX && h !== burrowX - 1) {
                        distance -= 1;
                        let hallwaySlice = [];
                        if (h < burrowX) {
                            distance += (burrowX - h) * 2 - (h === 0 ? 2 : 1);
                            hallwaySlice = state.hallway.slice(h, burrowX);
                        } else {
                            distance += (h - burrowX) * 2 + (h === 6 ? 0 : 1);
                            hallwaySlice = state.hallway.slice(burrowX, h+1);
                        }
                        if (hallwaySlice.some(n => n !== undefined)) {
                            continue;
                        }
                    }
                    const nextState = {
                        hallway: [...state.hallway],
                        burrows: [[...state.burrows[0]], [...state.burrows[1]], [...state.burrows[2]], [...state.burrows[3]]],
                    }
                    nextState.hallway[h] = occupant;
                    nextState.burrows[b].pop();
                    const result = simulate(nextState, depth, cache);
                    if (result !== null) {
                        const score = result + distance * 10 ** occupant;
                        possibleFutures.push(score);
                    }
                }
            }
        }
    }

    possibleFutures = possibleFutures.filter(f => f !== null);
    if (possibleFutures.length === 0) {
        return null;
    }
    const minimumFuture = possibleFutures.reduce((minF, f) => f < minF ? f : minF);

    cache.set(cacheIndex, minimumFuture);
    return minimumFuture;
}
