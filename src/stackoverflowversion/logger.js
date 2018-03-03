module.exports = logd;

let debug = true;
function logd(message) {
  if (debug) {
    console.log(message);
  }
}