export default () => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function fallBack(callback) {
      window.setTimeout(callback, 500);
    }
  );
};
