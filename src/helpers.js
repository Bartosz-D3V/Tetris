import {
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  clientHeight,
  clientWidth,
  cols,
  rows,
  tetrominos,
} from './constants';

let shapes = [...tetrominos];

export const getNextTetromino = () => {
  if (!shapes.length) {
    shapes = [...tetrominos];
  }
  const index = Math.floor(Math.random() * shapes.length);
  const shape = shapes[index];
  shapes.splice(index, 1);
  return shape;
};

export const drawBlock = (ctx, x, y, color = 'black') => {
  ctx.fillStyle = color;
  ctx.fillRect(BLOCK_WIDTH * x, BLOCK_HEIGHT * y, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeRect(BLOCK_WIDTH * x, BLOCK_HEIGHT * y, BLOCK_WIDTH, BLOCK_HEIGHT);
};

export const getBlocksPos = block => {
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

export const drawTetromino = (ctx, x, y, block, color = 'black') => {
  getBlocksPos(block).forEach(({ row, col }) => {
    drawBlock(ctx, col + x, row + y, color);
  });
};

export const drawboardState = (ctx, boardState) => {
  for (let i = 0; i < boardState.length; i++) {
    const block = boardState[i];
    drawBlock(ctx, block.posX, block.posY, block.tetromino.color);
  }
};

export const landing = (tetroState, boardState) => {
  const { landed, posX, posY, block } = tetroState;
  if (landed) return true;
  const blocks = getBlocksPos(block);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos = boardState.find(v => v.posX === col + posX && v.posY === row + posY + 1);
    if (nextPos || row + posY + 1 >= rows) return true;
  }
  return false;
};

const canMoveLeft = (tetroState, boardState) => {
  const { posX, posY, block } = tetroState;
  const blocks = getBlocksPos(block);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos = boardState.find(v => v.posX === col + posX - 1 && v.posY === row + posY + 1);
    if (nextPos || col + posX - 1 < 0) return false;
  }
  return true;
};

export const moveLeft = (tetroState, boardState) => {
  const { posX } = tetroState;
  if (canMoveLeft(tetroState, boardState)) {
    return posX - 1;
  }
  return posX;
};

const canMoveRight = (tetroState, boardState) => {
  const { posX, posY, block } = tetroState;
  const blocks = getBlocksPos(block);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos = boardState.find(v => v.posX === col + posX + 1 && v.posY === row + posY + 1);
    if (nextPos || col + posX + 1 >= cols) return false;
  }
  return true;
};

export const moveRight = (tetroState, boardState) => {
  const { posX } = tetroState;
  if (canMoveRight(tetroState, boardState)) {
    return posX + 1;
  }
  return posX;
};

const canRotate = (tetroState, nextBlock, boardState) => {
  const { posX, posY } = tetroState;
  const blocks = getBlocksPos(nextBlock);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos = boardState.find(v => v.posX === col + posX && v.posY === row + posY);
    if (nextPos || col + posX >= cols || col + posX < 0) return false;
  }
  return true;
};

export const rotate = (tetroState, boardState) => {
  const { block, tetromino } = tetroState;
  const nextBlock =
    tetromino.blocks[(tetromino.blocks.indexOf(block) + 1) % tetromino.blocks.length];
  if (canRotate(tetroState, nextBlock, boardState)) {
    return nextBlock;
  }
  return block;
};

const pushDownBlocks = blocks => {
  const loweredBlocks = blocks;
  for (let i = 0; i < loweredBlocks.length; i++) {
    loweredBlocks[i].posY++;
  }
  return loweredBlocks;
};

export const clearLines = (ctx, boardState) => {
  let newboardState = [...boardState];
  for (let i = 0; i < rows; i++) {
    const blocksInRow = newboardState.filter(v => v.posY === i);
    if (blocksInRow.length === cols) {
      newboardState = newboardState.filter(v => v.posY !== i);
      const blocks = newboardState.filter(v => v.posY < i);
      pushDownBlocks(blocks);
    }
  }
  return newboardState;
};

const getTetroHeight = tetroState => {
  const blocks = getBlocksPos(tetroState.block);
  return Math.max(...blocks.map(v => v.row)) - Math.min(...blocks.map(v => v.row)) + 1;
};

export const isGameOver = (tetroState, boardState) => {
  return Math.min(...boardState.map(v => v.posY)) - getTetroHeight(tetroState) <= 0;
};

export const displayMessage = (ctx, text, color = 'black') => {
  ctx.fillStyle = color;
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, clientWidth / 2, clientHeight / 2);
};
