const { shuffle } = require("./utils.js");

const createPairLogGraph = (crews, pairLogs) => {
  const gPairs = {}; // { crew: [...prevPairs] }

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

const createTripletLogSet = (crews, pairLogs) => {
  const tripletLogSet = new Set();

  pairLogs.forEach((log) => {
    log.forEach((pair) => {
      if (pair.length === 3) {
        pair.forEach((v) => tripletLogSet.add(v));
      }
    });
  });

  return tripletLogSet;
};

// TODO: 최적화 시급
const matchRandomPair = (crews, pairLogs, allowDuplication = false) => {
  let pairs = [];

  if (allowDuplication) {
    const shuffledCrews = shuffle(crews);

    pairs = Array.from({ length: (crews.length + 1) / 2 }, (_, i) =>
      shuffledCrews.slice(2 * i, 2 * i + 1)
    );

    if (pairs[pairs.length - 1].length < 2) {
      const soloCrew = pairs[pairs.length - 1][0];

      pairs = pairs.slice(0, -1);
      pairs[Math.floor(Math.random() * pairs.length)].push(soloCrew);
    }
  } else {
    const gPairs = createPairLogGraph(crews, pairLogs);
    const tripletLogSet = createTripletLogSet(crews, pairLogs);
    const selected = new Set();
    const pairEntries = shuffle(Object.entries(gPairs)); // 3인 페어가 필요할 경우 마지막 entry를 그 대상으로 함

    if (pairEntries.length % 2) {
      let tripletTargetIndex = pairEntries.length - 1;
      while (tripletLogSet.has(pairEntries[tripletTargetIndex][0])) {
        if (tripletTargetIndex === 0) {
          throw new Error("Can't match triplets without duplication");
        }
        tripletTargetIndex--;
      }

      [pairEntries[tripletTargetIndex], pairEntries[pairEntries.length - 1]] = [
        pairEntries[pairEntries.length - 1],
        pairEntries[tripletTargetIndex],
      ];
    }

    pairs = pairEntries.map((entry, index) => {
      const [crew, prevPairs] = entry;
      selected.add(crew);

      const newPair = shuffle(
        crews.filter((v) => !prevPairs.includes(v) && !selected.has(v))
      )[0];

      if (newPair === undefined) {
        if (index < pairEntries.length - 1) {
          throw new Error("Can't match pairs without duplication");
        }

        return [crew];
      }

      return [crew, newPair];
    });

    if (pairs[pairs.length - 1].length < 2) {
      const soloCrew = pairs[pairs.length - 1][0];
      const tripletTargetIndex = 0;

      pairs = pairs.slice(0, -1);

      while (pairs[tripletTargetIndex].some((v) => tripletLogSet.has(v))) {
        if (tripletTargetIndex === pairs.length - 1) {
          throw new Error("Can't match triplets without duplication");
        }
        tripletTargetIndex++;
      }

      pairs[tripletTargetIndex].push(soloCrew);
    }
  }

  return pairs;
};

module.exports = {
  matchRandomPair,
};
