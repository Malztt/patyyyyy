import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import santaIcon from '../assets/santa-token.png';
import './SantaGame.css';

const SantaGame = ({ items, playedIds, isPlaying, onComplete }) => {
    const santaControls = useAnimation();
    const [santaPos, setSantaPos] = useState({ x: 0, y: 0 }); // Use X/Y for precise positioning
    const [activeIndex, setActiveIndex] = useState(null); // Which box Santa is currently visiting
    const chimneyRefs = useRef([]);

    useEffect(() => {
        // Reset refs array when items change
        chimneyRefs.current = chimneyRefs.current.slice(0, items.length);
    }, [items]);

    useEffect(() => {
        if (isPlaying) {
            startSantaWalk();
        }
    }, [isPlaying]);

    const startSantaWalk = async () => {
        // 1. Filter candidates
        const candidates = items.filter(item => !playedIds.includes(item.id));
        if (candidates.length === 0) return;

        // 2. Pick winner
        const winnerIndexInCandidates = Math.floor(Math.random() * candidates.length);
        const winner = candidates[winnerIndexInCandidates];
        const winnerIndex = items.findIndex(item => item.id === winner.id);

        // 3. Walk animation logic
        // Walk through a few random unplayed boxes before landing
        // Let's perform 5-8 random jumps to build suspense
        const totalSteps = 5 + Math.floor(Math.random() * 4);

        let steps = [];

        // Helper to get unplayed indices
        const unplayedIndices = items
            .map((item, idx) => playedIds.includes(item.id) ? -1 : idx)
            .filter(idx => idx !== -1);

        for (let i = 0; i < totalSteps; i++) {
            const randomIdx = unplayedIndices[Math.floor(Math.random() * unplayedIndices.length)];
            steps.push(randomIdx);
        }
        // Ensure final step is winner
        steps.push(winnerIndex);

        // Execute Walk
        for (let i = 0; i < steps.length; i++) {
            const targetIdx = steps[i];
            const targetEl = chimneyRefs.current[targetIdx];

            if (targetEl) {
                // Get offset relative to container
                const rect = targetEl.getBoundingClientRect();
                const containerRect = targetEl.parentElement.parentElement.getBoundingClientRect(); // .santa-game-container

                const relativeX = rect.left - containerRect.left + (rect.width / 2) - 40; // Center Santa (Width 80px)
                const relativeY = rect.top - containerRect.top - 60; // Stand on top

                const isLast = i === steps.length - 1;
                const duration = isLast ? 0.8 : 0.4; // Slow down at end

                setActiveIndex(targetIdx);

                await santaControls.start({
                    x: relativeX,
                    y: relativeY,
                    transition: { duration: duration, ease: "easeInOut" }
                });

                // Small bounce/pause at each stop
                if (!isLast) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }
        }

        // 4. Drop into Chimney (Final Animation)
        await santaControls.start({
            y: "+=30",
            scale: 0,
            transition: { duration: 0.5 }
        });

        // 5. Complete
        setTimeout(() => {
            onComplete(winner);
            // Reset Santa for next time
            santaControls.set({ scale: 1, y: 0 });
        }, 500);
    };

    return (
        <div className="santa-game-container">
            {/* Santa Character */}
            <motion.img
                src={santaIcon}
                className="santa-character"
                animate={santaControls}
                initial={{ x: 20, y: 10 }} // Start top left
                alt="Santa"
            />

            <div className="chimney-track">
                {items.map((item, index) => {
                    const isPlayed = playedIds.includes(item.id);
                    const isCurrentTarget = activeIndex === index && isPlaying;
                    return (
                        <div
                            key={item.id}
                            ref={el => chimneyRefs.current[index] = el}
                            className={`chimney-box ${isPlayed ? 'is-played' : ''} ${isCurrentTarget ? 'winner' : ''}`}
                        >
                            <div className="chimney-content">
                                {isPlayed ? "❌" : index + 1}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SantaGame;
