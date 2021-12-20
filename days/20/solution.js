module.exports = function (input) {
    let part1, part2;
    input = input.replace(/\./g, '0').replace(/#/g, '1')
    const sections = input.trim().split('\n\n');
    const algo = sections[0];

    let image = sections[1].split('\n');
    let width = image[0].length;
    let height = image.length;
    
    for (let t = 0; t < 50; t++) {
        let newImage = []
        let lit = 0;
        for (let y = 0; y < height + 2; y++) {
            newImage.push([])
            for (let x = 0; x < width + 2; x++) {
                let areaCode = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        areaCode = areaCode << 1;
                        pixelRead = image[y - 1 + dy]?.[x - 1 + dx];
                        if (pixelRead === undefined) {
                            if (t % 2 || algo[0] === '0') {
                                pixelRead = algo[0]
                            } else {
                                pixelRead = algo[511]
                            }
                        }
                        areaCode += pixelRead === '1';
                    }
                }
                let pixel = algo[areaCode];
                if (pixel === '1') lit++;
                newImage[y].push(pixel);
            }
        }
        image = newImage;
        width = width + 2;
        height = height + 2;
        if (t === 1) {
            part1 = lit;
        }
        part2 = lit;
    }

    return [part1, part2];
}
