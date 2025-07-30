@echo off
echo ========================================
echo    SULAFA PVT LTD - Restaurant POS
echo    Deployment Script for Vercel
echo ========================================
echo.

echo [1/5] Installing Vercel CLI...
npm install -g vercel
echo.

echo [2/5] Building the project...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [3/5] Logging into Vercel...
echo Please login to your Vercel account when prompted.
vercel login
echo.

echo [4/5] Deploying to Vercel...
vercel --prod
echo.

echo [5/5] Deployment completed!
echo.
echo ========================================
echo Your restaurant POS system is now live!
echo ========================================
echo.
echo Don't forget to:
echo 1. Set up your database on PlanetScale
echo 2. Add environment variables in Vercel dashboard
echo 3. Test the login with: admin@sulafa.com / admin123
echo.
pause