const CustomProductsData = [
  {
    id: 1,
    type: "message-candle",
    slug: "message-candle",
    name: "Message Candle",
    image: ["/uploads/dating/rose_romance/rose_romance.png", "/uploads/dating/rose_romance/1.jpg", "/uploads/dating/rose_romance/2.jpg", "/uploads/dating/rose_romance/3.jpg", "/uploads/dating/rose_romance/4.jpg"],
    description:
      "Customize your candle with your own message, layers, colors and fragrance.",
    basePrice: 120,

   options: {
      glassTypes: ["candle-jar"],
      waxTypes: ["soya-wax", "gel-wax"],   

      messageTypes: ["Preset", "Custom"],
      presetMessages: ["I Miss You", "Friends Forever", "Happy Birthday"],

      layers: ["single", "double"],

      singleLayerColors: ["Red", "Yellow", "White", "Green", "Pink", "Orange"],
      doubleLayerColors: ["Red", "Yellow", "White", "Green", "Pink", "Orange"],

      fragrances: ["Rose", "Coffee", "Vanilla"], 
    },

    priceRules: {
      glassTypes: { "candle-jar": 100 },
      waxTypes: { "soya-wax": 40, "gel-wax": 30 },

      messageType: { preset: 20, custom: 40 },

      layers: { single: 0, double: 40 },

      color: 20,
      fragrance: { Rose: 20, Coffee: 30, Vanilla: 25 },
    },
  },

  {
    id: 2,
    type: "custom-jar",
    slug: "custom-candle-jar",
    name: "Custom Candle Jar",
    image: ["/uploads/dating/rose_romance/rose_romance.png", "/uploads/dating/rose_romance/1.jpg", "/uploads/dating/rose_romance/2.jpg", "/uploads/dating/rose_romance/3.jpg", "/uploads/dating/rose_romance/4.jpg"],
    description:
      "Customize your candle jar with layers, colors and fragrance.",
    basePrice: 100,

    options: {
      glassTypes: ["candle-jar"],
      waxTypes: ["soya-wax", "gel-wax"],   

      layers: ["single", "double"],

      singleLayerColors: ["Red", "Yellow", "White", "Green", "Pink", "Orange"],
      doubleLayerColors: ["Red", "Yellow", "White", "Green", "Pink", "Orange"],

      fragrances: ["Rose", "Coffee", "Vanilla"], 
    },

    priceRules: {
      glassTypes: { "candle-jar": 100 },
      waxTypes: { "soya-wax": 40, "gel-wax": 30 },

      layers: { single: 0, double: 40 },

      color: 20,
      fragrance: { Rose: 20, Coffee: 30, Vanilla: 25 },
    },
  },

  {
    id: 3,
    type: "custom-glass",
    slug: "custom-candle-glass",
    name: "Custom Candle Glass",
    image: ["/uploads/dating/rose_romance/rose_romance.png", "/uploads/dating/rose_romance/1.jpg", "/uploads/dating/rose_romance/2.jpg", "/uploads/dating/rose_romance/3.jpg", "/uploads/dating/rose_romance/4.jpg"],
    description:
      "Design your layered candle in premium glass.",
    basePrice: 80,

    options: {
      glassTypes: ["candle-glass"],
      waxTypes: ["soya-wax", "gel-wax"], 

      layers: ["single", "double"],

      singleLayerColors: ["Red", "Yellow", "Green", "Orange", "White", "Pink"],
      doubleLayerColors: ["Red", "Yellow", "Green", "Orange", "White", "Pink"],

      fragrances: ["Rose", "Lavender", "Coffee"], 
    },

    priceRules: {
      glassTypes: { "candle-glass": 80 },
      waxTypes: { "soya-wax": 40, "gel-wax": 30 },

      layers: { single: 0, double: 40 },

      color: 20,
      fragrance: { Rose: 20, Lavender: 30, Coffee: 30 },
    },
  },

  {
    id: 4,
    type: "chai-glass",
    slug: "custom-chai-glass",
    name: "Custom Chai Glass Candle",
    image: ["/uploads/dating/rose_romance/rose_romance.png", "/uploads/dating/rose_romance/1.jpg", "/uploads/dating/rose_romance/2.jpg", "/uploads/dating/rose_romance/3.jpg", "/uploads/dating/rose_romance/4.jpg"],
    description:
      "Beautiful chai glass candle customizable with wax and colors.",
    basePrice: 70,

    options: {
      glassTypes: ["chai-glass"],
      waxTypes: ["soya-wax", "gel-wax"],
      singleLayerColors: ["Red", "Yellow", "Green", "Orange", "White", "Pink"],
      fragrances: ["Rose", "Lavender", "Coffee"], 
    },

    priceRules: {
      glassTypes: { "chai-glass": 70 },
      waxTypes: { "soya-wax": 30, "gel-wax": 20 },
       color: 20,
      fragrance: { Rose: 20, Lavender: 30, Coffee: 30 },
    },
  },
];

module.exports = CustomProductsData;
