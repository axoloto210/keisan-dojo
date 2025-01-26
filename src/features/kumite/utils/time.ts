export function formatTimeToSSMMM(ms: number): string {
    const totalMilliseconds = Math.floor(ms)

    const seconds = Math.floor(totalMilliseconds / 1000)

    const milliseconds = totalMilliseconds % 1000

    const paddedMilliseconds = milliseconds.toString().padStart(3, '0')

    return `${seconds}.${paddedMilliseconds}s`
}
