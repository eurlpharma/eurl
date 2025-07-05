// Database configuration
export const databaseConfig = {
  url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/healthy_db",
  // You can add more database configuration options here
};

// JWT configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET || "your_jwt_secret_here_change_this_in_production",
  expiresIn: process.env.JWT_EXPIRE || "30d",
};

// Server configuration
export const serverConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiUrl: process.env.API_URL || "http://192.168.1.11:5000",
};

// File upload configuration
export const uploadConfig = {
  path: process.env.UPLOAD_PATH || "./uploads",
  maxFileSize: process.env.MAX_FILE_SIZE || 5242880,
}; 