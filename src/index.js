import '../style/manifest.css';
import {
  getNextTetromino,
  drawTetromino,
  drawGlobalState,
  landing,
  moveLeft,
  moveRight,
  getBlocksPos,
} from './helpers';
import { clientHeight, clientWidth, KEY_LEFT, KEY_RIGHT } from './constants';

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
  globalState.length = 0;
};

const recalculateTetroState = () => {
  if (!landing(tetroState, globalState)) {
    tetroState.posY++;
  } else {
    getBlocksPos(tetroState.block).forEach(({ row, col }) => {
      globalState.push({
        tetromino: tetroState.tetromino,
        posX: tetroState.posX + col,
        posY: tetroState.posY + row,
      });
    });
    tetroState.landed = true;
    tetroState.tetromino = null;
  }
  if (!tetroState.tetromino) {
    tetroState.landed = false;
    tetroState.tetromino = getNextTetromino();
    tetroState.posY = 0;
    tetroState.posX = 4;
    const [[block1]] = [tetroState.tetromino.blocks];
    tetroState.block = block1;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGlobalState(ctx, globalState);
  drawTetromino(
    ctx,
    tetroState.posX,
    tetroState.posY,
    tetroState.block,
    tetroState.tetromino.color
  );
};

window.addEventListener('load', () => {
  resetGlobalState();
  setCanvasSize();
  window.setInterval(recalculateTetroState, 500);
});

window.addEventListener('keydown', event => {
  if (event.keyCode === KEY_LEFT) {
    tetroState.posX = moveLeft(tetroState);
  } else if (event.keyCode === KEY_RIGHT) {
    tetroState.posX = moveRight(tetroState);
  }
});
