import { exec } from "node:child_process";
import { promisify } from "node:util";

export async function execute(command: string, options?: {
    flagErrors?: boolean
}) {
    const { stdout, stderr } = await promisify(exec)(command);

    if(stderr != '' && options?.flagErrors) throw new Error(`Execution of command \`${command}\` failed with the following ouput:\n\n${stderr}`)

    return stdout;
}