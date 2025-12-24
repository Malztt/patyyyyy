import { useState } from 'react';
import confetti from 'canvas-confetti';
import HorizontalSpinner from './components/HorizontalSpinner';
import LyricsModal from './components/LyricsModal';
import { lyrics } from './data/lyrics';
import './App.css';

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [playedIds, setPlayedIds] = useState([]);

  const handleSpinClick = () => {
    if (!isSpinning) {
      setResult(null); // Clear previous result
      setIsSpinning(true);
    }
  };

  const handleSpinComplete = (winningItem) => {
    setIsSpinning(false);
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
        <p>หมุนวงล้อเสี่ยงทาย... รับของขวัญและร้องเพลงฉลอง!</p>
      </header>

      <main className="game-area">
        <HorizontalSpinner
          items={lyrics}
          playedIds={playedIds}
          onSpinComplete={handleSpinComplete}
          isSpinning={isSpinning}
        />

        <div className="controls">
          <button
            className="spin-btn"
            onClick={handleSpinClick}
            disabled={isSpinning || isGameFinished}
          >
            {isSpinning ? 'กำลังหมุน...' : isGameFinished ? 'หมดแล้วจ้า' : 'หมุนเลย!'}
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
