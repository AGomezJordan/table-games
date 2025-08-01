let players = [];
let currentSum = 0;
let currentPlayer = 0;

(() => {
  const playersSaved = localStorage.getItem('players');
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
    console.log({ players })
  };

  divPlayer.appendChild(name);
  divPlayer.appendChild(button);

  const playerList = document.getElementById('player-lists');
  playerList.appendChild(divPlayer);

  inputName.value = '';
  document.getElementById('player-count').innerText = players.length;
}

function removePlayer (playerId) {
  console.log('ELIMINADO: ', playerId)
  const index = players.findIndex(player => player.id === playerId);
  if (index !== -1) {
    players.splice(index, 1);
  }
}

function startGame() {
  onClosePopUp("popupBackGround");
  const container = document.getElementById('game-container');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
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

    container.appendChild(playerCard);
  });

  localStorage.setItem('players', JSON.stringify(players));
}

function endRound() {
  setCurrentPlayer();
  onOpenPopUp('popupFinRonda');
}

function setCurrentPlayer() {
  const player = players[currentPlayer];
  const name = document.getElementById('round-name');
  name.textContent = player.name;
  
  const score = document.getElementById('round-score');
  score.textContent = player.score;

  const inputSuma = document.getElementById('input-suma');
  inputSuma.value = 0;
}

function setSum(val) {
  currentSum = parseInt(val);
  const player = players[currentPlayer];
  const score = document.getElementById('round-score');
  score.textContent = "";
  score.textContent = parseInt(player.score) + currentSum;
}

function nextPlayer() {
  players[currentPlayer].score += currentSum;
  
  if (currentPlayer == players.length - 1) {
    onClosePopUp('popupFinRonda');
    startGame();
    currentPlayer = 0;
    currentSum = 0;
  } else {
    currentPlayer += 1;
    setCurrentPlayer();
  }
}