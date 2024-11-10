export function createNumbers(): number[] {
    const firstNumber =
        Math.floor(Math.random() * 9) * 10 + Math.floor(Math.random() * 9) + 11

    const secondNumber =
        Math.floor(firstNumber / 10) * 10 + (10 - (firstNumber % 10))

    return [firstNumber, secondNumber]
}
