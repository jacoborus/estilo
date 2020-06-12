import chalk from 'chalk'

type ErrorOpts = Record<string, string>

export function crash (message: string, data?: ErrorOpts): never {
  console.log(chalk.red('Error: ' + message))
  if (data) console.log(chalk.red(dataToText(data)))
  process.exit(1)
}

function dataToText (data: ErrorOpts): string {
  return Object.keys(data)
    .map(key => `- ${key}: ${data[key]}`)
    .join('\n')
}
