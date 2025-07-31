document.addEventListener("DOMContentLoaded", () => {
    // Retrieve score and total questions from localStorage
    const quizScore = localStorage.getItem("quizScore");
    const totalQuestions = localStorage.getItem("totalQuestions");
  
    // Find elements to update
    const correctAnswersElem = document.querySelector(".correct-answers b");
    const totalQuestionsElem = document.querySelector(".total-questions");
  
    // Update the score and total questions display, with fallbacks
    correctAnswersElem.textContent = quizScore !== null ? quizScore : 0;
    totalQuestionsElem.textContent = totalQuestions !== null ? `out of ${totalQuestions}` : "out of 0";
  
    // Play Again button handler
    const playAgainBtn = document.querySelector(".play-again");
    playAgainBtn.addEventListener("click", () => {
      // Clear stored score & questions count if you want to reset cleanly
      localStorage.removeItem("quizScore");
      localStorage.removeItem("totalQuestions");
  
      // Redirect to quiz start page (change if your start page is named differently)
      window.location.href = "index.html";
    });
  });