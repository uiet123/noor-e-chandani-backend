// scripts/seedAdmin.js
require('dotenv').config();
const  connectDB  = require('../config/database');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // path adjust karo

async function run() {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const plain = process.env.ADMIN_PASSWORD;
    const first = process.env.ADMIN_FIRST_NAME || 'Admin';

    if (!email || !plain) {
      throw new Error('ADMIN_EMAIL / ADMIN_PASSWORD env missing');
    }

    let admin = await User.findOne({ emailId: email });
    if (admin) {
      console.log('✅ Admin already exists:', admin.emailId);
      process.exit(0);
    }

    const hash = await bcrypt.hash(plain, 10);

    admin = await User.create({
      firstName: first,
      emailId: email,
      password: hash,
      provider: 'local',
      role: 'admin',
    });

    console.log('🎉 Admin created:', admin.emailId);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

run();
