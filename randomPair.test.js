const { pairLogs } = require("./mocks.js");
const crews = require("./crews.js");
const { matchRandomPair, isPairsDuplicated } = require("./randomPair.js");

const matched = matchRandomPair(Object.values(crews), pairLogs);

if (isPairsDuplicated(matched, pairLogs)) {
  throw Error("There are duplicated crews in pairs");
}

console.log(matched);
