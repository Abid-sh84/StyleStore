// Mock user service for development when MongoDB connection is unavailable
import bcrypt from 'bcryptjs';

// In-memory store for users
const users = [];
let nextId = 1;

// Mock User model
const MockUserModel = {
  findOne: async ({ email }) => {
    return users.find(user => user.email === email);
  },
  
  findById: async (id) => {
    return users.find(user => user._id === id);
  },
  
  create: async (userData) => {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user object
    const newUser = {
      _id: String(nextId++),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      isAdmin: userData.isAdmin || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Add match password method to the user object
      matchPassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      },
      
      // Add save method
      save: async function() {
        this.updatedAt = new Date();
        return this;
      }
    };
    
    // Add to in-memory store
    users.push(newUser);
    return newUser;
  }
};

export { MockUserModel };
