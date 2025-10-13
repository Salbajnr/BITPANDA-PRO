import { storage } from './storage';
import { hashPassword } from './simple-auth';

async function addCustomUser() {
  try {
    console.log('Creating new user...');
    
    // Hash the password
    const hashedPassword = await hashPassword('8Characterslong.');
    
    // Create the user
    const newUser = await storage.createUser({
      username: 'isaiahsalba',
      email: 'Isaiahsalba2020@gmail.com',
      password: hashedPassword,
      firstName: 'Isaiah',
      lastName: 'Salba',
      role: 'user',
      isActive: true,
    });
    
    console.log('✅ User created:', newUser.email);
    
    // Create a portfolio for the user
    const portfolio = await storage.createPortfolio({
      userId: newUser.id,
      totalValue: '0.00',
      availableCash: '0.00',
    });
    
    console.log('✅ Portfolio created for user');
    console.log('User ID:', newUser.id);
    console.log('Email:', newUser.email);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

addCustomUser();
