const { shuffle } = require("./utils.js");
const { pairLogs } = require("./mocks.js");
const crews = require("./crews.js");

const createPairLogGraph = (crews) => {
  const gPairs = {};

  crews.forEach((crew) => (gPairs[crew] = []));
  pairLogs.forEach((log) =>
    log.forEach((pair) => {
      for (let i = 0; i < pair.length - 1; i++) {
        for (let j = i + 1; j < pair.length; j++) {
          gPairs[pair[i]].push(pair[j]);
          gPairs[pair[j]].push(pair[i]);
        }
      }
    })
  );

  return gPairs;
};

const matchRandomPair = (crews, allowDuplication = false) => {
  let pairs = [];

  if (allowDuplication) {
    const shuffledCrews = shuffle(crews);

    pairs = Array.from({ length: (crews.length + 1) / 2 }, (_, i) =>
      shuffledCrews.slice(2 * i, 2 * i + 1)
    );
  } else {
    const gPairs = createPairLogGraph(crews);
    console.log(gPairs);
  }

  if (pairs[pairs.length - 1]?.length < 2) {
  }
};

console.log(crews);
console.log(Object.values(crews));
matchRandomPair(Object.values(crews));
