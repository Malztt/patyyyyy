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

      <div className="background-effects"></div>

      <main className="game-area">
        <header className="header">
          <h1>Karaoke Game</h1>
        </header>

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

        <footer className="footer-copyright">
          <p>© 2025 Christmas & New Year Party Game</p>
        </footer>
      </main>

      {/* Result Modal */}
      <LyricsModal
        result={result}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default App;
