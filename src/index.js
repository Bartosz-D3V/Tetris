import '../style/manifest.css';
import getNextTetromino from './helpers';
import { cols, rows } from './constants';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const { clientWidth, clientHeight } = canvas;
const BLOCK_WIDTH = clientWidth / cols;
const BLOCK_HEIGHT = clientHeight / rows;

const setCanvasSize = () => {
  canvas.width = clientWidth;
  canvas.height = clientHeight;
};

const drawBlock = (x, y) => {
  ctx.fillRect(BLOCK_WIDTH * x, BLOCK_HEIGHT * y, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeRect(BLOCK_WIDTH * x, BLOCK_HEIGHT * y, BLOCK_WIDTH, BLOCK_HEIGHT);
};

const drawBoard = () => {
  drawBlock(0, 0);
};

const globalState = [];

const setGlobalState = () => {
  for (let i = 0; i < rows; i++) {
    globalState.push([]);
    for (let j = 0; j < cols; j++) {
      globalState[i].push(0);
    }
  }
};

const tetroState = {
  posX: 0,
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
};

window.addEventListener('load', () => {
  setGlobalState();
  setCanvasSize();
  drawBoard();
  window.setInterval(recalculateTetroState, 1000);
});
