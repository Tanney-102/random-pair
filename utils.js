const shuffle = (arr) => {
  const result = [...arr];

  for (let i = result.length; i; i -= 1) {
    const j = Math.floor(Math.random() * i);

    [result[i - 1], result[j]] = [result[j], result[i - 1]];
  }

  return result;
};

module.exports = {
  shuffle,
};
