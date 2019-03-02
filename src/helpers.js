import { tetrominos } from './constants';

const getShapes = () => {
  return tetrominos.map(v => v.shape);
};

let shapes = getShapes();

export default () => {
  if (!shapes.length) {
    shapes = getShapes();
  }
  const index = Math.floor(Math.random() * shapes.length);
  const shape = shapes[index];
  shapes.splice(index, 1);
  return shape;
};
