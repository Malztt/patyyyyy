import { useState } from 'react';
import confetti from 'canvas-confetti';
import SantaGame from './components/SantaGame';
import LyricsModal from './components/LyricsModal';
import { lyrics } from './data/lyrics';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState(null);
  const [playedIds, setPlayedIds] = useState([]);

  const handleStartClick = () => {
    if (!isPlaying) {
      setResult(null); // Clear previous result
      setIsPlaying(true);
    }
  };

  const handleGameComplete = (winningItem) => {
    setIsPlaying(false);
    setResult(winningItem);

    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D32F2F', '#1976D2', '#FFC107', '#FFFFFF']
    });
  };

  const handleModalClose = () => {
    if (result) {
      setPlayedIds(prev => [...prev, result.id]);
    }
    setResult(null);
  };

  const isGameFinished = playedIds.length === lyrics.length;

  return (
    <div className="app-container">
      <div className="background-effects"></div>

      <header className="header">
        <h1>🎄 Merry Christmas & Happy New Year 🎅</h1>
        <p>ช่วยซานต้าส่งของขวัญ... ลุ้นรับเพลงฟรี!</p>
      </header>

      <main className="game-area">
        <SantaGame
          items={lyrics}
          playedIds={playedIds}
          onComplete={handleGameComplete}
          isPlaying={isPlaying}
        />

        <div className="controls">
          <button
            className="spin-btn"
            onClick={handleStartClick}
            disabled={isPlaying || isGameFinished}
          >
            {isPlaying ? 'ซานต้ากำลังเดิน...' : isGameFinished ? 'แจกครบแล้ว!' : 'เริ่มเดินแจกของ!'}
          </button>
        </div>
      </main>

      {/* Result Modal */}
      <LyricsModal
        result={result}
        onClose={handleModalClose}
      />

      <footer className="footer">
        <p>© 2025 Christmas & New Year Party Game</p>
      </footer>
    </div>
  );
}

export default App;
