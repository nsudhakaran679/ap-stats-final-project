import { hrtime } from 'node:process'
import { readdir as readDir } from 'node:fs/promises';
import { execute } from './utils/index.js';

const IMAGE_DIR = '../images';
const COMPRESSION_QUALITY = 80;


for (const file of await readDir(IMAGE_DIR)) {
    if (!file.endsWith('.png')) continue;

    const startWebp = hrtime();
    await execute(`cwebp -q ${COMPRESSION_QUALITY} ${IMAGE_DIR}/${file} -o ${IMAGE_DIR}/${file.replace('.png', '.webp')}`)
    const endWebp = hrtime(startWebp);
    console.log(file, "to WebP finished in", endWebp[0] + (endWebp[1] / 1e6), "seconds.")
    
    const startAvif = hrtime();
    await execute(`avifenc -q ${COMPRESSION_QUALITY} ${IMAGE_DIR}/${file} ${IMAGE_DIR}/${file.replace('.png', '.avif')}`)
    const endAvif = hrtime(startAvif);
    console.log(file, "to AVIF finished in", endAvif[0] + (endAvif[1] / 1e6), "milliseconds.")
}