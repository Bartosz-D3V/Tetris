import { BLOCK_HEIGHT, BLOCK_WIDTH, tetrominos } from './constants';

const getShapes = () => {
  return tetrominos.map(v => v.shape);
};

let shapes = getShapes();

export const getNextTetromino = () => {
  if (!shapes.length) {
    shapes = getShapes();
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
  for (let bit = 0x8000; bit > 0; bit = bit >> 1) {
    if (++col === 4) {
      ++row;
      col = 0;
    }
    if (bit & block) {
      drawBlock(ctx, x + row, col + y);
    }
  }
};
