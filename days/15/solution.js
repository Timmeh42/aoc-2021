class PriorityQueue {
    constructor () {
        this.end = undefined;
        this.length = 0;
    }

    insert (value, priority) {
        const newItem = {
            value,
            priority,
            next: undefined,
        };
        if (this.end === undefined) {
            this.end = newItem;
        } else {
            let current = this.end;
            if (priority < current.priority) {
                this.end = newItem;
                newItem.next = current;
            } else {
                let next = current.next;
                while (next !== undefined && priority >= next.priority) {
                    current = next;
                    next = next.next;
                }
                newItem.next = next;
                current.next = newItem;
            }
        }
        this.length += 1;
        return this;
    }

    pop () {
        const item = this.end;
        if (item !== undefined) {
            this.end = item.next;
            this.length -= 1;
        }
        return item.value;
    }
}

module.exports = function (input) {
    let part1, part2;
    const lines = input.trim().split('\n');

    const width = lines[0].length;
    const height = lines.length;
    const grid = lines.map(y => y.split('').map(s => +s));

    let goal = (width-1) + (height-1) * width;
    let frontier = new PriorityQueue();
    frontier.insert(0, 0);
    let cost_so_far = new Map();
    cost_so_far.set(0, 0);

    while (frontier.length) {
        let current = frontier.pop();

        if (current === goal) {
            break;
        }

        let x = current % width;
        let y = Math.floor(current / width);

        if (x > 0) {
            let next = current-1;
            let new_cost = cost_so_far.get(current) + grid[y][x-1];
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
        if (y > 0) {
            let next = current-width;
            let new_cost = cost_so_far.get(current) + grid[y-1][x];
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
        if (x < width-1) {
            let next = current+1;
            let new_cost = cost_so_far.get(current) + grid[y][x+1];
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
        if (y < height-1) {
            let next = current+width;
            let new_cost = cost_so_far.get(current) + grid[y+1][x];
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
    }

    part1 = cost_so_far.get(goal);



    bigWidth = width * 5;
    bigHeight = height * 5;

    goal = (bigWidth-1) + (bigHeight-1) * bigWidth;
    frontier = new PriorityQueue();
    frontier.insert(0, 0);
    cost_so_far = new Map();
    cost_so_far.set(0, 0);

    let current;
    while (frontier.length) {
        current = frontier.pop();

        if (current === goal) {
            break;
        }

        let x = current % bigWidth;
        let y = Math.floor(current / bigWidth);

        if (x > 0) {
            let next = current-1;
            let new_cost = cost_so_far.get(current) + cost(x-1, y, width, height, grid);
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
        if (y > 0) {
            let next = current-bigWidth;
            let new_cost = cost_so_far.get(current) + cost(x, y-1, width, height, grid);
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
        if (x < bigWidth-1) {
            let next = current+1;
            let new_cost = cost_so_far.get(current) + cost(x+1, y, width, height, grid);
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
        if (y < bigHeight-1) {
            let next = current+bigWidth;
            let new_cost = cost_so_far.get(current) + cost(x, y+1, width, height, grid);
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
    }

    part2 = cost_so_far.get(goal)

    return [part1, part2];
}

function cost(x, y, width, height, grid) {
    const nx = x % width;
    const ny = y % height;
    const dx = (x - nx) / width;
    const dy = (y - ny) / height;
    return (grid[ny][nx] + dx + dy - 1) % 9 + 1;
}