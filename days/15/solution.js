class PriorityQueue {
    constructor () {
        this.arr = [];
        this.end = undefined;
        this.length = 0;
    }

    insert (value, priority) {
        let priorityGroup = this.arr[priority];
        if (!priorityGroup) {
            priorityGroup = [];
            this.arr[priority] = priorityGroup;
        }
        priorityGroup.push(value);
        if (!this.end || priority < this.end) {
            this.end = priority;
        }
        this.length += 1;
        return this;
    }

    pop () {
        const priorityGroup = this.arr[this.end];
        const item = priorityGroup.pop();
        this.length -= 1;
        if (priorityGroup.length === 0) {
            this.arr[this.end] = undefined;
            if (this.length !== 0) {
                while (!this.arr[this.end]) {
                    this.end ++;
                }
            } else {
                this.end = undefined;
            }
        }
        return item;
    }
}

module.exports = function (input) {
    let part1, part2;
    const lines = input.trim().split('\n');

    const width = lines[0].length;
    const height = lines.length;
    const grid = lines.map(y => y.split('').map(s => +s));

    part1 = dijkstra(grid, width, height);

    part2 = dijkstra(grid, width, height, 5);

    return [part1, part2];
}

function cost(x, y, width, height, grid) {
    const nx = x % width;
    const ny = y % height;
    const dx = (x - nx) / width;
    const dy = (y - ny) / height;
    return (grid[ny][nx] + dx + dy - 1) % 9 + 1;
}

function dijkstra (grid, width, height, scale = 1) {
    
    bigWidth = width * scale;
    bigHeight = height * scale;

    goal = (bigWidth-1) + (bigHeight-1) * bigWidth;
    frontier = new PriorityQueue();
    frontier.insert(0, 0);
    cost_so_far = new Map();
    cost_so_far.set(0, 0);

    while (frontier.length) {
        let current = frontier.pop();

        if (current === goal) {
            break;
        }

        let x = current % bigWidth;
        let y = Math.floor(current / bigWidth);

        let neighbours = [];
        if (x > 0) {
            neighbours.push([-1, 0])
        }
        if (y > 0) {
            neighbours.push([0, -1])
        }
        if (x < bigWidth-1) {
            neighbours.push([+1, 0])
        }
        if (y < bigHeight-1) {
            neighbours.push([0, +1])
        }
        for (let [dx, dy] of neighbours) {
            const next = current + dx + dy * bigWidth;
            const new_cost = cost_so_far.get(current) + cost(x + dx, y + dy, width, height, grid);
            if (!cost_so_far.has(next) || new_cost < cost_so_far.get(next)) {
                cost_so_far.set(next, new_cost);
                frontier.insert(next, new_cost);
            }
        }
    }
    return cost_so_far.get(goal);
}