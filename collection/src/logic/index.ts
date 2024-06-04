import { ReadStream, createWriteStream } from 'node:fs';
import { createApi } from 'unsplash-js';
import { type Random } from 'unsplash-js/dist/methods/photos/types.js';
import { pause } from '../utils/index.js';
import axios from 'axios';

export async function findUnsplashImages(unsplashAccessKey: string) {
    const unsplash = createApi({
        accessKey: unsplashAccessKey
    })
    
    let images: Random[] = [];
    
    const DATA_SIZE = 1000;
    const BATCH_SIZE = 25;
    
    for(let i = 0; i < (DATA_SIZE / BATCH_SIZE); i++) {
        const request = await unsplash.photos.getRandom({
            count: BATCH_SIZE
        });
    
        const batch = request.response as Random[];
    
        images = images.concat(batch)

        console.log('Finished Batch:', i)
    
        await pause(2000); // Ensure No Rate-Limiting
    }
    
    return images;
}

export async function downloadImages(images: Random[], outputDirectory: string) {
    
    let urls: string[] = [];

    const thumbnails = images.slice(0, images.length / 4);
    const smalls = images.slice(images.length / 4, images.length / 2);
    const regulars = images.slice(images.length / 2, 3 * images.length / 4);
    const fulls = images.slice(3 * images.length / 4, images.length);

    urls = urls.concat(thumbnails.map(image => image.urls.thumb));
    urls = urls.concat(smalls.map(image => image.urls.small));
    urls = urls.concat(regulars.map(image => image.urls.regular));
    urls = urls.concat(fulls.map(image => image.urls.full));

    const requests = urls.map(url => {
        url.replace('fm=jpg', 'fm=png'); // Download PNG Versions Of The Images

        return axios.get<ReadStream>(url, {
            responseType: 'stream'
        });
    })

    const responses = await Promise.all(requests);

    responses.forEach((response, index) => {
        const writer = createWriteStream(`${outputDirectory}/${(index + 1)}.png`)
        response.data.pipe(writer);
    })
}