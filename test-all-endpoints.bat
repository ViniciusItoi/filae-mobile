@echo off
REM Test all Filae API endpoints and capture responses
REM Adjust BASE_URL if needed

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8080/api
set OUTPUT_FILE=api_responses.json

echo Testando todos os endpoints do Filae API...
echo.

REM Test 1: Health Check
echo === HEALTH CHECK ===
curl -s %BASE_URL%/health
echo.
echo.

REM Test 2: Login (first to get token)
echo === LOGIN ===
set "LOGIN_RESPONSE="
for /f "delims=" %%A in ('curl -s -X POST %BASE_URL%/auth/login -H "Content-Type: application/json" -d "{\\"email\\":\\"alice@example.com\\",\\"password\\":\\"SecurePass123!\\"}"') do (
    set "LOGIN_RESPONSE=!LOGIN_RESPONSE!%%A"
)
echo !LOGIN_RESPONSE!
echo.
echo.

REM Extract token from response (basic extraction)
for /f "tokens=*" %%A in ('echo !LOGIN_RESPONSE! ^| findstr /C:"token"') do (
    set "TOKEN_LINE=%%A"
)
echo Token extracted from login response
echo.

REM Test 3: Get Current User (requires token from login)
echo === GET CURRENT USER ===
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." %BASE_URL%/users/me
echo.
echo.

REM Test 4: Get Establishments
echo === GET ESTABLISHMENTS ===
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." %BASE_URL%/establishments
echo.
echo.

REM Test 5: Get Favorites
echo === GET FAVORITES ===
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." %BASE_URL%/favorites
echo.
echo.

REM Test 6: Get My Queues
echo === GET MY QUEUES ===
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." %BASE_URL%/queues/my-queues
echo.
echo.

REM Test 7: Get Notifications
echo === GET NOTIFICATIONS ===
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." %BASE_URL%/notifications
echo.
echo.

REM Test 8: System Statistics
echo === SYSTEM STATISTICS ===
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." %BASE_URL%/health/stats
echo.
echo.

echo ========================================
echo Testes completos!
echo ========================================

pause

