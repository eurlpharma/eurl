# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment
```bash
npm run setup
```
Follow the interactive prompts to configure your database and other settings.

### 3. Create Database
Connect to MySQL and create the database:
```sql
CREATE DATABASE healthy_db;
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

🎉 Your server is now running at `http://192.168.1.11:5000`

## 📋 Sample Data

After seeding, you'll have:

**Users:**
- Admin: `admin@healthy.com` / `admin123`
- User: `user@healthy.com` / `user123`

**Categories:** 4 sample categories
**Products:** 4 sample products with reviews
**Settings:** Basic application settings

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start development server
npm start               # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:studio       # Open database GUI
npm run db:seed         # Seed database

# Setup
npm run setup           # Interactive setup
```

## 🌐 API Endpoints

### Test the API
```bash
# Health check
curl http://192.168.1.11:5000/api/health

# Get products
curl http://192.168.1.11:5000/api/products

# Get categories
curl http://192.168.1.11:5000/api/categories
```

### Authentication
```bash
# Login
curl -X POST http://192.168.1.11:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@healthy.com","password":"admin123"}'
```

## 🗄️ Database Management

### View Database
```bash
npm run db:studio
```
This opens Prisma Studio in your browser for easy database management.

### Reset Database
```bash
npm run db:reset
```

### Add Sample Data
```bash
npm run db:seed
```

## 🔍 Troubleshooting

### Common Issues

**1. DATABASE_URL not found**
```bash
npm run setup
```

**2. MySQL connection error**
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists

**3. Port already in use**
- Change port in `.env` file
- Or kill process using port 5000

**4. Permission denied**
- Check MySQL user permissions
- Ensure database exists and is accessible

### Get Help
- Check `MIGRATION_SUMMARY.md` for detailed migration info
- Review `README.md` for full documentation
- Check server logs for error details

## 📱 Frontend Integration

The API is ready to work with your React frontend. Update your frontend API calls to use the new endpoints.

Key changes:
- `_id` fields are now `id`
- Role values: `'admin'` → `'ADMIN'`
- JWT tokens use `id` instead of `_id`

## 🎯 Next Steps

1. **Test all endpoints** - Ensure everything works
2. **Update frontend** - Modify API calls if needed
3. **Add features** - Extend functionality as needed
4. **Deploy** - Set up production environment

## 📞 Support

- Check the logs for detailed error messages
- Review the documentation in `README.md`
- Check Prisma docs: https://www.prisma.io/docs 