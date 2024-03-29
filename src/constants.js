const canvas = document.getElementById('board');

export const cols = 10;
export const rows = 20;
export const { clientWidth, clientHeight } = canvas;
export const BLOCK_WIDTH = clientWidth / cols;
export const BLOCK_HEIGHT = clientHeight / rows;
export const tetrominos = [
  { shape: 'i', blocks: [0x0f00, 0x2222, 0x00f0, 0x4444], color: '#46dccd' },
  { shape: 'j', blocks: [0x44c0, 0x8e00, 0x6440, 0x0e20], color: '#024aca' },
  { shape: 'l', blocks: [0x4460, 0x0e80, 0xc440, 0x2e00], color: '#f7872a' },
  { shape: 'o', blocks: [0xcc00, 0xcc00, 0xcc00, 0xcc00], color: '#ffbb31' },
  { shape: 's', blocks: [0x06c0, 0x8c40, 0x6c00, 0x4620], color: '#5cac48' },
  { shape: 't', blocks: [0x0e40, 0x4c40, 0x4e00, 0x4640], color: '#7b3781' },
  { shape: 'z', blocks: [0x0c60, 0x4c80, 0xc600, 0x2640], color: '#e03c28' },
];

export const KEY_UP = 38;
export const KEY_LEFT = 37;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_SPACE = 32;
export const KEY_ESC = 27;
