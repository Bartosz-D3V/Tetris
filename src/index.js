import '../style/manifest.css';
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
} from './helpers';
import { clientHeight, clientWidth, ESC_SPACE, KEY_LEFT, KEY_RIGHT, KEY_SPACE } from './constants';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const setCanvasSize = () => {
  canvas.width = clientWidth;
  canvas.height = clientHeight;
};

const globalState = {
  paused: false,
};

const boardState = [];

const tetroState = {
  posX: 4,
  posY: -1,
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
  tetroState.posY = -1;
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

const removeFilledLines = () => {
  boardState.splice(0, boardState.length, ...clearLines(ctx, boardState));
};

const recalculateboardState = () => {
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
};

window.addEventListener('load', () => {
  resetboardState();
  setCanvasSize();
  window.setInterval(() => {
    if (!globalState.paused) recalculateboardState();
  }, 500);
});

window.addEventListener('keydown', event => {
  switch (event.keyCode) {
    case KEY_LEFT:
      tetroState.posX = moveLeft(tetroState, boardState);
      break;
    case KEY_RIGHT:
      tetroState.posX = moveRight(tetroState, boardState);
      break;
    case KEY_SPACE:
      tetroState.block = rotate(tetroState, boardState);
      break;
    case ESC_SPACE:
      globalState.paused = !globalState.paused;
      break;
    default:
      break;
  }
});
