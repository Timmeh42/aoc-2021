module.exports = function (input) {
    let part1, part2;
    let inputs = input.trim().split('\n');

    let hallway = new Array(7).fill(undefined);
    let burrows = [[0,1], [3, 2], [2, 1], [0,3]];
    // let hallway = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    // let burrows = [[0, 1], [1, 2], [2, 3], [3, 0]];
    // let hallway = [1, undefined, undefined, undefined, undefined, undefined, undefined];
    // let burrows = [[0, 0], [1], [2,2], [3, 3]];
    // let burrows = [[2,3], [0, 1], [3, 2], [1,0]];

    // let state = {
    //     hallway: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    //     burrows: [[0, 1], [1, 2], [2, 3], [3, 0]],
    // }
    let state = {
        hallway: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        burrows: [[0,1], [3, 2], [2, 1], [0,3]],
    }
    let result = simulate(state);
    console.log(result)
    

    // let result = move(hallway, burrows)
    // console.log(JSON.stringify(result, null, 2))
    // console.log(result[0])
    return [part1, part2];
}

let minCost = Infinity;
const depth = 2;

// takes hallway and burrows state, returns least score needed to finish
function simulate (state) {


    let allGood = true;
    for (let b = 0; b < state.burrows.length; b++) {
        const burrow = state.burrows[b];
        if (burrow.length < depth || burrow.some(o => o !== b)) {
            allGood = false;
        }
    }
    if (allGood) {
        return [0, state];
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
                // do the next step
                const nextState = {
                    hallway: [...state.hallway],
                    burrows: [[...state.burrows[0]], [...state.burrows[1]], [...state.burrows[2]], [...state.burrows[3]]],
                    previousState: state,
                };
                nextState.hallway[h] = undefined;
                nextState.burrows[occupant].push(occupant);
                const result = simulate(nextState);
                if (result !== null) {
                    const score = result[0] + distance * 10 ** occupant;
                    possibleFutures.push([score, nextState]);
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
                    // do the next step
                    const nextState = {
                        hallway: [...state.hallway],
                        burrows: [[...state.burrows[0]], [...state.burrows[1]], [...state.burrows[2]], [...state.burrows[3]]],
                        previousState: state,
                    }
                    nextState.hallway[h] = occupant;
                    nextState.burrows[b].pop();
                    const result = simulate(nextState);
                    if (result !== null) {
                        const score = result[0] + distance * 10 ** occupant;
                        possibleFutures.push([score, nextState]);
                    }
                }
            }
        }
    }

    // narrow down possible futures
    possibleFutures = possibleFutures.filter(f => f !== null);
    if (possibleFutures.length === 0) {
        return null;
    }
    const minimumFuture = possibleFutures.reduce((minF, f) => f[0] < minF[0] ? f : minF);
    // console.log(minimumFuture)
    return minimumFuture;
}

/*

01 2 3 4 56
  2 3 4 5





*/


