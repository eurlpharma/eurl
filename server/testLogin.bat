@echo off
echo Testing login...
curl -X POST https://eurl-server.onrender.com/api/users/login -H "Content-Type: application/json" -d "{\"email\":\"admin@healthy.com\",\"password\":\"admin123\"}"
echo.
echo Testing admin dashboard...
curl -X GET https://eurl-server.onrender.com/api/admin/dashboard -H "Authorization: Bearer YOUR_TOKEN_HERE"
pause 