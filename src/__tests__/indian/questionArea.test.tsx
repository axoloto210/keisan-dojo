import { createNumbers } from '@/app/[lang]/indian/createRandomNumber'
import { QuestionArea } from '@/features/two-digit-x-two-digit/QuestionArea'
import {
    Dictionary,
    DICTIONARY_NAMES,
    getDictionary,
} from '@/i18n/dictionaries'
import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

describe('indian two-x-two Question Area', () => {
    let dict: Dictionary

    beforeAll(async () => {
        dict = await getDictionary('ja', DICTIONARY_NAMES.TWO_DIGIT_X_TWO_DIGIT)
    })

    afterEach(() => {
        cleanup()
    })

    test('ja dictionary can be loaded', () => {
        expect(dict.next).toBe('つぎへ')
    })

    test('should display the question and answer correctly', () => {
        const clickHandlerNext = jest.fn()
        render(
            <QuestionArea
                clickHandlerNext={clickHandlerNext}
                createNumbers={createNumbers}
                dict={dict}
            />
        )

        const questionElement = screen.getByText(/\d+ × \d+/)

        // Check if the question is displayed correctly
        expect(questionElement).toBeInTheDocument()

        // Click the "Answer" button
        fireEvent.click(screen.getByText(`${dict.answer}⏎`))

        const questionText = questionElement.textContent
        if (questionText === null) {
            throw new Error('Question text is null')
        }
        const [firstDigit, secondDigit]: number[] = questionText
            .split(' × ')
            .map(Number)

        const answer = firstDigit * secondDigit

        const answerElement = screen.getByText(answer.toString())

        expect(answerElement).toHaveTextContent(String(answer))
    })

    test('should generate numbers indian method can be applied  (100 times)', () => {
        const clickHandlerNext = jest.fn()

        for (let i = 0; i < 100; i++) {
            render(
                <QuestionArea
                    clickHandlerNext={clickHandlerNext}
                    createNumbers={createNumbers}
                    dict={dict}
                />
            )

            const questionElement = screen.getByText(/\d+ × \d+/)
            expect(questionElement).toBeInTheDocument()

            const questionText = questionElement.textContent
            if (questionText === null) {
                throw new Error('Question text is null')
            }

            const [firstNumber, secondNumber] = questionText
                .split(' × ')
                .map(Number)

            // Check that both digits are between 11 and 99
            expect(firstNumber).toBeGreaterThanOrEqual(11)
            expect(firstNumber).toBeLessThanOrEqual(99)
            expect(secondNumber).toBeGreaterThanOrEqual(11)
            expect(secondNumber).toBeLessThanOrEqual(99)

            // Check valid number set
            expect(secondNumber).toBe(
                Math.floor(firstNumber / 10) * 10 + (10 - (firstNumber % 10))
            )

            cleanup()
        }
    })
})
