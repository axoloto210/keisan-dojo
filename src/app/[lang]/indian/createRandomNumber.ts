export function createNumbers(): number[] {
    const firstNumber =
        11 + Math.floor(Math.random() * 9) * 10 + Math.floor(Math.random() * 9)

    const secondNumber =
        Math.floor(firstNumber / 10) * 10 + (10 - (firstNumber % 10))

    return [firstNumber, secondNumber]
}
