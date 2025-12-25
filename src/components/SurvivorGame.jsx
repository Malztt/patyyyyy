import { useState } from 'react';
import confetti from 'canvas-confetti';
import { phase1Rules, phase2Rules } from '../data/survivorRules';
import './SurvivorGame.css';

const SurvivorGame = ({ onBack }) => {
    const [phase, setPhase] = useState(1);
    const [currentCard, setCurrentCard] = useState(null);
    const [remainingPhase1, setRemainingPhase1] = useState([...phase1Rules]);
    const [remainingPhase2, setRemainingPhase2] = useState([...phase2Rules]);
    const [history, setHistory] = useState([]);

    const [isRolling, setIsRolling] = useState(false);

    const [showOverlay, setShowOverlay] = useState(false);

    const handleCardClick = () => {
        if (isRolling) return;

        let deck = phase === 1 ? remainingPhase1 : remainingPhase2;

        if (deck.length === 0) {
            alert("หมดกองแล้วจ้า!");
            return;
        }

        setShowOverlay(true);
        setIsRolling(true);

        // Wait for animation then finalize
        setTimeout(() => {
            finalizeDraw(deck);
        }, 2000);
    };

    const finalizeDraw = (deck) => {
        const randomIndex = Math.floor(Math.random() * deck.length);
        const card = deck[randomIndex];

        // Remove card from deck
        const newDeck = deck.filter((_, index) => index !== randomIndex);

        if (phase === 1) {
            setRemainingPhase1(newDeck);
        } else {
            setRemainingPhase2(newDeck);
        }

        setCurrentCard(card);
        setHistory(prev => [card, ...prev]);
        setIsRolling(false);

        // Effects based on card type
        if (card.type === 'survive' || card.type === 'revive' || card.type === 'action') {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#4CAF50', '#FFEB3B', '#FFFFFF']
            });
        }
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        setCurrentCard(null);
    };

    const getCardColor = (type) => {
        switch (type) {
            case 'eliminate': return 'var(--danger-color)';
            case 'survive': return 'var(--success-color)';
            case 'revive': return 'var(--warning-color)';
            case 'action': return 'var(--info-color)';
            default: return 'var(--card-bg)';
        }
    };

    return (
        <div className="survivor-container">
            <div className="survivor-header">
                <button className="back-btn" onClick={onBack}>← Menu</button>
                <h2>Survivor Game</h2>
            </div>

            <div className="phase-selector">
                <button
                    className={`phase-btn ${phase === 1 ? 'active' : ''}`}
                    onClick={() => setPhase(1)}
                >
                    Phase 1: Global ({remainingPhase1.length})
                </button>
                <button
                    className={`phase-btn ${phase === 2 ? 'active' : ''}`}
                    onClick={() => setPhase(2)}
                >
                    Phase 2: Individual ({remainingPhase2.length})
                </button>
            </div>

            <div className="card-grid">
                {(phase === 1 ? remainingPhase1 : remainingPhase2).slice(0, 12).map((_, index) => (
                    <button key={index} className={`mini-card ${phase === 2 ? 'phase-2' : ''}`} onClick={handleCardClick} disabled={isRolling}>
                    </button>
                ))}
            </div>

            {showOverlay && (
                <div className="reveal-overlay">
                    {isRolling ? (
                        <div
                            className="card-display shake"
                            style={{
                                borderColor: '#fff',
                                boxShadow: '0 0 20px rgba(255,255,255,0.2)'
                            }}
                        >
                            <div className="card-content">
                                <p className="card-text" style={{ fontSize: '20rem', marginTop: '-60px', lineHeight: '1', margin: 0 }}>?</p>
                            </div>
                        </div>
                    ) : (
                        currentCard && (
                            <>
                                <div
                                    className="card-display"
                                    style={{
                                        borderColor: getCardColor(currentCard.type),
                                        boxShadow: `0 0 50px ${getCardColor(currentCard.type)}80`
                                    }}
                                >
                                    <div className="card-content">
                                        <p className="card-text">{currentCard.text}</p>
                                        <span className={`card-type ${currentCard.type}`}>
                                            {currentCard.type === 'eliminate' ? 'ตกรอบ' :
                                                currentCard.type === 'survive' ? 'รอดตาย' :
                                                    currentCard.type === 'revive' ? 'ชุบชีวิต' :
                                                        currentCard.type === 'action' ? 'คำสั่ง' :
                                                            currentCard.type.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <button className="reveal-close-btn" onClick={handleCloseOverlay}>
                                    ปิดการ์ด
                                </button>
                            </>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default SurvivorGame;
