class BitReader {
    constructor (input) {
        this.input = input;
        this.pointer = 0;
        this.store = 0;
        this.remaining = 0;
    }

    readChar () {
        const charCode = this.input.charCodeAt(this.pointer);
        this.pointer += 1;
        this.store = (this.store << 4) + charCode - (charCode >= 65 ? 55 : 48);
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
        bitLength: 6,
    };
    if (ID === 4) {
        let val = 0;
        while (true) {
            let final = reader.readBits(1);
            let partial = reader.readBits(4);
            packet.bitLength += 5;
            val = (val * 16) + partial;
            if (final === 0) {
                break;
            }
        }
        packet.value = val;
    } else {
        const lengthType = reader.readBits(1);
        packet.lengthType = lengthType;
        packet.bitLength += 1;

        packet.bitLength += lengthType ? 11 : 15;
        packet.contentLength = reader.readBits(lengthType ? 11 : 15);

        packet.subPackets = [];
        if (lengthType === 0) {
            packet.bitLength += packet.contentLength;
            let lenRemaining = packet.contentLength;
            while (lenRemaining) {
                const subPacket = readPacket(reader);
                lenRemaining -= subPacket.bitLength;
                packet.subPackets.push(subPacket);
            }
        } else {
            let lenRemaining = packet.contentLength;
            while (lenRemaining) {
                const subPacket = readPacket(reader);
                lenRemaining -= 1;
                packet.bitLength += subPacket.bitLength;
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