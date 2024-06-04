import { promisify } from 'node:util';

export async function pause(milliseconds: number) {
    await promisify(setTimeout)(milliseconds);
}