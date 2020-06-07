export default function (color: string): boolean {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)
}