function move (hallway, burrows, cost = 0, cache = new Map(), route = []) {
    route.push([hallway, burrows, cost]);
    // console.log('--', hallway, burrows)
    const index = JSON.stringify([hallway, burrows])//hallway.join(',') + ';' + burrows.map(b => b.join('.')).join(',');
    if (cache.has(index)) {
        return ( cache.get(index));
    }
    let futures = [];
    let allBurrowsGood = true;
    for (let b = 0; b < burrows.length; b++) {
        if (!burrowGood(burrows[b], b) || burrows[b].length < 2) {
            allBurrowsGood = false;
            break;
        }
    }
    if (allBurrowsGood) {
        // console.log(burrows, cost, moves);
        minCost = Math.min(cost, minCost);
        // console.log(hallway, burrows, cost, '<------------')
        // cache.set(index, [cost, route]);
        // console.log( cost);
        return [cost, route];
    }
    for (let h = 0; h < 7; h ++) {
        if (hallway[h] !== undefined) {
            let piece = hallway[h];
            if (burrowGood(burrows[piece], piece)) {
                // try to move into burrow
                let distance = 2 - burrows[piece].length + 1;
                const newBurrows = [[...burrows[0]], [...burrows[1]], [...burrows[2]], [...burrows[3]]];
                newBurrows[piece].push(piece);
                const newHallway = [...hallway];
                newHallway[h] = undefined;
                if (h - 1 > piece) {
                    // move left
                    if (h === piece + 2) {
                        // MOVE GOOD
                        // console.log(hallway, burrows, 'before');
                        // console.log(newHallway, newBurrows, 'after');
                        let result = move(newHallway, newBurrows, distance * (10 ** piece), cache, [...route]);
                        if (result) {
                            result = [...result];
                            result[0] += distance * (10 ** piece);
                            futures.push(result);
                        }
                    } else {
                        let hm = h - 1;
                        while (hallway[hm] === undefined && hm > 0) {
                            if (hm < 5) distance += 1;
                            distance += 1;
                            if (hm === piece + 2) {
                                // MOVE GOOD
                                // console.log(hallway, burrows, 'before');
                                // console.log(newHallway, newBurrows, 'after');
                                let result = move(newHallway, newBurrows, distance * (10 ** piece), cache, [...route]);
                                if (result) {
                                    result = [...result];
                                    result[0] += distance * (10 ** piece);
                                    futures.push(result);
                                }
                                break;
                            }
                            hm--;
                        }
                    }
                } else {
                    // move right
                    if (h === piece + 1) {
                        // MOVE GOOD
                        // console.log(hallway, burrows, 'before');
                        // console.log(newHallway, newBurrows, 'after');
                        let result = move(newHallway, newBurrows, distance * (10 ** piece), cache, [...route]);
                        if (result) {
                            result = [...result];
                            result[0] += distance * (10 ** piece);
                            futures.push(result);
                        }
                    } else {
                        let hm = h + 1;
                        while (hallway[hm] === undefined && hm < 6) {
                            if (hm > 1) distance += 1;
                            distance += 1;
                            if (hm === piece + 1) {
                                // MOVE GOOD
                                // console.log(hallway, burrows, 'before');
                                // console.log(newHallway, newBurrows, 'after');
                                let result = move(newHallway, newBurrows, distance * (10 ** piece), cache, [...route]);
                                if (result) {
                                    result = [...result];
                                    result[0] += distance * (10 ** piece);
                                    futures.push(result);
                                }
                                break;
                            }
                            hm++;
                        }
                    }
                }
            }
        }
    }
    for (let b = 0; b < burrows.length; b++) {
        if (!burrowGood(burrows[b], b) && burrows[b].length > 0) {
            let piece = burrows[b][burrows[b].length-1];
            for (let h = 0; h < 7; h ++) {
                if (hallway[h] === undefined) {
                    let distance = 2 - burrows[b].length + 1 + 1;
                    const newBurrows = [[...burrows[0]], [...burrows[1]], [...burrows[2]], [...burrows[3]]];
                    newBurrows[b].pop();
                    const newHallway = [...hallway];
                    newHallway[h] = piece;
                    if (h > b + 1) {
                        if (h === b + 2) {
                            // MOVE GOOD
                            // console.log(hallway, burrows, 'before');
                            // console.log(newHallway, newBurrows, 'after');
                            let result = move(newHallway, newBurrows, distance * (10 ** piece), cache, [...route]);
                            if (result) {
                                result = [...result];
                                result[0] += distance * (10 ** piece);
                                futures.push(result);
                            }
                        } else {
                            let bm = b + 2;
                            while (hallway[bm] === undefined) {
                                if (bm === h) {
                                    // MOVE GOOD
                                    // console.log(hallway, burrows, 'before');
                                    // console.log(newHallway, newBurrows, 'after');
                                    let result = move(newHallway, newBurrows, distance * (10 ** piece), cache, [...route]);
                                    if (result) {
                                        result = [...result];
                                        result[0] += distance * (10 ** piece);
                                        futures.push(result);
                                    }
                                    break;
                                }
                                bm++;
                                if (bm <= 5) distance += 1;
                                distance += 1;
                            }
                        }
                    } else {
                        if (h === b + 1) {
                            // MOVE GOOD
                            // console.log(hallway, burrows, 'before');
                            // console.log(newHallway, newBurrows, 'after');
                            let result = move(newHallway, newBurrows, distance * (10 ** piece), cache, [...route]);
                            if (result) {
                                result = [...result];
                                result[0] += distance * (10 ** piece);
                                futures.push(result);
                            }
                        } else {
                            let bm = b + 1;
                            while (hallway[bm] === undefined) {
                                if (bm === h) {
                                    // MOVE GOOD
                                    // console.log(hallway, burrows, 'before');
                                    // console.log(newHallway, newBurrows, 'after');
                                    let result = move(newHallway, newBurrows, distance * (10 ** piece), cache, [...route]);
                                    if (result) {
                                        result = [...result];
                                        result[0] += distance * (10 ** piece);
                                        futures.push(result);
                                    }
                                    break;
                                }
                                bm--;
                                if (bm >= 1) distance += 1;
                                distance += 1;
                            }
                        }

                    }
                }
            }

        }
    }
    // if (cost === 0) {
    //     console.log(futures.length)
    // }
    futures = futures.filter(f => f !== null);
    if (futures.length === 0) {
        // cache.set(index, null);
        // console.log(index, null);
        return null;
    }
    // console.log(futures.map(f => f[0]));
    let minFuture = futures.reduce((minf, f) => f[0] < minf[0] ? f : minf);
    
    // if (cache.has(index) && minFuture[0] !== cache.get(index)[0]) {
    //     console.log('collision', index)
    //     console.log(minFuture[0], cache.get(index)[0])
    //     console.log('set', index, 'to', minFuture[0])
    // }

    cache.set(index, minFuture);
    // console.log(index, minFuture[0]);
    return minFuture;
}

function burrowGood (burrow, i) {
    return burrow.reduce((g, p) => g && p === i, true);
}




