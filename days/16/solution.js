class BitReader {
    constructor (input) {
        this.input = input;
        this.pointer = 0;
        this.store = 0;
        this.remaining = 0;
    }

    readChar () {
        const char = this.input[this.pointer];
        this.pointer += 1;
        this.store = (this.store << 4) + parseInt(char, 16);
        this.remaining += 4;
    }

    readBits (n) {
        while (n > this.remaining) {
            this.readChar();
        }
        const out = this.store >> (this.remaining - n);
        this.remaining -= n;
        this.store = this.store & (2 ** this.remaining - 1);
        return out;
    }

    clearStore () {
        this.remaining = 0;
        this.store = 0;
    }
}

module.exports = function (input) {
    let part1, part2;
    const lines = input.trim();

    const reader = new BitReader(input);
    const packetTree = readPacket(reader);

    part1 = packetVersions(packetTree).reduce((sum, v) => sum + v);
    part2 = packetTree.value;

    return [part1, part2];
}

function readPacket (reader) {
    const version = reader.readBits(3);
    const ID = reader.readBits(3);
    const packet = {
        version,
        ID,
        length: 6,
    };
    if (ID === 4) {
        let val = 0;
        while (true) {
            let final = reader.readBits(1);
            let partial = reader.readBits(4);
            packet.length += 5;
            val = (val * 16) + partial;
            if (final === 0) {
                break;
            }
        }
        packet.value = val;
    } else {
        const lenType = reader.readBits(1);
        packet.lenType = lenType;
        packet.length += 1;

        const length = reader.readBits(lenType ? 11 : 15);
        packet.length += lenType ? 11 : 15
        packet.contentLength = length;

        packet.subPackets = [];
        if (lenType === 0) {
            packet.length += length;
            let lenRemaining = length;
            while (lenRemaining) {
                const subPacket = readPacket(reader);
                lenRemaining -= subPacket.length;
                packet.subPackets.push(subPacket);
            }
        } else {
            let lenRemaining = length;
            while (lenRemaining) {
                const subPacket = readPacket(reader);
                lenRemaining -= 1;
                packet.length += subPacket.length;
                packet.subPackets.push(subPacket);
            }
        }
        switch (ID) {
            case (0): {
                packet.value = packet.subPackets.reduce((sum, p) => sum + p.value, 0);
                break;
            }
            case (1): {
                packet.value = packet.subPackets.reduce((product, p) => product * p.value, 1);
                break;
            }
            case (2): {
                packet.value = packet.subPackets.reduce((min, p) => p.value < min ? p.value : min, Infinity);
                break;
            }
            case (3): {
                packet.value = packet.subPackets.reduce((max, p) => p.value > max ? p.value : max, -Infinity);
                break;
            }
            case (5): {
                packet.value = +(packet.subPackets[0].value > packet.subPackets[1].value);
                break;
            }
            case (6): {
                packet.value = +(packet.subPackets[0].value < packet.subPackets[1].value);
                break;
            }
            case (7): {
                packet.value = +(packet.subPackets[0].value === packet.subPackets[1].value);
                break;
            }
        }
    }
    return packet;
}

function packetVersions (packet) {
    const versionList = [];
    versionList.push(packet.version);
    if (packet.subPackets) {
        for (let subPacket of packet.subPackets) {
            versionList.push(...packetVersions(subPacket));
        }
    }
    return versionList;
}