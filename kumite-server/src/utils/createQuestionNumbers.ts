export const createQuestionNumbers = (): number[] => {
    const firstNumber = 11 + Math.floor(Math.random() * 89)

    const secondNumber = 11 + Math.floor(Math.random() * 89)

    return [firstNumber, secondNumber]
}