/*


01 2 3 4 56
  0 1 2 3


#############
#...........#
###1#2#1#3###
  #0#3#2#0#
  #########

#############
#1..........#
###.#2#1#3###
  #0#3#2#0#
  #########

#############
#12.........#
###.#.#1#3###
  #0#3#2#0#
  #########

#############
#12.3.......#
###.#.#1#3###
  #0#.#2#0#
  #########

#############
#12.3.1.....#
###.#.#.#3###
  #0#.#2#0#
  #########

#############
#12.3.......#
###.#.#.#3###
  #0#1#2#0#
  #########

#############
#12.3.3.....#
###.#.#.#.###
  #0#1#2#0#
  #########

#############
#12.3.3...0.#
###.#.#.#.###
  #0#1#2#.#
  #########

#############
#12.3.....0.#
###.#.#.#.###
  #0#1#2#3#
  #########






#############
#...........#
###D#B#C#A###
  #C#A#D#B#
  #########

#############
#.........A.#   2 A = 2
###D#B#C#.###
  #C#A#D#B#
  #########

#############
#A....B.....#   2 B = 20
###D#.#C#.###
  #C#A#D#B#
  #########

#############
#AA...B.....#   5 A = 5
###D#.#C#.###
  #C#.#D#B#
  #########

#############
#AA.........#   3 B = 30
###D#.#C#.###
  #C#B#D#B#
  #########

#############
#AA.........#   7 B = 70
###D#B#C#.###
  #C#B#D#.#
  #########

#############
#AA.........#   9 D = 9000
###.#B#C#.###
  #C#B#D#D#
  #########

#############
#AA...C.....#   2 C = 200
###.#B#.#.###
  #C#B#D#D#
  #########

#############
#AA...C.....#   5 D = 5000
###.#B#.#D###
  #C#B#.#D#
  #########

#############
#AA.........#   3 C = 300
###.#B#.#D###
  #C#B#C#D#
  #########

#############
#AA.........#   7 C = 700
###.#B#C#D###
  #.#B#C#D#
  #########

#############
#.........A.#   3 A = 3
###.#B#C#D###
  #A#B#C#D#
  #########

#############
#...........#   8 A = 8
###A#B#C#D###
  #A#B#C#D#
  #########





#############
#...........#
###D#B#C#A###
  #D#C#B#A#
  #D#B#A#C#
  #C#A#D#B#
  #########

#############
#AA.........#   9 A + 9 A = 180
###D#B#C#.###
  #D#C#B#.#
  #D#B#A#C#
  #C#A#D#B#
  #########

#############
#AA.......BC#   5 C + 5 B = 550
###D#B#C#.###
  #D#C#B#.#
  #D#B#A#.#
  #C#A#D#.#
  #########

#############
#AA.......BC#   11 D + 11 D + 11 D = 33000
###.#B#C#.###
  #.#C#B#D#
  #.#B#A#D#
  #C#A#D#D#
  #########

#############
#AA.....C.BC#   9 C = 900
###.#B#C#.###
  #.#C#B#D#
  #.#B#A#D#
  #.#A#D#D#
  #########

#############
#.......C.BC#   5 A + 5 A = 10
###.#B#C#.###
  #.#C#B#D#
  #A#B#A#D#
  #A#A#D#D#
  #########

#############
#.....B.C.BC#   2 B = 20
###.#.#C#.###
  #.#C#B#D#
  #A#B#A#D#
  #A#A#D#D#
  #########

#############
#CB...B.C.BC#   6 C + 6 B = 660
###.#.#C#.###
  #.#.#B#D#
  #A#.#A#D#
  #A#A#D#D#
  #########

#############
#CB...B.C.BC#   8 A = 8
###.#.#C#.###
  #A#.#B#D#
  #A#.#A#D#
  #A#.#D#D#
  #########

#############
#C......C.BC#   7 B + 4 B = 1100
###.#.#C#.###
  #A#.#B#D#
  #A#B#A#D#
  #A#B#D#D#
  #########

#############
#CC.....C.BC#   6 C = 600
###.#.#.#.###
  #A#.#B#D#
  #A#B#A#D#
  #A#B#D#D#
  #########

#############
#CC.....C.BC#   6 B = 60
###.#.#.#.###
  #A#B#.#D#
  #A#B#A#D#
  #A#B#D#D#
  #########

#############
#CC.....C.BC#   8 A = 8
###A#.#.#.###
  #A#B#.#D#
  #A#B#.#D#
  #A#B#D#D#
  #########

#############
#CC...D.C.BC#   5 D = 5000
###A#.#.#.###
  #A#B#.#D#
  #A#B#.#D#
  #A#B#.#D#
  #########

#############
#CC...D...BC#   5 C = 500
###A#.#.#.###
  #A#B#.#D#
  #A#B#.#D#
  #A#B#C#D#
  #########

#############
#CC.......BC#   4 D = 4000
###A#.#.#D###
  #A#B#.#D#
  #A#B#.#D#
  #A#B#C#D#
  #########

#############
#CC........C#   6 B = 60
###A#B#.#D###
  #A#B#.#D#
  #A#B#.#D#
  #A#B#C#D#
  #########

#############
#CC........C#   8 C + 8 C + 5 C = 2100
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########










*/