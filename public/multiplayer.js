import Check from "./check.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

const player1Text = document.getElementById("player1-text");
const player2Text = document.getElementById("player2-text");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const replayElement = document.getElementById("replay");

// GAME MATRIX
const MATRIX = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let THIS_PLAYER = {
  username: "",
  room_id: "",
  score: 0,
  number: "",
  turn: false,
};

let THAT_PLAYER;

socket.on("connected", () => {
  socket.emit("dataExchange", THIS_PLAYER);
});

socket.on("playerOne", () => {
  THIS_PLAYER.number = 1;
  THIS_PLAYER.turn = true;
  player1Text.innerHTML = THIS_PLAYER.username;
  console.log("You are X");
});

socket.on("playerTwo", () => {
  THIS_PLAYER.number = 2;
  THIS_PLAYER.turn = false;
  player2Text.innerHTML = THIS_PLAYER.username;
  console.log("You are O");
});

socket.on("dataExchange", (opponent) => {
  THAT_PLAYER = opponent;

  if (THIS_PLAYER.number === 1) {
    player2Text.innerHTML = opponent.username;
  } else {
    player1Text.innerHTML = opponent.username;
  }
});

function setThisPlayer() {
  const userDetails = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  THIS_PLAYER.username = userDetails.username;
  THIS_PLAYER.room_id = userDetails.room_id;
  return;
}

function login() {
  socket.emit("login", THIS_PLAYER);
}

function attachListener() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      document.getElementById(`${i}-${j}`).addEventListener("click", (e) => {
        let pos = e.target.id.split("-");
        let row = pos[0];
        let col = pos[1];

        if (THIS_PLAYER.turn && MATRIX[row][col] === 0) {
          register(row, col, THIS_PLAYER.number);
          postMove(pos, THIS_PLAYER.number);
          draw();
          checkWin();
        }
      });
    }
  }
}

const register = (row, col, number) => {
  MATRIX[row][col] = number;
};

const draw = () => {
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

const checkWin = () => {
  let win = Check.check(MATRIX, THIS_PLAYER.number);
  socket.emit("win", win);
};

const postMove = (pos, number) => {
  THIS_PLAYER.turn = false;
  return socket.emit("move", { pos, number });
};

socket.on("move", (data) => {
  let row = data.pos[0];
  let col = data.pos[1];
  register(row, col, data.number);
  draw();
  THIS_PLAYER.turn = true;
});

socket.on("win", (win) => {
  console.log(win, parseInt(THIS_PLAYER.number));
  console.log(win, parseInt(THAT_PLAYER.number));

  if (win == parseInt(THIS_PLAYER.number)) {
    overlay.style.display = "flex";
    message.innerHTML = `${THIS_PLAYER.username} wins`;
  } else if (win == parseInt(THAT_PLAYER.number)) {
    overlay.style.display = "flex";
    message.innerHTML = `${THAT_PLAYER.username} wins`;
  } else if (win == 3) {
    console.log("It's a draw");
  }
});

replayElement.addEventListener("click", () => {
  socket.emit("reset");
});

const reset = () => {
  for (let i = 0; i < MATRIX.length; i++) {
    for (let j = 0; j < MATRIX[i].length; j++) {
      MATRIX[i][j] = 0;
      document.getElementById(`${i}-${j}`).innerHTML = ``;
    }
  }

  THIS_PLAYER = {
    username: "",
    room_id: "",
    score: 0,
    number: "",
    turn: false,
  };

  message.innerHTML = `Game resetted`;

  overlay.style.display = "flex";

  setTimeout(() => {
    overlay.style.display = "none";
  }, 1000);
};

socket.on("reset", reset);

setThisPlayer();
login();
attachListener();
