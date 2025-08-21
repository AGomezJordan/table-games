let players = [];
let currentSum = 0;
let currentPlayer = 0;
let finalScore = 100;
let nextSecondTime = false;

(() => {
  const playersSaved = localStorage.getItem('players');
  const finalScoreSaved = localStorage.getItem('finalScore');
  finalScore = finalScoreSaved ?? 100;
  if (playersSaved) {
    players = JSON.parse(playersSaved);
    startGame();
  }
})()

function onOpenPopUp (popUpId) {
  const popUp = document.getElementById(popUpId);
  if (popUp) {
    popUp.classList.remove('popup--closed');
    popUp.classList.add('popup--opened');
  }
}
function onClosePopUp (popUpId) {
  const popUp = document.getElementById(popUpId);
  if (popUp) {
    popUp.classList.remove('popup--opened');
    popUp.classList.add('popup--closed');
  }
}

function newGame() {
  players = [];
  onOpenPopUp('popupBackGround');
}

function saveNewPlayer () {
  const inputName = document.getElementById('player-name');
  const id = (typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
  players.push({
    id,
    name: inputName.value,
    score: 0,
  });

  const divPlayer = document.createElement('div');
  divPlayer.classList.add('player-data');
  const name = document.createElement('div');
  name.textContent = inputName.value;
  name.classList.add('player-item');
  
  const button = document.createElement('button');
  button.classList.add('button');
  button.textContent = "Eliminar";
  button.onclick = function() {
    removePlayer(id);
    divPlayer.remove();
    document.getElementById('player-count').innerText = players.length;
  };

  divPlayer.appendChild(name);
  divPlayer.appendChild(button);

  const playerList = document.getElementById('player-lists');
  playerList.appendChild(divPlayer);

  inputName.value = '';
  document.getElementById('player-count').innerText = players.length;
}

function removePlayer (playerId) {
  const index = players.findIndex(player => player.id === playerId);
  if (index !== -1) {
    players.splice(index, 1);
  }
}

function startGame() {
  nextSecondTime = false;
  onClosePopUp("popupBackGround");
  const container = document.getElementById('game-container');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const finalScoreLabel = document.getElementById('label-final-score');
  finalScoreLabel.textContent = finalScore;
  players.forEach((player) => {
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card');

    const playerName = document.createElement('div');
    playerName.classList.add('player-card--name');
    playerName.textContent = player.name;
    
    const playerScore = document.createElement('div');
    playerScore.classList.add('player-card--score');
    playerScore.textContent = player.score;

    playerCard.appendChild(playerName);
    playerCard.appendChild(playerScore);

    let type = '';
    if (player.score >= finalScore * 0.5 && player.score < finalScore * 0.8) {
      type = 'orange';
    } else if (player.score >= finalScore * 0.8 && player.score <= finalScore) {
      type = 'red';
    } else if (player.score > finalScore) {
      type = 'gray';
    }

    playerCard.classList.add(`player-card--${type}`)

    container.appendChild(playerCard);
  });

  localStorage.setItem('players', JSON.stringify(players));
  localStorage.setItem('finalScore', finalScore);
}

function endRound() {
  setCurrentPlayer();
  onOpenPopUp('popupFinRonda');
}

function restartPlayer() {
  const errorMessage = document.getElementById('error-message');
  const maxScore = Math.max(...players.map(p => p.score <= finalScore * 0.9 ? p.score : -Infinity));
  if (!isFinite(maxScore)) {
    errorMessage.style.display = 'block';
  } else {
    players[currentPlayer].score = maxScore;
    nextPlayer();
  }
}

function setCurrentPlayer() {
  const player = players[currentPlayer];
  const name = document.getElementById('round-name');
  name.textContent = player.name;
  
  const score = document.getElementById('round-score');
  score.textContent = player.score;

  const restarPlayer = document.getElementById('button-restart-player');
  const lessTen = document.getElementById('button-less-10');
  const inputSuma = document.getElementById('input-suma');
  inputSuma.value = 0;
  
  if (player.score > finalScore) {
    restarPlayer.style.display = "block";
    inputSuma.style.display = "none";
    lessTen.style.display = "none";
    nextSecondTime = false;
  } else {
    inputSuma.style.display = "block";
    lessTen.style.display = "block";
    restarPlayer.style.display = "none";
    nextSecondTime = false;
  }
}

function setSum(val) {
  if (val) {
    const player = players[currentPlayer];
    currentSum = val !== 'reset' ? parseInt(val) : -parseInt(player.score);
    const score = document.getElementById('round-score');
    score.textContent = "";
    score.textContent = parseInt(player.score) + currentSum;
  }
}

function setFinalScore(score) {
  const currentSelected = document.getElementsByClassName('button button--selected');
  if (currentSelected.length) {
    currentSelected[0].classList.remove('button--selected');
  }
  const button = document.getElementById(`button_score--${score}`);
  if (button) {
    button.classList.add('button--selected');
  }
  finalScore = score;
}

function nextPlayer() {
  const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
  players[currentPlayer].score += currentSum;
  currentSum = 0;
  
  if (currentPlayer == players.length - 1 && (players[currentPlayer].score <= finalScore || !nextSecondTime)) {
    onClosePopUp('popupFinRonda');
    startGame();
    currentPlayer = 0;
  } else {
    sum = players[currentPlayer].score > finalScore && nextSecondTime ? 0 : 1;
    currentPlayer += sum;
    setCurrentPlayer();
  }
}