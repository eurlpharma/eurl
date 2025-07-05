@echo off
echo Testing login...
curl -X POST http://192.168.1.11:5000/api/users/login -H "Content-Type: application/json" -d "{\"email\":\"admin@healthy.com\",\"password\":\"admin123\"}"
echo.
echo Testing admin dashboard...
curl -X GET http://192.168.1.11:5000/api/admin/dashboard -H "Authorization: Bearer YOUR_TOKEN_HERE"
pause 