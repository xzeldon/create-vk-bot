#! /usr/bin/env node

import { spawn } from 'child_process';

const is_win = process.platform === "win32" ? true : false;

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

if (is_win)
{
    await run_command('cmd.exe', ['/c', 'rmdir', '/q', '/s', `"./${name}/.git/"`], { shell: true });
} else
{
    await run_command('rm', ['-rf', `${name}/.git`]);
}


console.log('Installing dependencies...');

await run_command(is_win ? 'npm.cmd' : 'npm', ['install'], {
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