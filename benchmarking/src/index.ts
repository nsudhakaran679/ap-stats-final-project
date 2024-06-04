import { hrtime } from 'node:process'
import { readdir as readDir, stat, writeFile } from 'node:fs/promises';
import { execute } from './utils/index.js';

const IMAGE_DIR = './images';
const COMPRESSION_QUALITY = 80;

type CompressionStats = [number, number, number, number, number];

let files = await readDir(IMAGE_DIR);

files = files.filter(file => file.endsWith('.png'));

const data = Array.from({ length: files.length }, () => [0, 0, 0, 0, 0] as CompressionStats);

for (const file of files) {
    const index = parseInt(file.split('.')[0]!) - 1;
    const filePng = `${IMAGE_DIR}/${file}`;
    console.log(index);

    const { size: sizePng } = await stat(filePng);
    data[index]![0] = sizePng;

    const startWebp = hrtime();
    const fileWebp = `${IMAGE_DIR}/${file.replace('.png', '.webp')}`
    await execute(`cwebp -q ${COMPRESSION_QUALITY} ${filePng} -o ${fileWebp}`)
    const endWebp = hrtime(startWebp);
    const millisecondsWebp = endWebp[0] + (endWebp[1] / 1e6);
    console.log(file, "to WebP finished in", millisecondsWebp, "milliseconds.")
    data[index]![3] = millisecondsWebp;

    const { size: sizeWebp } = await stat(fileWebp);
    data[index]![1] = sizeWebp; 

    const startAvif = hrtime();
    const fileAvif = `${IMAGE_DIR}/${file.replace('.png', '.avif')}`
    await execute(`avifenc -q ${COMPRESSION_QUALITY} ${filePng} ${fileAvif}`)
    const endAvif = hrtime(startAvif);
    const millisecondsAvif = endAvif[0] + (endAvif[1] / 1e6);
    console.log(file, "to AVIF finished in", millisecondsAvif, "milliseconds.")
    data[index]![4] = millisecondsAvif;

    const { size: sizeAvif } = await stat(fileAvif);
    data[index]![2] = sizeAvif;;

}

console.log(data)

writeFile('data.csv', data.map(row => row.join(',')).join('\n'));
