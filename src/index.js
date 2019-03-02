import '../style/manifest.css';
import { getNextTetromino, drawTetromino } from './helpers';
import { cols, rows } from './constants';
import { clientHeight, clientWidth, BLOCK_HEIGHT } from './constants';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const setCanvasSize = () => {
  canvas.width = clientWidth;
  canvas.height = clientHeight;
};

const globalState = [];

const resetGlobalState = () => {
  for (let i = 0; i < rows; i++) {
    globalState.push([]);
    for (let j = 0; j < cols; j++) {
      globalState[i].push(0);
    }
  }
};

const tetroState = {
  posX: 4,
  posY: 0,
  landed: false,
  tetromino: null,
};

const recalculateTetroState = () => {
  if (tetroState.posY < clientHeight - BLOCK_HEIGHT) {
    tetroState.posY++;
  }
  if (!tetroState.tetromino) {
    tetroState.tetromino = getNextTetromino();
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTetromino(ctx, tetroState.posX, tetroState.posY, 0xcc00);
};

window.addEventListener('load', () => {
  resetGlobalState();
  setCanvasSize();
  window.setInterval(recalculateTetroState, 1000);
});
