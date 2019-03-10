import { BLOCK_HEIGHT, BLOCK_WIDTH, cols, rows, tetrominos } from './constants';

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

export const drawGlobalState = (ctx, globalState) => {
  for (let i = 0; i < globalState.length; i++) {
    const block = globalState[i];
    drawBlock(ctx, block.posX, block.posY, block.tetromino.color);
  }
};

export const landing = (tetroState, globalState) => {
  const { landed, posX, posY, block } = tetroState;
  if (landed) return true;
  const blocks = getBlocksPos(block);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos = globalState.find(v => v.posX === col + posX && v.posY === row + posY + 1);
    if (nextPos || row + posY + 1 >= rows) return true;
  }
  return false;
};

const canMoveLeft = (tetroState, globalState) => {
  const { posX, posY, block } = tetroState;
  const blocks = getBlocksPos(block);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos = globalState.find(v => v.posX === col + posX - 1 && v.posY === row + posY + 1);
    if (nextPos || col + posX - 1 < 0) return false;
  }
  return true;
};

export const moveLeft = (tetroState, globalState) => {
  const { posX } = tetroState;
  if (canMoveLeft(tetroState, globalState)) {
    return posX - 1;
  }
  return posX;
};

const canMoveRight = (tetroState, globalState) => {
  const { posX, posY, block } = tetroState;
  const blocks = getBlocksPos(block);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos = globalState.find(v => v.posX === col + posX + 1 && v.posY === row + posY + 1);
    if (nextPos || col + posX + 1 >= cols) return false;
  }
  return true;
};

export const moveRight = (tetroState, globalState) => {
  const { posX } = tetroState;
  if (canMoveRight(tetroState, globalState)) {
    return posX + 1;
  }
  return posX;
};

const canRotate = (tetroState, nextBlock, globalState) => {
  const { posX, posY } = tetroState;
  const blocks = getBlocksPos(nextBlock);
  for (let i = 0; i < blocks.length; i++) {
    const { row, col } = blocks[i];
    const nextPos = globalState.find(v => v.posX === col + posX && v.posY === row + posY);
    if (nextPos || col + posX >= cols || col + posX < 0) return false;
  }
  return true;
};

export const rotate = (tetroState, globalState) => {
  const { block, tetromino } = tetroState;
  const nextBlock =
    tetromino.blocks[(tetromino.blocks.indexOf(block) + 1) % tetromino.blocks.length];
  if (canRotate(tetroState, nextBlock, globalState)) {
    return nextBlock;
  }
  return block;
};

export const clearLines = (ctx, globalState) => {
  let newGlobalState = [...globalState];
  for (let i = 0; i < rows; i++) {
    const blocksInRow = globalState.filter(v => v.posY === i);
    if (blocksInRow.length === cols) {
      newGlobalState = globalState.filter(v => v.posY !== i);
      pushDownBlocks(newGlobalState);
    }
  }
  return newGlobalState;
};

export const pushDownBlocks = globalState => {
  let newGlobalState = [...globalState];
  for (let i = 0; i < newGlobalState.length; i++) {
    const blocksInCol = newGlobalState.filter(
      v => v.posX === globalState[i].posX && v !== globalState[i]
    );
    const maxBlockInCol = Math.max(...blocksInCol.map(v => v.posY));
    globalState[i].posY = !!maxBlockInCol ? rows - 1 : maxBlockInCol - 1;
  }
  return newGlobalState;
};
