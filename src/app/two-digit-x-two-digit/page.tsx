'use client'

import { QuestionArea } from '@/features/two-digit-x-two-digit/QuestionArea'
import { useState } from 'react'

export default function Page() {
    const [questionCount, setQuestionCount] = useState<number>(1)

    const clickHandlerNext = () => {
        setQuestionCount((count) => count + 1)
    }

    return (
        <>
            <h2>{questionCount} もんめ</h2>
            <QuestionArea
                key={questionCount}
                clickHandlerNext={clickHandlerNext}
            />
        </>
    )
}
