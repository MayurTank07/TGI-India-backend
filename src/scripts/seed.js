import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Content from '../models/Content.model.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Content.deleteMany({});

    // Create admin user
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@tgindia.com',
      password: process.env.ADMIN_PASSWORD || 'tgi@admin2024',
      role: 'admin'
    });

    console.log('✅ Admin user created:', admin.email);

    // Note: Content will use frontend defaults initially
    // Admin can update content through the admin panel

    console.log('✅ Database seeded successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email:', admin.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'tgi@admin2024');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
