// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X, Music } from "lucide-react";
import "./LyricsModal.css";

const LyricsModal = ({ result, onClose }) => {
    if (!result) return null;

    return (
        <div className="modal-overlay">
            <motion.div
                className="modal-content"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
            >
                <button className="close-btn" onClick={onClose}>
                    <X size={24} color="#fff" />
                </button>

                <div className="modal-header">
                    <Music size={48} className="music-icon" />
                    <h2>{result.song}</h2>
                </div>

                <div className="song-info">
                    <p className="artist">ศิลปิน: {result.artist}</p>
                </div>

                <div className="lyrics-box">
                    <p>"{result.snippet}"</p>
                </div>

                <button className="action-btn" onClick={onClose}>
                    ปิด (เริ่มใหม่)
                </button>
            </motion.div>
        </div>
    );
};

export default LyricsModal;
