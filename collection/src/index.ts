import { createApi } from 'unsplash-js';
import 'dotenv/config'

const unsplash = createApi({
    accessKey: process.env['UNSPLASH_ACCESS_KEY']!
})

const data = await unsplash.users.get({
    username: 'nsudhakaran679'
});

console.log(data)