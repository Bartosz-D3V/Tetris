import { BLOCK_HEIGHT, BLOCK_WIDTH, cols, tetrominos } from './constants';

let shapes = tetrominos;

export const getNextTetromino = () => {
  if (!shapes.length) {
    shapes = tetrominos;
  }
  const index = Math.floor(Math.random() * shapes.length);
  const shape = shapes[index];
  shapes.splice(index, 1);
  return shape;
};

export const drawBlock = (ctx, x, y) => {
  ctx.fillRect(BLOCK_WIDTH * x, BLOCK_HEIGHT * y, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeRect(BLOCK_WIDTH * x, BLOCK_HEIGHT * y, BLOCK_WIDTH, BLOCK_HEIGHT);
};

const getBlocksPos = block => {
  let row = 0;
  let col = 0;
  const blockPos = [];
  for (let bit = 0x8000; bit > 0; bit >>= 1) {
    if (++row === 4) {
      ++col;
      row = 0;
    }
    if (bit & block) {
      blockPos.push({ row, col });
    }
  }
  return blockPos;
};

export const drawTetromino = (ctx, x, y, block) => {
  getBlocksPos(block).forEach(({ row, col }) => {
    drawBlock(ctx, col + x, row + y);
  });
};

export const landing = (tetroState, globalState) => {
  const { landed, posX, posY, block } = tetroState;
  if (landed) return true;
  const blocks = getBlocksPos(block);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos =
      globalState[row + posY + 1] !== undefined ? globalState[row + posY + 1][col + posX] : null;
    if (nextPos !== 0) return true;
  }
  return false;
};

export const moveLeft = ({ posX, block, landed }) => {
  const minPosX = getBlocksPos(block)
    .map(v => v.col)
    .reduce((a, b) => Math.min(a, b));
  if (!landed && posX + minPosX > 0) {
    return posX - 1;
  }
  return posX;
};

export const moveRight = ({ posX, block, landed }) => {
  const maxPosX = getBlocksPos(block)
    .map(v => v.col)
    .reduce((a, b) => Math.max(a, b));
  if (!landed && posX + maxPosX + 1 < cols) {
    return posX + 1;
  }
  return posX;
};
