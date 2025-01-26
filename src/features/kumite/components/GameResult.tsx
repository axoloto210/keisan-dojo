import React from 'react'
import { GAME_RESULTS, GameResult } from '../hooks/useKumite'
import Link from 'next/link'

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '2rem',
    },
    resultOverlay: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
    },
    resultText: {
        fontSize: '6rem',
        fontWeight: 700,
        animation: 'bounce 1s infinite',
    },
    win: {
        color: '#fde047',
    },
    lose: {
        color: '#3b82f6',
    },
    controlPanel: {
        position: 'relative',
        zIndex: 20,
    },
    button: {
        padding: '0.5rem 1rem',
        backgroundColor: '#1f2937',
        color: 'white',
        borderRadius: '0.25rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
}

const keyframesStyle = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
`

type Props = {
    result: GameResult
}

const GameOverlay: React.FC<Props> = (props) => {
    const gameResult = props.result
    return (
        <div style={styles.container}>
            <style>{keyframesStyle}</style>

            <div style={styles.controlPanel}>
                <Link href={'/'} style={styles.button}>
                    TOP
                </Link>
            </div>

            <div style={styles.resultOverlay}>
                <div
                    style={{
                        ...styles.resultText,
                        ...(gameResult === GAME_RESULTS.WIN
                            ? styles.win
                            : styles.lose),
                    }}
                >
                    {gameResult === GAME_RESULTS.WIN
                        ? 'YOU WIN!'
                        : 'YOU LOSE..'}
                </div>
            </div>
        </div>
    )
}

export default GameOverlay
