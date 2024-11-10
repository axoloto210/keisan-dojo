export function createNumbers(): number[] {
    const firstNumber =
        11 + Math.floor(Math.random() * 9) * 10 + Math.floor(Math.random() * 9)

    const secondNumber =
        Math.floor(firstNumber / 10) * 10 + 1 + Math.floor(Math.random() * 9)

    return [firstNumber, secondNumber]
}
