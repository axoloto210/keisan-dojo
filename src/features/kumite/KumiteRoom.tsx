'use client'
import { useState } from 'react'
import { UserContext } from './contexts/userContext'
import styles from './kumiteRoom.module.scss'
import { KumiteArea } from './KumiteArea'

export function KumiteRoom() {
    const [userName, setUserName] = useState<string>('')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    const handleLogin = () => {
        if (userName.trim()) {
            setIsAuthenticated(true)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) return
        if (e.key === 'Enter') {
            handleLogin()
        }
    }

    return (
        <UserContext.Provider value={{ userName, setUserName }}>
            <div className={styles.kumiteRoom}>
                <header>
                    <div className={styles.headerContainer}>
                        <div className={styles.headerContent}>
                            <h1>組み手モード</h1>
                        </div>
                    </div>
                </header>
                <main>
                    {!isAuthenticated ? (
                        <div className={styles.loginContainer}>
                            <h2>ユーザー名を入力</h2>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) =>
                                        setUserName(e.target.value)
                                    }
                                    placeholder="ユーザー名"
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={handleLogin}>開始</button>
                            </div>
                        </div>
                    ) : (
                        <KumiteArea />
                    )}
                </main>
            </div>
        </UserContext.Provider>
    )
}
