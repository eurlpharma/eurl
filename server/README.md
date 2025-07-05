# Healthy Store Backend

Backend API for Healthy medical products e-commerce platform built with Node.js, Express, Prisma, and MySQL.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **Product Management** - CRUD operations for products with image uploads
- **Category Management** - Organize products into categories
- **Order Management** - Complete order lifecycle from creation to delivery
- **Review System** - Product reviews and ratings
- **Admin Dashboard** - Comprehensive admin interface for store management
- **File Upload** - Image upload for products and categories
- **Search & Filtering** - Advanced product search and filtering capabilities

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Multer
- **Validation**: Express Validator
- **Email**: Nodemailer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthy/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database Configuration (MySQL)
   DATABASE_URL="mysql://username:password@localhost:3306/healthy_db"

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d

   # Email Configuration (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   # API Configuration
   API_URL=http://192.168.1.11:5000

   # File Upload Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database (creates tables)
   npm run db:push

   # Or use migrations (recommended for production)
   npm run db:migrate
   ```

5. **Seed the database with sample data**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The application uses the following main entities:

- **Users** - Customer and admin accounts
- **Categories** - Product categories
- **Products** - Store products with images and specifications
- **Reviews** - Product reviews and ratings
- **Orders** - Customer orders with order items
- **OrderItems** - Individual items in orders
- **Settings** - Application settings

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database and run migrations
- `npm run db:seed` - Seed database with sample data

## 📡 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)

### Admin
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/stats` - Get order statistics (Admin)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 File Structure

```
server/
├── config/
│   └── db.js              # Database connection
├── controllers/           # Route controllers
├── data/
│   └── prismaSeeder.js   # Database seeder
├── lib/
│   └── prisma.js         # Prisma client
├── middleware/           # Custom middleware
├── prisma/
│   └── schema.prisma     # Database schema
├── routes/              # API routes
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── package.json
└── server.js            # Main server file
```

## 🗄️ Database Migration

When making schema changes:

1. Update `prisma/schema.prisma`
2. Generate migration: `npm run db:migrate`
3. Apply migration: `npm run db:push`

## 🌱 Sample Data

After running the seeder, you'll have:

- **Admin User**: admin@healthy.com / admin123
- **Regular User**: user@healthy.com / user123
- **Categories**: 4 sample categories
- **Products**: 4 sample products with reviews
- **Settings**: Basic application settings

## 🚨 Important Notes

- Make sure MySQL is running before starting the application
- Update the `DATABASE_URL` in `.env` with your MySQL credentials
- The `uploads` directory will be created automatically
- For production, use proper environment variables and security measures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 