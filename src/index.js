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

window.addEventListener('load', () => {
  getNextTetromino();
  setCanvasSize();
  drawBoard();
});
