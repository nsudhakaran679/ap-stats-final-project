import { downloadImages, findUnsplashImages } from './logic/index.js';
import 'dotenv/config'

const images = await findUnsplashImages(process.env['UNSPLASH_ACCESS_KEY']!);

await downloadImages(images, '../images');