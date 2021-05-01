const { pairLogs } = require("./mocks.js");
const crews = require("./crews.js");
const { matchRandomPair } = require("./randomPair.js");

console.log(matchRandomPair(Object.values(crews), pairLogs));
