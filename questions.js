let questions =  
        {
            "frontend": [
                {
                    "question": "Which of the following is a popular frontend framework?",
                    "choices" : ["Django", "React", "Flask", "Express"],
                    "answer": "React"
                },
                {
                    "question": "CSS is used for?",
                    "choices": ["Structuring the webpage", "Styling the webpage", "Running scripts", "Database management"],
                    "answer": "Styling the webpage"
                },
                {
                    "question": "Which HTML element is used for the largest heading?",
                    "choices": ["<h6>", "<heading>", "<h1>", "<head>"],
                    "answer": "<h1>"
                },
                {
                    "question": "Flexbox is primarily used for?",
                    "choices": ["Styling tables", "Positioning elements", "Connecting databases", "Handling HTTP requests"],
                    "answer": "Positioning elements"
                },
                {
                    "question": "Which attribute is used to make an input field mandatory in HTML?",
                    "choices": ["required", "mandatory", "needed", "must"],
                    "answer": "required"
                }
            ]
            
        }


const questionTitle = document.getElementById('question-title');
const choicesUL = document.querySelector('.quiz-choices');
const nextBtn = document.querySelector('.next-btn');
const qCounter = document.querySelector('.question-counter');

const progressBarFull = document.querySelector('.progressbar-full');
const timeDuration = document.querySelector('.time-duration');

const totalQuestions = questions.frontend.length;
let currentIndex = 0;
let score = 0;

const timePerQuestion = 15; // seconds per question
let timeLeft = timePerQuestion;
let timerInterval = null;

/**
 * Render a question and its choices.
 * @param {number} idx Index of question to render.
 */
function renderQuestion(idx) {
    const q = questions.frontend[idx];
    questionTitle.textContent = q.question;
    
    // Clear old choices
    choicesUL.innerHTML = '';
    choicesUL.usedForScoring = false; // Reset scoring flag for this question

    // Reset usedForScoring flag for this question render cycle
    choicesUL.usedForScoring = false;

    q.choices.forEach((choice, i) => {
        const li = document.createElement("li");
        li.className = "choice-option";

        const label = document.createElement("label");
        label.setAttribute("for", "choice" + i );

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "choices";
        input.value = choice;
        input.id = 'choice' + i;

        // Feedback icon span inside label (initially empty)
        const iconSpan = document.createElement("span");
        iconSpan.className = "material-symbols-outlined feedback-icon";
        iconSpan.setAttribute("aria-hidden", "true");
        iconSpan.textContent = ""; // no icon initially

        // Append input, text, icon to label
        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + choice));
        label.appendChild(iconSpan);

        li.appendChild(label);
        choicesUL.appendChild(li);
    
        //  Add event listener to each input to handle selection
        input.addEventListener("change", () => {
            nextBtn.style.display = "inline-flex"; // show next button
            showFeedback(input.value, q.answer);
            disableInputs(); //  prevent changing after answer selected
            stopTimer(); // Stop timer once user has answered
    });
});
        // Update counter and progress bar
        qCounter.innerHTML = `<b>${idx+1}</b> of <b>${totalQuestions}</b> Questions`;
        updateProgressBar();

        // Hide Next button until an answer is selected
        nextBtn.style.display = "none";

        // Enable inputs for new question
        enableInputs();

        // Reset and start timer for new question
        startTimer();
}

/**
 * Show feedback icons and highlight correct/incorrect choices.
 * @param {string} selectedValue - User selected choice.
 * @param {string} correctAnswer - The correct answer string.
 */

function showFeedback(selectedValue, correctAnswer) {
    const allOptions = choicesUL.querySelectorAll("li.choice-option");

    // Clear previous highlights and icons
    allOptions.forEach((li) => {
      const icon = li.querySelector(".feedback-icon");
      // Clear all icons and classes initially
      icon.textContent = "";
      li.classList.remove("correct", "incorrect");
    });

     // Mark correct answer only once
    allOptions.forEach((li) => {
    const input = li.querySelector("input");
    const icon = li.querySelector(".feedback-icon");
      if (input.value === correctAnswer) {
        // Mark correct choice
        li.classList.add("correct");
        icon.textContent = "check_circle";
      }
    });

    // Mark selected incorrect answer (if incorrect)
    if (selectedValue !== correctAnswer) {
        allOptions.forEach((li) => {
          const input = li.querySelector("input");
          const icon = li.querySelector(".feedback-icon");
          if (input.value === selectedValue) {
            li.classList.add("incorrect");
            icon.textContent = "cancel";
          }
        });
      }

     // Increment score once, only if correct answer selected this question
    if (selectedValue === correctAnswer && !choicesUL.usedForScoring) {
        score++;
         // Mark this render cycle as scored to prevent double increments on re-selects (see next note)
         choicesUL.usedForScoring = true;
    }
  }

  // Disable all inputs after selection to prevent changing answer
function disableInputs() {
    const inputs = choicesUL.querySelectorAll("input[type='radio']");
    inputs.forEach((input) => {
      input.disabled = true;
    });
}

/**
 * Enable all radio inputs (for new question).
 */
function enableInputs() {
    const inputs = choicesUL.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => input.disabled = false);
  }

  /**
 * Update the progress bar according to current question index
 */
function updateProgressBar() {
    const progressPercent = (currentIndex / totalQuestions) * 100;
    progressBarFull.style.width = progressPercent + '%';
  }
  
  /**
   * Start or restart the countdown timer for the current question
   */
  function startTimer() {
    timeLeft = timePerQuestion;
    timeDuration.textContent = `${timeLeft}s`;
  
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
  
    timerInterval = setInterval(() => {
      timeLeft--;
      timeDuration.textContent = `${timeLeft}s`;
  
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeDuration.textContent = '0s';
        // Auto move to next question on timeout
        autoAdvanceAfterTimeout();
      }
    }, 1000);
  }
  
  /**
   * Stop the countdown timer (called after user answers)
   */
  function stopTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
  }
  
/**
 * Automatically advance quiz when timer reaches 0
 * If no answer was selected, treat as skipped/no score increment
 * Shows feedback for correct answer
 */
function autoAdvanceAfterTimeout() {
    // Disable inputs to prevent late selection
    disableInputs();
  
    // Show correct answer feedback anyway
    showFeedback('', questions.frontend[currentIndex].answer);
    nextBtn.style.display = 'inline-flex'; // show Next button so user can proceed
  
    // Optional: you can auto-advance after delay here if desired,
    // or leave to user to click Next.
  }
  

    /**
    * Handle clicking the Next button:
    * - Move to the next question if any,
    * - Otherwise redirect to score.html with score saved.
    */
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex < totalQuestions) {
            enableInputs();      // <<< Important fix to enable radios for new question
            renderQuestion(currentIndex);
        } else {
        // Save the results in localStorage
        localStorage.setItem("quizScore", score);
        localStorage.setItem("totalQuestions", totalQuestions);

        // Redirect to score.html
        window.location.href = "score.html";  
    }
});

// Initial render
renderQuestion(currentIndex);
