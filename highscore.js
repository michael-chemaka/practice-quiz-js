document.addEventListener("DOMContentLoaded", () => {
    // Get stored high score or 0 if none
    const highScore = localStorage.getItem('highScore') || 0;
  
    // Find an element to display high score (create in your HTML)
    const highScoreDisplay = document.getElementById('high-score-display');
  
    if (highScoreDisplay) {
      highScoreDisplay.textContent = `Highest Score: ${highScore}`;
    }
  });