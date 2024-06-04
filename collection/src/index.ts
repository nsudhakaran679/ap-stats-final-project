import { createApi } from 'unsplash-js';
import { type Random } from 'unsplash-js/dist/methods/photos/types.js';
import { pause } from './utils/index.js';
import 'dotenv/config'

const unsplash = createApi({
    accessKey: process.env['UNSPLASH_ACCESS_KEY']!
})

let data: Random[] = [];

const DATA_SIZE = 1000;
const BATCH_SIZE = 25;

for(let i = 0; i < (DATA_SIZE / BATCH_SIZE); i++) {
    const request = await unsplash.photos.getRandom({
        count: BATCH_SIZE
    });

    const batch = request.response as Random[];

    data = data.concat(batch)

    await pause(2000); // Ensure No Rate-Limiting
}

console.log(data)