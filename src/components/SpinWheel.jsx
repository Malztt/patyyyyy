import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import "./SpinWheel.css"; // We'll create this for specific wheel styles

const SpinWheel = ({ items, onSpinComplete, isSpinning }) => {
    const controls = useAnimation();
    const [rotation, setRotation] = useState(0);

    if (items.length === 0) {
        return <div className="wheel-container"><div className="wheel-empty">🎉 ครบแล้ว! 🎉</div></div>;
    }

    useEffect(() => {
        if (isSpinning) {
            startSpin();
        }
    }, [isSpinning]);

    const startSpin = async () => {
        // Calculate a random landing spot (extra spins + random segment)
        // 360 * 5 (5 full spins) + random degree
        const randomDegree = Math.floor(Math.random() * 360);
        const totalRotation = 360 * 8 + randomDegree;

        // Animate
        await controls.start({
            rotate: rotation + totalRotation,
            transition: {
                duration: 5,
                ease: [0.15, 0.85, 0.35, 1], // Custom bezier for realistic slowdown
                type: "tween"
            }
        });

        setRotation(rotation + totalRotation);

        // Calculate winning item based on angle
        // Normalize angle to 0-360
        const normalizedRotation = (rotation + totalRotation) % 360;
        // In CSS rotation, 0 is usually at 3 o'clock or 12 o'clock depending on start.
        // Let's assume 0 is top. The pointer is usually at top.
        // If we rotate CLOCKWISE, the segment at the pointer changes in reverse order.

        // Number of segments
        const segmentSize = 360 / items.length;
        // Calculate index.
        // E.g. if we rotated 10 degrees, the pointer (at top, 0) is now pointing at 350 deg on the wheel circle conceptually?
        // Actually, if wheel rotates 90 deg clockwise, the segment at 270 deg (originally) is now at 0 deg (top).
        // Formula: (360 - (normalizedRotation % 360)) % 360 / segmentSize

        const winningAngle = (360 - normalizedRotation) % 360;
        const winningIndex = Math.floor(winningAngle / segmentSize);

        onSpinComplete(items[winningIndex]);
    };

    return (
        <div className="wheel-container">
            <div className="pointer"></div>
            <motion.div
                className="wheel"
                animate={controls}
                style={{
                    background: `conic-gradient(
            ${items.map((item, index) => {
                        const start = (index * 100) / items.length;
                        const end = ((index + 1) * 100) / items.length;
                        const color = index % 2 === 0 ? '#FFD700' : '#FF4500'; // Gold & OrangeRed
                        return `${color} ${start}% ${end}%`;
                    }).join(', ')}
          )`
                }}
            >
                {items.map((item, index) => {
                    const rotation = (360 / items.length) * index + (360 / items.length) / 2;
                    return (
                        <div
                            key={item.id}
                            className="wheel-segment-content"
                            style={{ transform: `rotate(${rotation}deg) translateY(-140px)` }}
                        >
                            <span className="segment-text">{index + 1}</span>
                        </div>
                    );
                })}
            </motion.div >
        </div >
    );
};

export default SpinWheel;
