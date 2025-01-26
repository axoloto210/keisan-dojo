import { QuestionNumbers, Solution } from '../kumiteHandler'

export const createQuestionNumbersAndSolution = (): [
    QuestionNumbers,
    Solution,
] => {
    const firstNumber = 11 + Math.floor(Math.random() * 89)

    const secondNumber = 11 + Math.floor(Math.random() * 89)

    const solution = firstNumber * secondNumber

    return [[firstNumber, secondNumber], solution]
}
