export function createNumbers(): number[] {
    const firstNumber = Math.floor(Math.random() * 89) + 11

    const secondNumber = Math.floor(Math.random() * 89) + 11

    return [firstNumber, secondNumber]
}
