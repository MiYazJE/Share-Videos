let ready = false;

function isReady() {
  return ready;
}

function markReady() {
  ready = true;
}

function markUnready() {
  ready = false;
}

module.exports = {
  isReady,
  markReady,
  markUnready,
};
