const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Collection = require('../models/collection');
const Product = require('../models/Products');
const collections = require('../data/collectionsSeed');

async function seed() {
    try{
        await connectDB();
        await Product.deleteMany({});
    await Collection.deleteMany({});

        for (const col of collections) {
      const { slug, name, description, image, products = [] } = col;
      const newCol = await Collection.create({ slug, name, description, image });
      console.log(`Created collection ${newCol.slug}`);

       if (products.length) {
        const docs = products.map(p => ({
          name: p.name,
          description: p.description || '',
          price: p.price || 0,
          category: p.category || name,
          image: p.image || '',
          stock: p.stock || 50,
          collection: newCol._id
        }));

        await Product.insertMany(docs);
        console.log(`Inserted ${docs.length} products for ${newCol.slug}`);
      }

   
        }
         console.log('All collections and products seed completed');
    process.exit(0);
    } catch(err){
         console.error('Seed error', err);
    process.exit(1);
    }
}

seed()