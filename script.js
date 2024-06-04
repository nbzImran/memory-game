const gameContainer = document.getElementById("game");
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const timerDisplay = document.getElementById('countup');
const scoreCount = document.getElementById('score');
const bestScoreDisplay = document.getElementById('bestScore');

const Images = [
 "url('https://orig00.deviantart.net/1d9a/f/2012/146/e/9/random_animation_by_neutronicsoup-d516kdp.gif')",
  "url('https://mir-s3-cdn-cf.behance.net/project_modules/disp/d9ad3144443361.5607795b1e28e.gif')",
   "url('https://payload345.cargocollective.com/1/0/19261/9211166/eagle4th.gif')",
    "url('https://i.pinimg.com/originals/fe/32/9a/fe329a458213bf1daeec3fb25e9fafda.gif')",
     "url('https://th.bing.com/th/id/R.8297d02d7ec257889766acc6ded438f8?rik=DioMOqlayioC5Q&riu=http%3a%2f%2fclipart-library.com%2fnewhp%2f333-3331136_cartoon-clipart-png-download-random-object-battle-royal.png&ehk=GBoH1jMzfsvoMPgpNU5KqIsodTQmjR0MCJDuX3MFIMI%3d&risl=&pid=ImgRaw&r=0')",
 "url('https://orig00.deviantart.net/1d9a/f/2012/146/e/9/random_animation_by_neutronicsoup-d516kdp.gif')",
  "url('https://mir-s3-cdn-cf.behance.net/project_modules/disp/d9ad3144443361.5607795b1e28e.gif')",
   "url('https://payload345.cargocollective.com/1/0/19261/9211166/eagle4th.gif')",
    "url('https://i.pinimg.com/originals/fe/32/9a/fe329a458213bf1daeec3fb25e9fafda.gif')",
     "url('https://th.bing.com/th/id/R.8297d02d7ec257889766acc6ded438f8?rik=DioMOqlayioC5Q&riu=http%3a%2f%2fclipart-library.com%2fnewhp%2f333-3331136_cartoon-clipart-png-download-random-object-battle-royal.png&ehk=GBoH1jMzfsvoMPgpNU5KqIsodTQmjR0MCJDuX3MFIMI%3d&risl=&pid=ImgRaw&r=0')"
];

let flippedCards = [];
let preventClick = false;
let timer;
let timeElapsed = 0;
let score = 0;

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledImages;

// Function to create divs for colors
function createDivsForImages(imageArray) {
  for (let image of imageArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add('card', 'hidden'); // Add 'hidden' class to hide cards
    newDiv.dataset.image = image  //store the image
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

// Function to handle card clicks
function handleCardClick(event) {
  if (preventClick) return;

  const clickedCard = event.target;

  if (!clickedCard.classList.contains('hidden') || flippedCards.includes(clickedCard)) {
    return;
  }

  clickedCard.classList.remove('hidden');
  clickedCard.style.backgroundImage = clickedCard.dataset.image;
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
    preventClick = true;
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.image === secondCard.dataset.image) {
      flippedCards = [];
      preventClick = false;
      updateScore(); // Update the score when a match is found

      // Check if all cards are matched
      if (document.querySelectorAll('.hidden').length === 0) {
        stopTimer();
        bestScoreUpdated();
        alert(`Congratulations! You've completed the game in ${timeElapsed} seconds with a score of ${score}.`);
      }
    } else {
      setTimeout(() => {
        firstCard.classList.add('hidden');
        secondCard.classList.add('hidden');
        firstCard.style.backgroundImage = '';
        secondCard.style.backgroundImage = '';
        flippedCards = [];
        preventClick = false;
      }, 1000);
    }
  }
}

// Function to start the game
function startTheGame() {
  shuffledImages = shuffle(Images); // Shuffle the cards

  gameContainer.innerHTML = ''; // Reset the game
  createDivsForImages(shuffledImages); // Create the cards

  // Reset the timer
  timeElapsed = 0;
  timerDisplay.textContent = `Time: ${timeElapsed}`;

  // Reset the score
  score = 0;
  scoreCount.textContent = `Score: ${score}`;
  
  // Start the timer and increase by one second
  timer = setInterval(function () {
    timeElapsed++;
    timerDisplay.textContent = `Time: ${timeElapsed}`;
  }, 1000);

  startButton.disabled = true; // Disable the start button
  restartButton.disabled = false; // Enable the restart button
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timer);
}

// Function to restart the game 
function restartTheGame() {
  stopTimer(); // Stop any ongoing timer
  gameContainer.innerHTML = ''; // Clear the game container
  flippedCards = []; // Reset flipped cards array
  preventClick = false; // Allow clicks again
  timerDisplay.textContent = `Time: 0`; // Reset the timer display
  scoreCount.textContent = `Score: 0`; // Reset the score display
  restartButton.disabled = true; // Disable the restart button
  startButton.disabled = false; // Enable the start button
}

// Function to update the score
function updateScore() {
  score += 10;
  scoreCount.textContent = `Score: ${score}`;
}

// Function to check and update the best score in localStorage
function bestScoreUpdated() {
  let bestScore = localStorage.getItem('bestScore');
  if (!bestScore || score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
  }
  bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
}

// Add event listeners to the buttons
startButton.addEventListener('click', startTheGame);
restartButton.addEventListener('click', restartTheGame);

// Initial state
restartButton.disabled = true; // Disable restart button initially
bestScoreUpdated(); // Display the best score on initial load
