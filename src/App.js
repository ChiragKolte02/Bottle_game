
import './App.css';
import React, { useState, useEffect } from 'react';


const ColorMatchingGame = () => {
  const allColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#FFA07A', '#87CEEB', '#98FB98', '#F0E68C',
    '#FFB6C1', '#ADD8E6', '#D2B48C'
  ];
  
  const colorNames = [
    'Red', 'Teal', 'Blue', 'Green', 'Yellow', 
    'Plum', 'Coral', 'Sky Blue', 'Mint', 'Khaki',
    'Pink', 'Light Blue', 'Tan'
  ];

  const [numberOfBottles, setNumberOfBottles] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);
  const [computerOrder, setComputerOrder] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showComputer, setShowComputer] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Get colors based on selected number
  const getGameColors = () => allColors.slice(0, numberOfBottles);
  const getGameColorNames = () => colorNames.slice(0, numberOfBottles);

  // Initialize the game
  const initializeGame = () => {
    const gameColors = getGameColors();
    
    // Create a shuffled copy of colors for computer
    const shuffled = [...gameColors].sort(() => Math.random() - 0.5);
    setComputerOrder(shuffled);
    
    // Create another shuffled copy for user's initial arrangement
    const userShuffled = [...gameColors].sort(() => Math.random() - 0.5);
    setUserOrder(userShuffled);
    
    setMatches(0);
    setAttempts(0);
    setGameWon(false);
    setShowComputer(false);
    setDragOverIndex(null);
    setGameStarted(true);
  };

  // Reset to setup screen
  const resetToSetup = () => {
    setGameStarted(false);
    setComputerOrder([]);
    setUserOrder([]);
    setMatches(0);
    setAttempts(0);
    setGameWon(false);
    setShowComputer(false);
    setDragOverIndex(null);
  };

  // Check matches whenever userOrder changes
  useEffect(() => {
    if (computerOrder.length > 0 && userOrder.length > 0) {
      let matchCount = 0;
      computerOrder.forEach((color, index) => {
        if (color === userOrder[index]) {
          matchCount++;
        }
      });
      setMatches(matchCount);
      
      if (matchCount === computerOrder.length) {
        setGameWon(true);
        setShowComputer(true);
      }
    }
  }, [userOrder, computerOrder]);

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    if (gameWon) return;
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('dragging');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (gameWon) return;

    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (sourceIndex === targetIndex) {
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...userOrder];
    [newOrder[sourceIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[sourceIndex]];
    setUserOrder(newOrder);
    setAttempts(prev => prev + 1);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDragOverIndex(null);
  };

  // Render bottle component
  const Bottle = ({ 
    color, 
    index, 
    isComputer = false, 
    isHidden = false,
    isDragging = false,
    isDragOver = false
  }) => (
    <div 
      className={`
        bottle 
        ${isComputer ? 'computer-bottle' : 'user-bottle'} 
        ${isHidden ? 'hidden' : ''}
        ${isDragging ? 'dragging' : ''}
        ${isDragOver ? 'drag-over' : ''}
        ${!isComputer && !isHidden ? 'draggable' : ''}
      `}
      style={{ backgroundColor: isHidden ? '#ccc' : color }}
      draggable={!isComputer && !gameWon && !isHidden}
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragEnter={(e) => handleDragEnter(e, index)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, index)}
      onDragEnd={handleDragEnd}
    >
      <div className="bottle-neck"></div>
      <div className="bottle-body">
        <div className="color-name">
          {isHidden ? '?' : getGameColorNames()[getGameColors().indexOf(color)]}
        </div>
      </div>
      {!isComputer && !isHidden && (
        <div className="drag-handle">↕</div>
      )}
    </div>
  );

  // Reveal computer's arrangement
  const revealComputerArrangement = () => {
    setShowComputer(true);
    setTimeout(() => {
      setShowComputer(false);
    }, 3000);
  };

  // Game setup screen
  if (!gameStarted) {
    return (
      <div className="game-container">
        <h1>Color Bottle Matching Game</h1>
        
        <div className="setup-screen">
          <div className="setup-card">
            <h2>Game Setup</h2>
            <div className="bottle-selection">
              <label htmlFor="bottle-count">
                Select Number of Bottles: <strong>{numberOfBottles}</strong>
              </label>
              <input
                id="bottle-count"
                type="range"
                min="3"
                max="13"
                value={numberOfBottles}
                onChange={(e) => setNumberOfBottles(parseInt(e.target.value))}
                className="bottle-slider"
              />
              <div className="slider-labels">
                <span>3 (Easy)</span>
                <span>8 (Medium)</span>
                <span>13 (Hard)</span>
              </div>
            </div>

            <div className="color-preview">
              <h3>Colors in this game:</h3>
              <div className="preview-colors">
                {getGameColors().map((color, index) => (
                  <div key={index} className="color-preview-item">
                    <div 
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="color-label">
                      {getGameColorNames()[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="difficulty-info">
              <div className="difficulty-card">
                <h4>🎯 Difficulty Levels</h4>
                <ul>
                  <li><strong>3-5 bottles:</strong> Easy - Good for beginners</li>
                  <li><strong>6-9 bottles:</strong> Medium - Balanced challenge</li>
                  <li><strong>10-13 bottles:</strong> Hard - Memory master test!</li>
                </ul>
              </div>
            </div>

            <button className="start-button" onClick={initializeGame}>
              Start Game with {numberOfBottles} Bottles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>Color Bottle Matching Game</h1>
      
      <div className="game-info-bar">
        <div className="game-stats">
          <span>Bottles: {numberOfBottles}</span>
          <span>Difficulty: 
            {numberOfBottles <= 5 ? ' Easy' : 
             numberOfBottles <= 9 ? ' Medium' : ' Hard'}
          </span>
        </div>
        <button className="setup-button" onClick={resetToSetup}>
          Change Settings
        </button>
      </div>

      <div className="game-instructions">
        <p>Match your bottle arrangement with the computer's hidden arrangement!</p>
        <p>Drag and drop bottles to swap positions. Get all {numberOfBottles} colors in the right positions to win!</p>
      </div>

      <div className="game-area">
        {/* Computer's Bottles - Hidden by default */}
        <div className="bottle-section">
          <div className="section-header">
            <h2>Computer's Arrangement</h2>
            <button 
              className="reveal-button"
              onClick={revealComputerArrangement}
              disabled={showComputer || gameWon}
            >
              {showComputer ? 'Revealed!' : `Peek (3s)`}
            </button>
          </div>
          <div className="bottles-row">
            {computerOrder.map((color, index) => (
              <div key={index} className="bottle-wrapper">
                <Bottle
                  color={color}
                  index={index}
                  isComputer={true}
                  isHidden={!showComputer && !gameWon}
                />
                <div className="position-number">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User's Bottles */}
        <div className="bottle-section">
          <h2>Your Arrangement</h2>
          <div className="bottles-row">
            {userOrder.map((color, index) => (
              <div key={index} className="bottle-wrapper">
                <Bottle
                  color={color}
                  index={index}
                  isDragOver={dragOverIndex === index}
                />
                <div className="position-number">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="game-status">
        <div className="status-info">
          <p><strong>Matches:</strong> {matches} out of {numberOfBottles}</p>
          <p><strong>Swaps:</strong> {attempts}</p>
        </div>

        <div className="message">
          {gameWon ? (
            <div className="win-message">
              🎉 Congratulations! You won! 🎉
              <div className="sub-message">
                All {numberOfBottles} bottles are in the correct positions!
                {attempts <= numberOfBottles * 2 && " Excellent memory!"}
                {attempts > numberOfBottles * 2 && attempts <= numberOfBottles * 4 && " Good job!"}
                {attempts > numberOfBottles * 4 && " Well done!"}
              </div>
            </div>
          ) : (
            <div className="match-message">
              {matches === 0 && "No matches yet. Drag bottles to swap positions!"}
              {matches === 1 && "Good! 1 bottle is in the correct position!"}
              {matches === 2 && "Great! 2 bottles are in the correct positions!"}
              {matches === 3 && "Excellent! 3 bottles are in the correct positions!"}
              {matches >= 4 && matches < numberOfBottles - 1 && `Awesome! ${matches} bottles are in the correct positions!`}
              {matches === numberOfBottles - 1 && `Almost there! ${matches} out of ${numberOfBottles} correct!`}
            </div>
          )}
        </div>

        <div className="game-controls">
          <button className="reset-button" onClick={initializeGame}>
            New Game
          </button>
          <button className="setup-button secondary" onClick={resetToSetup}>
            Change Bottle Count
          </button>
          <div className="drag-hint">
            💡 Hint: Drag the bottles to swap positions
          </div>
        </div>
      </div>

      {/* How to Play */}
      <div className="how-to-play">
        <h3>How to Play:</h3>
        <ul>
          <li><strong>Click and drag</strong> bottles to swap their positions</li>
          <li>Use the <strong>"Peek" button</strong> to temporarily see the computer's arrangement</li>
          <li>Watch the message above to see how many positions are correct</li>
          <li>Match all {numberOfBottles} colors in the correct positions to win!</li>
          <li>No visual hints on bottles - rely on the match counter and your memory!</li>
        </ul>
      </div>
    </div>
  );
};


export default ColorMatchingGame;


