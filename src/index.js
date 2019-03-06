import '../style/manifest.css';
import { getNextTetromino, drawTetromino, landing, moveLeft, moveRight } from './helpers';
import { cols, rows, clientHeight, clientWidth, KEY_LEFT, KEY_RIGHT } from './constants';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const setCanvasSize = () => {
  canvas.width = clientWidth;
  canvas.height = clientHeight;
};

const globalState = [];

const tetroState = {
  posX: 4,
  posY: 0,
  landed: false,
  tetromino: null,
  block: null,
};

const resetGlobalState = () => {
  for (let i = 0; i < rows; i++) {
    globalState.push([]);
    for (let j = 0; j < cols; j++) {
      globalState[i].push(0);
    }
  }
};

const recalculateTetroState = () => {
  if (!landing(tetroState, globalState)) {
    tetroState.posY++;
  } else {
    tetroState.landed = true;
  }
  if (!tetroState.tetromino) {
    tetroState.tetromino = getNextTetromino();
    const [[block1]] = [tetroState.tetromino.blocks];
    tetroState.block = block1;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTetromino(ctx, tetroState.posX, tetroState.posY, tetroState.block);
};

window.addEventListener('load', () => {
  resetGlobalState();
  setCanvasSize();
  window.setInterval(recalculateTetroState, 600);
});

window.addEventListener('keydown', event => {
  if (event.keyCode === KEY_LEFT) {
    tetroState.posX = moveLeft(tetroState);
  } else if (event.keyCode === KEY_RIGHT) {
    tetroState.posX = moveRight(tetroState);
  }
});
