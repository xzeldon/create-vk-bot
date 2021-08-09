#! /usr/bin/env node

import { spawn } from 'child_process';

const name = process.argv[2];
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/))
{
    console.log(`
    Invalid directory name.
    Usage: create-vk-bot name-of-bot
  `);

    process.exit(1);
}

const repo_url = 'https://github.com/xzeldon/vk-bot-starter.git';

await run_command('git', ['clone', repo_url, name]);
await run_command('rm', ['-rf', `${name}/.git`]);

console.log('Installing dependencies...');

await run_command('npm', ['install'], {
    cwd: process.cwd() + '/' + name
});

console.log('Done! 🏁');
console.log('');
console.log('To get started:');
console.log('cd', name);
console.log('npm run dev');

function run_command(command, args, options = undefined)
{
    const spawned = spawn(command, args, options);

    return new Promise((resolve) =>
    {
        spawned.stdout.on('data', (data) =>
        {
            console.log(data.toString());
        });

        spawned.stderr.on('data', (data) =>
        {
            console.error(data.toString());
        });

        spawned.on('close', () =>
        {
            resolve();
        });
    });
}