import { BLOCK_HEIGHT, BLOCK_WIDTH, tetrominos } from './constants';

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

export const drawTetromino = (ctx, x, y, block) => {
  let row = 0;
  let col = 0;
  for (let bit = 0x8000; bit > 0; bit >>= 1) {
    if (++row === 4) {
      ++col;
      row = 0;
    }
    ctx.strokeRect(x * BLOCK_WIDTH, y * BLOCK_HEIGHT, BLOCK_WIDTH * 4, BLOCK_HEIGHT * 4);
    if (bit & block) {
      drawBlock(ctx, row + x, col + y);
    }
  }
};

export const landing = (tetroState, globalState) => {
  const { landed, posX, posY } = tetroState;
  if (landed) return true;
  let row = 0;
  let col = 0;
  const blocks = [];
  for (let bit = 0x8000; bit > 0; bit >>= 1) {
    if (++col === 4) {
      ++row;
      col = 0;
    }
    if (bit & tetroState.block) {
      blocks.push({ row, col });
    }
  }
  for (let { row, col } of blocks) {
    const nextPos =
      globalState[row + posY + 1] !== undefined ? globalState[row + posY + 1][col + posX] : null;
    if (nextPos !== 0) return true;
  }
};
