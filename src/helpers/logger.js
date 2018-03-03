let debug = true;
let handLog;

function logger(message) {
  handLog = handLog || [];
  if (debug) {
    handLog.push(message);
  }
}

export {logger, handLog};