#!/usr/bin/env node
const spawn = require('cross-spawn');
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    o: 'override',
    p: 'path',
    h: 'help'
  }
});
const dotenv = require('dotenv-flow');
const dotenvExpand = require('dotenv-expand');

function printHelp() {
  console.log(
    [
      'Usage: dotenv-flow [-o <override>] [-p <path>] [-- command]',
      '  -p, --path <path>        Path where `dotenv-flow` should read `.env*` files from. Defaults to current working directory.',
      '  -o --override <override> Path to override file that will take precedence over other environment files. Use this for local overrides.',
      '  -h, --help               Show this help message',
      '  command                  Command to run with ENV vars. Put `--` before the command if it takes additional arguments, otherwise they might get lost.',
    ].join('\n')
  );
}

if (argv.help) {
  printHelp();
  process.exit();
}

const path = argv.p;
const override = argv.o;
dotenvExpand.expand(dotenv.config({ path, override }));

const command = argv._[0];
if (!command) {
  printHelp();
  process.exit(1);
}

spawn(command, argv._.slice(1), { stdio: 'inherit' })
  .on('exit', function (exitCode) {
    process.exit(exitCode)
  });
