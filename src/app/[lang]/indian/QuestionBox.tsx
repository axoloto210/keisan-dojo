'use client'

import { QuestionArea } from '@/app/[lang]/indian/QuestionArea'
import { useState } from 'react'

import questionAreaStyle from '@/app/[lang]/indian/questionArea.module.scss'
import { Dictionary } from '@/i18n/dictionaries'

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
            <div className={questionAreaStyle.container}>
                <div className={questionAreaStyle.question}>
                    Q.{questionCount}
                </div>
                <QuestionArea
                    key={questionCount}
                    clickHandlerNext={clickHandlerNext}
                    dict={dict}
                />
            </div>
        </>
    )
}
