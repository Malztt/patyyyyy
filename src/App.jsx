import { useState } from 'react';
import confetti from 'canvas-confetti';
import SpinWheel from './components/SpinWheel';
import LyricsModal from './components/LyricsModal';
import { lyrics } from './data/lyrics';
import './App.css';

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [availableItems, setAvailableItems] = useState(lyrics);

  const handleSpinClick = () => {
    if (!isSpinning) {
      setResult(null); // Clear previous result
      setIsSpinning(true);
    }
  };

  const handleSpinComplete = (winningItem) => {
    setIsSpinning(false);
    setResult(winningItem);
    setAvailableItems(prev => prev.filter(item => item.id !== winningItem.id));

    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF4500', '#FFFFFF', '#C44569']
    });
  };

  return (
    <div className="app-container">
      <div className="background-effects"></div>

      <header className="header">
        <h1>🎉 New Year Karaoke 🎤</h1>
        <p>หมุนวงล้อเสี่ยงทาย... ร้องเพลงฉลองปีใหม่!</p>
      </header>

      <main className="game-area">
        <SpinWheel
          items={availableItems}
          onSpinComplete={handleSpinComplete}
          isSpinning={isSpinning}
        />

        <div className="controls">
          <button
            className="spin-btn"
            onClick={handleSpinClick}
            disabled={isSpinning || availableItems.length === 0}
          >
            {isSpinning ? 'กำลังหมุน...' : availableItems.length === 0 ? 'หมดแล้วจ้า' : 'หมุนเลย!'}
          </button>
        </div>
      </main>

      {/* Result Modal */}
      <LyricsModal
        result={result}
        onClose={() => setResult(null)}
      />

      <footer className="footer">
        <p>© 2025 New Year Party Game</p>
      </footer>
    </div>
  );
}

export default App;
