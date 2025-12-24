// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./HorizontalSpinner.css";

const ITEM_WIDTH = 250;
const ITEM_GAP = 0;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_GAP;

const HorizontalSpinner = ({ items, playedIds = [], onSpinComplete, isSpinning }) => {
    const controls = useAnimation();
    const containerRef = useRef(null);
    const [displayItems, setDisplayItems] = useState([]);

    // We need a lot of items for the spin effect to look infinite
    // Re-generate displayItems when items change (e.g. one removed)
    useEffect(() => {
        if (items.length === 0) return;

        // Create a long list: [Buffer, ...Items, ...Items (Spin Area), Target, ...Items, Buffer]
        // Actually, just repeating the list many times is enough.
        // Let's say we want to spin for ~5 seconds. Speed ~2000px/s? -> 10000px distance.
        // 10000 / 175 ~ 57 items.
        // 14 items * 5 sets = 70 items. Enough.

        // Ensure plenty of runway even if items.length is small (e.g. 1 or 2 items)
        // We need enough items to cover the animation start index (target + 80)
        // Safe bet: Ensure at least 300 total items in the strip.
        const minTotalItems = 300;
        const calculatedRepeats = Math.ceil(minTotalItems / items.length);
        const repeats = Math.max(20, calculatedRepeats);

        const newDisplayItems = [];
        for (let i = 0; i < repeats; i++) {
            newDisplayItems.push(...items);
        }
        setDisplayItems(newDisplayItems);

        // Force reset position instantly to prevent backwards drift
        controls.set({ x: 0 });

    }, [items, controls]);

    useEffect(() => {
        if (isSpinning && items.length > 0) {
            spin();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSpinning]);

    const spin = async () => {
        if (!containerRef.current) return;

        // Filter out played items to find candidates
        const candidates = items.filter(item => !playedIds.includes(item.id));

        if (candidates.length === 0) return;

        // Random winner from CANDIDATES
        const winnerIndexInCandidates = Math.floor(Math.random() * candidates.length);
        const winner = candidates[winnerIndexInCandidates];

        // Find the index of this winner in the ORIGINAL items list
        // This is crucial for alignment. The list structure is constant.
        const winnerIndex = items.findIndex(item => item.id === winner.id);

        // Ensure we land on this winner in the "middle" of our long list
        // Let's pick a target index somewhere deep in the list, e.g., 50% - 70% in.
        // Make sure the target has the same ID as winner.

        // Current logic: Find an instance of winner near index 40 (arbitrary "far enough" point)
        // items.length = 14. 3 sets = 42.
        // Let's aim for the 10th set of items.
        const targetSet = 10;
        const targetIndex = (targetSet * items.length) + winnerIndex;

        // Calculate exact X position to center this item.
        // Center of Container - Center of Item = TranslateX
        const containerWidth = containerRef.current.offsetWidth;
        const centerOffset = containerWidth / 2;
        // itemCenter = (TOTAL_ITEM_WIDTH * targetIndex) + (ITEM_WIDTH / 2); (inline usage below)

        // We want: TranslateX + itemCenter = centerOffset
        // TranslateX = centerOffset - itemCenter
        // NOTE: If moving Left -> Right visually, the track must move Right.
        // So we start at a negative X (far left) and move to positive? 
        // OR we start at 0 and move strictly negative (Right to Left items).

        // USER REQUEST: "ซ้ายไปขวาอ่ะ" (Left to Right).
        // Interpretation A: Items flow --> (Scan Line moves <--)
        // Interpretation B: Items flow <-- (Scan Line moves -->) "Standard Reading".
        // Usually, forcing items to move Left->Right means the STRIP moves Left->Right.
        // Start X: -TotalLength. End X: Target.

        // Let's assume Standard Slot Machine: Items fly by from Top to Bottom (or Right to Left).
        // If user wants "Left to Right", maybe they mean the flow of items is L->R.
        // So index 0 is at Left, Index N is at Right ... and we scroll to show N?
        // No, "Motion".
        // Let's implement track moving POSITIVE X. (Start big negative, end at target).
        // Target is closer to 0. Start is far negative.

        // Target Position (Visual Center):
        // X = centerOffset - itemCenter
        // If item is at index 140 (very far right of strip start), itemCenter is huge positive.
        // X will be huge negative.
        // So we are currently looking at index 140.

        // To animate "L -> R flow", we should start looking at index "Total" and move to index "0"?
        // No, that's R -> L motion.
        // Start looking at Index 0. Move to Index 100.
        // Viewport moves Right. Strip moves LEFT. (X becomes more negative).
        // This makes items appear to come from Right and move Left.

        // "Left to Right" Request: Items appear from Left and move Right.
        // Strip must move RIGHT. (X increases).
        // So we must start at a deep index (High Negative X) and move to a lower index (Less Negative / Positive X).

        // Start: Target Index + Buffer (e.g. +50 items).
        // End: Target Index.

        // Let's Start at Index: targetIndex + 80.
        // End at Index: targetIndex.

        const startItemIndex = targetIndex + 80; // 80 items "ahead" -> Super Faster speed
        const startX = centerOffset - ((TOTAL_ITEM_WIDTH * startItemIndex) + (ITEM_WIDTH / 2));

        const endX = centerOffset - ((TOTAL_ITEM_WIDTH * targetIndex) + (ITEM_WIDTH / 2));

        // Reset to start position immediately
        await controls.start({
            x: startX,
            transition: { duration: 0 }
        });

        // Animate to end position
        await controls.start({
            x: endX,
            transition: {
                duration: 2.5, // Super Fast (was 3.5)
                ease: [0.22, 1, 0.36, 1] // cubicOut (Fast start, smooth deceleration)
            }
        });

        onSpinComplete(winner);
    };

    if (items.length === 0) {
        return (
            <div className="spinner-container">
                <div className="spinner-empty">🎉 ครบแล้ว! 🎉</div>
            </div>
        );
    }

    return (
        <div className="spinner-container" ref={containerRef}>
            <div className="spinner-marker"></div>
            <motion.div
                className="spinner-track"
                animate={controls}
                initial={{ x: 0 }}
            >
                {displayItems.map((item, index) => {
                    const isPlayed = playedIds.includes(item.id);
                    return (
                        <div
                            key={`${item.id}-${index}`}
                            className={`spinner-item ${isPlayed ? 'is-played' : ''}`}
                        >
                            {item.song}
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default HorizontalSpinner;
