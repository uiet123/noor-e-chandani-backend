const calculateCustomCandlePrice = (data) => {
  let total = 0;

  // Glass Type
  if (data.glassType === "candle-glass") total += 80;
  else if (data.glassType === "candle-jar") total += 120;

  // Wax Type
  if (data.waxType === "soya") total += 50;

  // Message Type
  if (data.messageType === "preset") total += 30;
  if (data.messageType === "custom") total += 50;

  // Layers
  if (data.layers === "single") total += 0;
  if (data.layers === "double") total += 40;

  // Colors (only if double layer)
  if (data.layer1Color) total += 20;
  if (data.layer2Color) total += 20;

  // Fragrance
  if (data.fragrance) total += 30;

  return total;
};

module.exports = calculateCustomCandlePrice
