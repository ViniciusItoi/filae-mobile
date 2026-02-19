@echo off
echo ========================================
echo FILAE - Diagnostico de Conexao Backend
echo ========================================
echo.

echo 1. Testando conexao com backend...
echo.

REM Teste 1: Backend na porta 8080
echo [Teste 1] Verificando se backend esta rodando na porta 8080...
netstat -an | findstr :8080 > nul
if %errorlevel% equ 0 (
    echo    ✓ Porta 8080 esta em uso ^(backend provavelmente rodando^)
) else (
    echo    ✗ Porta 8080 NAO esta em uso
    echo    ^! ERRO: Backend nao esta rodando!
    echo.
    echo    Solucao: Inicie o backend com:
    echo    cd "C:\Users\Vinicius\Desktop\trabalho Fase 2\filae-api"
    echo    mvn spring-boot:run
    echo.
    pause
    exit /b 1
)
echo.

REM Teste 2: Health check do backend
echo [Teste 2] Testando health check do backend...
curl -s http://localhost:8080/api/health > nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Backend respondendo em http://localhost:8080/api/health
    echo.
    echo    Resposta do backend:
    curl -s http://localhost:8080/api/health
) else (
    echo    ✗ Backend NAO esta respondendo em /api/health
    echo.
    echo    Tentando sem o /api...
    curl -s http://localhost:8080/health > nul 2>&1
    if %errorlevel% equ 0 (
        echo    ✓ Backend responde em http://localhost:8080/health
        echo    ^! AVISO: Backend NAO usa prefixo /api
        echo.
        echo    Solucao: Edite src/config/env.config.ts e mude:
        echo    API_PREFIX: '/api'  para  API_PREFIX: ''
    ) else (
        echo    ✗ Backend nao responde em nenhum endpoint
    )
)
echo.

REM Teste 3: Dispositivo Android conectado
echo [Teste 3] Verificando dispositivo Android...
adb devices 2>nul | findstr "device" | findstr -v "List" > nul
if %errorlevel% equ 0 (
    echo    ✓ Dispositivo Android conectado
    adb devices | findstr -v "List"
) else (
    echo    ✗ Nenhum dispositivo Android detectado
    echo    ^! AVISO: Verifique a conexao USB/WiFi
)
echo.

REM Teste 4: Metro bundler rodando
echo [Teste 4] Verificando Metro bundler na porta 8081...
netstat -an | findstr :8081 > nul
if %errorlevel% equ 0 (
    echo    ✓ Metro bundler rodando na porta 8081
) else (
    echo    ✗ Metro bundler NAO esta rodando
    echo    ^! AVISO: Execute 'npm start' em outro terminal
)
echo.

echo ========================================
echo RESUMO:
echo ========================================
echo.
echo Configuracao do App:
echo   - Base URL: http://10.0.2.2:8080/api
echo   - Dispositivo Android usa 10.0.2.2 para acessar localhost
echo.
echo Teste manual no navegador:
echo   http://localhost:8080/api/health
echo.
echo Se o teste manual funcionar mas o app nao:
echo   1. Verifique src/config/env.config.ts
echo   2. Reload o app (pressione 'r' no Metro)
echo   3. Use o componente ConnectionTest no app
echo.
pause

