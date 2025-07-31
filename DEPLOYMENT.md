# 🚀 SULAFA POS Restaurant - Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying the SULAFA Restaurant Management System to various hosting platforms. The system is designed to be easily deployable on modern cloud platforms.

## 🌐 Recommended Deployment Platforms

### 1. 🥇 Vercel + PlanetScale (Recommended)

**Advantages:**
- Free tier available
- Automatic SSL certificates
- Global CDN
- Easy database management
- Excellent performance

**Requirements:**
- GitHub account
- Vercel account
- PlanetScale account

### 2. 🥈 Railway

**Advantages:**
- Simple deployment process
- Integrated database
- Automatic deployments
- Built-in monitoring

### 3. 🥉 Render

**Advantages:**
- Free tier available
- PostgreSQL support
- Automatic SSL
- Easy environment management

## 🔧 Pre-deployment Setup

### 1. Environment Variables

Create a `.env.production` file with the following variables:

```env
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=sulafa_pos

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# File Upload Settings
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Application Settings
APP_NAME=SULAFA POS Restaurant
APP_URL=https://your-app-domain.com
API_URL=https://your-app-domain.com/api

# Security Settings
BCRYPT_ROUNDS=10
SESSION_TIMEOUT=1800000

# Tax and Service Settings
DEFAULT_TAX_RATE=0.15
DEFAULT_SERVICE_CHARGE=0.10
```

### 2. Build Configuration

Ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "server": "node server.js",
    "dev": "concurrently \"npm start\" \"npm run server\""
  }
}
```

## 🚀 Deployment Instructions

### Option 1: Vercel + PlanetScale

#### Step 1: Setup PlanetScale Database

1. Go to [planetscale.com](https://planetscale.com)
2. Create a new account
3. Create a new database named `sulafa-pos`
4. Get connection credentials from the dashboard

#### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy the project

#### Step 3: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
NODE_ENV=production
PORT=5000
DB_HOST=aws.connect.psdb.cloud
DB_USER=your_planetscale_username
DB_PASSWORD=your_planetscale_password
DB_NAME=sulafa_pos
JWT_SECRET=your-super-secret-jwt-key
```

### Option 2: Railway

#### Step 1: Setup Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create a new project from your repository

#### Step 2: Add Database

1. Add a MySQL service to your project
2. Note the database connection details

#### Step 3: Configure Environment

1. Add environment variables in Railway dashboard
2. Deploy the application

### Option 3: Render

#### Step 1: Setup Render

1. Go to [render.com](https://render.com)
2. Create a new web service
3. Connect your GitHub repository

#### Step 2: Configure Build

- Build Command: `npm install && npm run build`
- Start Command: `npm run server`

#### Step 3: Add Database

1. Create a PostgreSQL database
2. Update environment variables accordingly

## 📁 Required Files

Ensure these files are present in your repository:

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ]
}
```

### `Dockerfile` (Optional)
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "server"]
```

## 🔐 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique JWT secrets
- Rotate database passwords regularly

### 2. Database Security
- Use SSL connections for database
- Implement proper user permissions
- Regular database backups

### 3. Application Security
- Keep dependencies updated
- Implement rate limiting
- Use HTTPS only

## 📊 Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Database connection works
- [ ] Login functionality works
- [ ] POS system functions properly
- [ ] Reports generate correctly
- [ ] File uploads work
- [ ] SSL certificate is active
- [ ] Environment variables are set
- [ ] Database is properly configured

## 🔍 Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

#### Database Connection Issues
- Verify connection string format
- Check firewall settings
- Ensure database user has proper permissions

#### Environment Variable Issues
- Confirm all required variables are set
- Check for typos in variable names
- Verify variable values are correct

### Debugging Steps

1. **Check Application Logs**
   - Review deployment logs
   - Monitor runtime logs
   - Check error messages

2. **Verify Configuration**
   - Confirm environment variables
   - Check database settings
   - Verify build configuration

3. **Test Locally**
   - Run application locally
   - Test with production environment variables
   - Verify all features work

## 📞 Support

For deployment assistance:
- Check platform documentation
- Review application logs
- Contact technical support if needed

## 🎉 Success!

Once deployed successfully, your SULAFA POS Restaurant system will be available at your chosen domain with all features fully functional.

### Login Credentials:
- Email: admin@sulafa.com
- Password: admin123

---

*This deployment guide ensures a smooth and successful deployment process for the SULAFA Restaurant Management System.*

© 2024 SULAFA PVT LTD. All rights reserved.