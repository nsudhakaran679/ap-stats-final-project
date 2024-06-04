import { createApi } from 'unsplash-js';
import { type Random } from 'unsplash-js/dist/methods/photos/types.js';
import { pause } from '../utils/index.js';

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
    
        await pause(2000); // Ensure No Rate-Limiting
    }
    
    return images;
}
