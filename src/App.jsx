import { useState } from 'react';
import confetti from 'canvas-confetti';
import HorizontalSpinner from './components/HorizontalSpinner';
import LyricsModal from './components/LyricsModal';
import SurvivorGame from './components/SurvivorGame';
import { lyrics } from './data/lyrics';
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState('menu'); // 'menu', 'karaoke', 'survivor'

  // Karaoke State
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [playedIds, setPlayedIds] = useState([]);

  // Karaoke Handlers
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

  const renderMenu = () => (
    <div className="menu-container">
      <h1 className="menu-title">Party Games 2025</h1>
      <div className="menu-grid">
        <button className="menu-card karaoke" onClick={() => setGameMode('karaoke')}>
          <span className="icon">🎤</span>
          <h3>Karaoke Random</h3>
          <p>สุ่มเพลงร้องคาราโอเกะ</p>
        </button>
        <button className="menu-card survivor" onClick={() => setGameMode('survivor')}>
          <span className="icon">💀</span>
          <h3>Survivor Game</h3>
          <p>เกมวัดดวง คัดคนออก</p>
        </button>
      </div>
      <footer className="footer-copyright">
        <p>© 2025 Recruitment Team</p>
      </footer>
    </div>
  );

  const renderKaraoke = () => (
    <div className="game-wrapper">
      <div className="game-header-nav">
        <button className="back-nav-btn" onClick={() => setGameMode('menu')}>← Menu</button>
      </div>
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
          <p>© 2025 Recruitment Team</p>
        </footer>
      </main>

      {/* Result Modal */}
      <LyricsModal
        result={result}
        onClose={handleModalClose}
      />
    </div>
  );

  return (
    <div className="app-container">
      <div className="background-effects"></div>

      {gameMode === 'menu' && renderMenu()}
      {gameMode === 'karaoke' && renderKaraoke()}
      {gameMode === 'survivor' && <SurvivorGame onBack={() => setGameMode('menu')} />}
    </div>
  );
}

export default App;
