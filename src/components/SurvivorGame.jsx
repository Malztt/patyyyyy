import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { phase1Pool, phase2Pool } from '../data/survivorCommands';
import './SurvivorGame.css';

// Phase 1 Deck Configuration
const PHASE1_DECK_SIZE = 20;
const RATIOS = {
    safe: 0.1,  // 10%
    death: 0.2, // 20%
    risk: 0.7   // 70%
};

const SurvivorGame = ({ onBack }) => {
    const [phase, setPhase] = useState(1);
    const [currentCard, setCurrentCard] = useState(null);
    const [phase1Deck, setPhase1Deck] = useState([]);
    const [phase2Deck, setPhase2Deck] = useState([]);

    // History can track just text or type for now
    const [history, setHistory] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    // Initialize Decks
    useEffect(() => {
        setPhase1Deck(generatePhase1Deck());
        // Phase 2 is just the pool shuffled (or as is, let's shuffle it for randomness)
        setPhase2Deck([...phase2Pool].sort(() => Math.random() - 0.5));
    }, []);

    const generatePhase1Deck = () => {
        const safeCount = Math.round(PHASE1_DECK_SIZE * RATIOS.safe);
        const deathCount = Math.round(PHASE1_DECK_SIZE * RATIOS.death);
        // Ensure total is exactly DECK_SIZE (remaining goes to risk)
        const riskCount = PHASE1_DECK_SIZE - safeCount - deathCount;

        let deck = [];

        // Helper to pick random items
        const pickRandom = (pool, count) => {
            const result = [];
            for (let i = 0; i < count; i++) {
                const randomItem = pool[Math.floor(Math.random() * pool.length)];
                // Create a unique copy so if we pick the same item twice it's distinct
                result.push({ ...randomItem, id: Math.random().toString(36).substr(2, 9) });
            }
            return result;
        };

        deck = [
            ...pickRandom(phase1Pool.safe, safeCount),
            ...pickRandom(phase1Pool.death, deathCount),
            ...pickRandom(phase1Pool.risk, riskCount)
        ];

        // Shuffle the complete deck
        return deck.sort(() => Math.random() - 0.5);
    };

    const handleCardClick = () => {
        if (isRolling) return;

        let currentDeck = phase === 1 ? phase1Deck : phase2Deck;

        if (currentDeck.length === 0) {
            // If deck empty in Phase 1, maybe regenerate? Or just say empty.
            // User implies "I will add more later", so for now empty is empty.
            if (phase === 1) {
                // Optional: Auto-refill? Let's stick to "Empty" for now unless requested.
                alert("หมดกองแล้ว! เริ่มเกมใหม่หรือเปลี่ยน Phase");
            } else {
                alert("หมดกองแล้วจ้า!");
            }
            return;
        }

        setShowOverlay(true);
        setIsRolling(true);

        // Wait for animation then finalize
        setTimeout(() => {
            finalizeDraw(currentDeck);
        }, 2000);
    };

    const finalizeDraw = (deck) => {
        // Pop the first card (since it's already shuffled)
        const [card, ...remaining] = deck;

        if (phase === 1) {
            setPhase1Deck(remaining);
        } else {
            setPhase2Deck(remaining);
        }

        setCurrentCard(card);
        setHistory(prev => [card, ...prev]);
        setIsRolling(false);

        // Effects based on card type
        if (card.type === 'survive' || card.type === 'revive' || card.type === 'action') {
            confetti({
                particleCount: 70,
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
            case 'risk': return 'var(--warning-color)';
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

            <div className="card-count">
                เหลือ {phase === 1 ? phase1Deck.length : phase2Deck.length} ใบ
            </div>

            <div className="phase-selector">
                <button
                    className={`phase-btn ${phase === 1 ? 'active' : ''}`}
                    onClick={() => setPhase(1)}
                >
                    Phase 1
                </button>
                <button
                    className={`phase-btn ${phase === 2 ? 'active' : ''}`}
                    onClick={() => setPhase(2)}
                >
                    Phase 2
                </button>
            </div>

            <div className="card-grid">
                {(phase === 1 ? phase1Deck : phase2Deck).slice(0, 12).map((_, index) => (
                    <button key={index} className={`mini-card ${phase === 2 ? 'phase-2' : ''}`} onClick={handleCardClick} disabled={isRolling}>
                    </button>
                ))}
            </div>

            {showOverlay && (
                <div className="reveal-overlay">
                    {isRolling ? (
                        <div className="card-display shake">
                            <p className="card-text shake-text">?</p>
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
                                                currentCard.type === 'survive' ? 'รอด' :
                                                    currentCard.type === 'risk' ? 'วัดดวง' :
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
            )
            }
        </div >
    );
};

export default SurvivorGame;
