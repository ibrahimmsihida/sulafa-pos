const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sulafa_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sulafa_pos'
};

let db;

// Initialize database connection
async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    // Create database if it doesn't exist
    await db.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await db.execute(`USE ${dbConfig.database}`);
    
    // Create tables
    await createTables();
    await insertSampleData();
    
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Create database tables
async function createTables() {
  // Users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'manager', 'cashier') DEFAULT 'cashier',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Categories table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Products table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      cost DECIMAL(10, 2) DEFAULT 0,
      category_id INT,
      image VARCHAR(255),
      stock_quantity INT DEFAULT 0,
      min_stock_level INT DEFAULT 5,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  // Customers table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      loyalty_points INT DEFAULT 0,
      total_spent DECIMAL(10, 2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Orders table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      customer_id INT,
      user_id INT,
      subtotal DECIMAL(10, 2) NOT NULL,
      tax_amount DECIMAL(10, 2) DEFAULT 0,
      service_charge DECIMAL(10, 2) DEFAULT 0,
      total_amount DECIMAL(10, 2) NOT NULL,
      payment_method ENUM('cash', 'card', 'digital') DEFAULT 'cash',
      status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
      order_type ENUM('dine_in', 'takeaway', 'delivery') DEFAULT 'dine_in',
      table_number VARCHAR(10),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Order items table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables created successfully');
}

// Insert sample data
async function insertSampleData() {
  try {
    // Check if admin user exists
    const [adminExists] = await db.execute('SELECT id FROM users WHERE email = ?', ['admin@sulafa.com']);
    
    if (adminExists.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@sulafa.com', hashedPassword, 'admin']
      );

      // Insert sample categories
      const categories = [
        ['Appetizers', 'Delicious starters to begin your meal', null],
        ['Main Courses', 'Hearty and satisfying main dishes', null],
        ['Desserts', 'Sweet treats to end your meal', null],
        ['Beverages', 'Refreshing drinks and beverages', null],
        ['Salads', 'Fresh and healthy salad options', null]
      ];

      for (const category of categories) {
        await db.execute(
          'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)',
          category
        );
      }

      // Insert sample products
      const products = [
        ['Chicken Wings', 'Crispy chicken wings with your choice of sauce', 12.99, 6.50, 1, null, 50, 10],
        ['Caesar Salad', 'Fresh romaine lettuce with caesar dressing', 8.99, 4.00, 5, null, 30, 5],
        ['Grilled Salmon', 'Fresh Atlantic salmon grilled to perfection', 24.99, 12.00, 2, null, 20, 5],
        ['Beef Burger', 'Juicy beef patty with fresh vegetables', 15.99, 8.00, 2, null, 40, 10],
        ['Chocolate Cake', 'Rich chocolate cake with chocolate frosting', 6.99, 3.00, 3, null, 15, 3],
        ['Coffee', 'Freshly brewed coffee', 3.99, 1.50, 4, null, 100, 20],
        ['Orange Juice', 'Fresh squeezed orange juice', 4.99, 2.00, 4, null, 50, 10]
      ];

      for (const product of products) {
        await db.execute(
          'INSERT INTO products (name, description, price, cost, category_id, image, stock_quantity, min_stock_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          product
        );
      }

      // Insert sample customers
      const customers = [
        ['John Doe', 'john@example.com', '+1234567890', '123 Main St, City', 150, 299.97],
        ['Jane Smith', 'jane@example.com', '+1234567891', '456 Oak Ave, City', 75, 149.98],
        ['Mike Johnson', 'mike@example.com', '+1234567892', '789 Pine St, City', 200, 399.95]
      ];

      for (const customer of customers) {
        await db.execute(
          'INSERT INTO customers (name, email, phone, address, loyalty_points, total_spent) VALUES (?, ?, ?, ?, ?, ?)',
          customer
        );
      }

      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard Routes
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    
    const [salesResult] = await db.execute(
      'SELECT COALESCE(SUM(total_amount), 0) as total_sales FROM orders WHERE DATE(created_at) = ? AND status = "completed"',
      [today]
    );
    
    const [ordersResult] = await db.execute(
      'SELECT COUNT(*) as total_orders FROM orders WHERE DATE(created_at) = ?',
      [today]
    );
    
    const [customersResult] = await db.execute(
      'SELECT COUNT(*) as total_customers FROM customers'
    );
    
    const [avgOrderResult] = await db.execute(
      'SELECT COALESCE(AVG(total_amount), 0) as avg_order FROM orders WHERE DATE(created_at) = ? AND status = "completed"',
      [today]
    );

    res.json({
      totalSales: salesResult[0].total_sales,
      totalOrders: ordersResult[0].total_orders,
      totalCustomers: customersResult[0].total_customers,
      averageOrder: avgOrderResult[0].avg_order
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products Routes
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = TRUE
      ORDER BY p.name
    `);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, cost, category_id, stock_quantity, min_stock_level } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, cost, category_id, image, stock_quantity, min_stock_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, cost, category_id, image, stock_quantity, min_stock_level]
    );

    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Categories Routes
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders Routes
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.*, c.name as customer_name, u.name as user_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 50
    `);
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { customer_id, items, payment_method, order_type, table_number, notes } = req.body;
    
    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }
    
    const tax_rate = 0.15; // 15% tax
    const service_rate = 0.10; // 10% service charge
    
    const tax_amount = subtotal * tax_rate;
    const service_charge = subtotal * service_rate;
    const total_amount = subtotal + tax_amount + service_charge;
    
    // Generate order number
    const order_number = 'ORD-' + Date.now();
    
    // Insert order
    const [orderResult] = await db.execute(
      'INSERT INTO orders (order_number, customer_id, user_id, subtotal, tax_amount, service_charge, total_amount, payment_method, order_type, table_number, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [order_number, customer_id, req.user.id, subtotal, tax_amount, service_charge, total_amount, payment_method, order_type, table_number, notes]
    );
    
    const order_id = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
        [order_id, item.id, item.quantity, item.price, item.price * item.quantity]
      );
      
      // Update product stock
      await db.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }
    
    res.status(201).json({ id: order_id, order_number, message: 'Order created successfully' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Customers Routes
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const [customers] = await db.execute('SELECT * FROM customers ORDER BY name');
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Customer created successfully' });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`🎯 Frontend URL: http://localhost:${PORT}`);
  }
  
  await initDatabase();
});

module.exports = app;