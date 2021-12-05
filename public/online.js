import Check from "./check.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

// Document Elements
const gridElement = document.getElementById("grid");
const replayElement = document.getElementById("replay");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const player1Text = document.getElementById("player1-text");
const player2Text = document.getElementById("player2-text");
const player1Score = document.getElementById("player1-score");
const player2Score = document.getElementById("player2-score");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");

const MATRIX = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let STARTED = false;
let PLAYER_CURRENT = 1;
let PLAYER_ONE_SCORE = 0;
let PLAYER_TWO_SCORE = 0;
let DRAW = false;
let THIS_PLAYER = {
  username: "",
  room_id: "",
  number: 0,
};

// Initials
THIS_PLAYER = {
  ...Qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }),
};

socket.emit("login", THIS_PLAYER);

socket.on("message", (msg) => {
  console.log(msg);
});

player1Text.innerHTML = THIS_PLAYER.username;

// Event Listeners
replayElement.addEventListener("click", () => {
  reset(MATRIX);
  draw(MATRIX);
});

// Socket
socket.emit("login", "USER LOGGED IN");

const update = () => {
  // check win
  if (PLAYER_ONE_SCORE > PLAYER_TWO_SCORE) {
    overlay.style.display = "flex";
    message.innerHTML = "PLAYER 1 WINS";
  }
  if (PLAYER_TWO_SCORE > PLAYER_ONE_SCORE) {
    overlay.style.display = "flex";
    message.innerHTML = "PLAYER 2 WINS";
  }
  if (DRAW) {
    overlay.style.display = "flex";
    message.innerHTML = "It's a draw";
  }
  if (!STARTED) {
    overlay.style.display = "none";
    message.innerHTML = "";
  }

  // Display score
  player1Score.innerHTML = PLAYER_ONE_SCORE;
  player2Score.innerHTML = PLAYER_TWO_SCORE;

  // Change appearance
  if (PLAYER_CURRENT === 1) {
    player1.style.color = "orange";
    player2.style.color = "white";
  }
  if (PLAYER_CURRENT === 2) {
    player1.style.color = "white";
    player2.style.color = "orange";
  }
};

const reset = (MATRIX) => {
  for (let i = 0; i < MATRIX.length; i++) {
    for (let j = 0; j < MATRIX[i].length; j++) {
      MATRIX[i][j] = 0;
      document.getElementById(`${i}-${j}`).innerHTML = ``;
    }
  }

  STARTED = false;
  PLAYER_CURRENT = 1;
  PLAYER_ONE_SCORE = 0;
  PLAYER_TWO_SCORE = 0;
  DRAW = false;

  update();
};

const draw = (MATRIX) => {
  for (let i = 0; i < MATRIX.length; i++) {
    for (let j = 0; j < MATRIX[i].length; j++) {
      switch (MATRIX[i][j]) {
        case 0:
          document.getElementById(`${i}-${j}`).innerHTML = ``;
          break;

        case 1:
          document.getElementById(`${i}-${j}`).innerHTML = `<h1>x</h1>`;
          break;

        case 2:
          document.getElementById(`${i}-${j}`).innerHTML = `<h1>o</h1>`;
          break;

        default:
          break;
      }
    }
  }
};

const register = (pos, PLAYER_CURRENT, MATRIX) => {
  let row, col, win;
  row = pos[0];
  col = pos[1];
  if (MATRIX[row][col] === 0) {
    MATRIX[row][col] = PLAYER_CURRENT;
  }

  win = Check.check(MATRIX, PLAYER_CURRENT);

  if (win === 1) {
    PLAYER_ONE_SCORE++;
  } else if (win === 2) {
    PLAYER_TWO_SCORE++;
  } else if (win === 3) {
    DRAW = true;
  }

  draw(MATRIX);
};

// Callback
const click = (e) => {
  STARTED = true;
  let pos;
  pos = e.target.id.split("-");

  if (PLAYER_CURRENT === 1) {
    register(pos, PLAYER_CURRENT, MATRIX);
    PLAYER_CURRENT = 2;
    update();
  } else if (PLAYER_CURRENT === 2) {
    register(pos, PLAYER_CURRENT, MATRIX);
    PLAYER_CURRENT = 1;
    update();
  }
};

// Create the grid add the interactivity
const start = () => {
  for (let i = 0; i < 3; i++) {
    let row;
    row = document.createElement("div");
    row.setAttribute("id", `${i}`);
    row.classList.add("row");
    for (let j = 0; j < 3; j++) {
      let col;
      col = document.createElement("div");
      col.setAttribute("id", `${i}-${j}`);
      col.classList.add("container");
      col.addEventListener("click", (e) => click(e));
      row.appendChild(col);
    }
    gridElement.appendChild(row);
  }
  update();
};

start();
