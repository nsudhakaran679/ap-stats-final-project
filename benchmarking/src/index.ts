import { hrtime } from 'node:process'
import { exec } from 'node:child_process'

const start = hrtime();

exec('ls -l')

const end = hrtime(start);

console.log(`Task took ${end[0]} seconds and ${end[1]} nanoseconds`);

const seconds = end[0] + (end[1] / 1e9)

console.log(seconds)