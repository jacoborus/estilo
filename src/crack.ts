export function crack (message: string, data?: Record<string, string>): never {
  console.log('Error:')
  console.log(message)
  data && console.dir(data)
  console.trace()
  process.exit(1)
}
