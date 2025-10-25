// In-memory user storage (replace with database in production)
const users = [];
const bcrypt = require('bcryptjs');

class User {
  constructor(id, email, passwordHash, name) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.name = name;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Instance method to check password
  async checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  // Instance method to update user
  update(updates) {
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date();
  }

  // Convert to public representation (without password)
  toPublic() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static methods for user management
  static async findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    return users.find(user => user.id === id);
  }

  static async create(email, password, name) {
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate simple ID (use UUID in production)
    const id = Date.now().toString();

    const user = new User(id, email, passwordHash, name);
    users.push(user);

    return user;
  }

  static async getAll() {
    return users.map(user => user.toPublic());
  }
}

module.exports = User;
