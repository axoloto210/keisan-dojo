'use client'

import { QuestionArea } from '@/features/two-digit-x-two-digit/QuestionArea'
import { useState } from 'react'

import questionBoxStyle from '@/app/[lang]/two-digit-x-two-digit/questionBox.module.scss'
import { Dictionary } from '@/i18n/dictionaries'
import { createNumbers } from './createNumbers'

type QuestionBoxProps = {
    dict: Dictionary
}

export function QuestionBox(questionBoxProps: QuestionBoxProps) {
    const { dict } = questionBoxProps
    const [questionCount, setQuestionCount] = useState<number>(1)

    const clickHandlerNext = () => {
        setQuestionCount((count) => count + 1)
    }

    return (
        <>
            <div className={questionBoxStyle.container}>
                <div className={questionBoxStyle.question}>
                    Q.{questionCount}
                </div>
                <QuestionArea
                    key={questionCount}
                    createNumbers={createNumbers}
                    clickHandlerNext={clickHandlerNext}
                    dict={dict}
                />
            </div>
        </>
    )
}
