import '../style/manifest.css';
import requestAnimFrame from './polyfill';
import {
  getNextTetromino,
  drawTetromino,
  drawboardState,
  landing,
  moveLeft,
  moveRight,
  getBlocksPos,
  rotate,
  clearLines,
  isGameOver,
  displayMessage,
  moveDown,
  drop,
} from './helpers';
import {
  clientHeight,
  clientWidth,
  cols,
  KEY_DOWN,
  KEY_ESC,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_SPACE,
  KEY_UP,
} from './constants';
import timestamp from './util';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const setCanvasSize = () => {
  canvas.width = clientWidth;
  canvas.height = clientHeight;
};

const globalState = {
  paused: true,
  score: 0,
  frameTime: 0,
};

const boardState = [];

const tetroState = {
  posX: 4,
  posY: -4,
  landed: false,
  tetromino: null,
  block: null,
};

const resetboardState = () => {
  boardState.length = 0;
};

const redrawBoard = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawboardState(ctx, boardState);
  drawTetromino(
    ctx,
    tetroState.posX,
    tetroState.posY,
    tetroState.block,
    tetroState.tetromino.color
  );
};

const resetTetroState = () => {
  tetroState.landed = false;
  tetroState.tetromino = getNextTetromino();
  tetroState.posY = -4;
  tetroState.posX = 4;
  const [[block1]] = [tetroState.tetromino.blocks];
  tetroState.block = block1;
};

const dockTetromino = () => {
  getBlocksPos(tetroState.block).forEach(({ row, col }) => {
    boardState.push({
      tetromino: tetroState.tetromino,
      posX: tetroState.posX + col,
      posY: tetroState.posY + row,
    });
  });
  tetroState.landed = true;
  tetroState.tetromino = null;
};

const updateScore = (currentState, newState) => {
  const removedLines = (currentState.length - newState.length) / cols;
  globalState.score += removedLines > 1 ? removedLines * 4 : removedLines;
  document.getElementById('score-display').innerText = globalState.score;
};

const removeFilledLines = () => {
  const currentState = [...boardState];
  const newState = [...clearLines(ctx, boardState)];
  boardState.splice(0, boardState.length, ...newState);
  updateScore(currentState, newState);
};

const recalculateBoardState = time => {
  globalState.frameTime += time;
  if (globalState.frameTime >= 0.15) {
    if (!landing(tetroState, boardState)) {
      tetroState.posY++;
    } else {
      dockTetromino();
      removeFilledLines();
    }
    if (!tetroState.tetromino) {
      resetTetroState();
    }
    redrawBoard();
    if (isGameOver(tetroState, boardState)) {
      globalState.paused = true;
      displayMessage(ctx, 'Game Over!');
    }
    globalState.frameTime = 0;
  }
};

const startGame = () => {
  let last = timestamp();
  let now = timestamp();
  const frame = () => {
    now = timestamp();
    if (!globalState.paused) {
      recalculateBoardState(Math.min(1, (now - last) / 1000));
    }
    last = now;
    requestAnimFrame(frame, canvas)(frame);
  };
  frame();
};

document.getElementById('btn-start').addEventListener('click', event => {
  event.preventDefault();
  event.target.blur();
  globalState.paused = false;
});

document.getElementById('btn-pause').addEventListener('click', event => {
  event.preventDefault();
  event.target.blur();
  globalState.paused = true;
});

document.getElementById('btn-restart').addEventListener('click', event => {
  event.preventDefault();
  event.target.blur();
  resetboardState();
  resetTetroState();
  globalState.score = 0;
  globalState.paused = false;
  globalState.frameTime = 0;
});

window.addEventListener('load', () => {
  resetboardState();
  setCanvasSize();
  startGame();
});

window.addEventListener('keydown', event => {
  const { paused } = globalState;
  if (paused) return;
  switch (event.keyCode) {
    case KEY_LEFT:
      tetroState.posX = moveLeft(tetroState, boardState);
      break;
    case KEY_RIGHT:
      tetroState.posX = moveRight(tetroState, boardState);
      break;
    case KEY_DOWN:
      tetroState.posY = moveDown(tetroState, boardState);
      break;
    case KEY_UP:
      tetroState.block = rotate(tetroState, boardState);
      break;
    case KEY_SPACE:
      tetroState.posY = drop(tetroState, boardState);
      break;
    case KEY_ESC:
      globalState.paused = !globalState.paused;
      break;
    default:
      break;
  }
});
