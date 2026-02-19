# Test all Filae API endpoints and display responses
# Run: .\test-endpoints.ps1

$BaseUrl = "http://localhost:8080/api"
$results = @()

Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🧪 Testando Todos os Endpoints da Filae API        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Health Check" -ForegroundColor Yellow
Write-Host "   GET $BaseUrl/health" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET
    Write-Host "   ✅ Resposta:" -ForegroundColor Green
    $response | ConvertTo-Json | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Login (to get token)
Write-Host "2. Login" -ForegroundColor Yellow
Write-Host "   POST $BaseUrl/auth/login" -ForegroundColor Gray
try {
    $loginBody = @{
        email = "alice@example.com"
        password = "SecurePass123!"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "   ✅ Resposta:" -ForegroundColor Green
    $loginResponse | ConvertTo-Json | ForEach-Object { Write-Host "      $_" -ForegroundColor White }

    $token = $loginResponse.token
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Get Current User
Write-Host "3. Get Current User" -ForegroundColor Yellow
Write-Host "   GET $BaseUrl/users/me" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/users/me" -Method GET -Headers $headers
    Write-Host "   ✅ Resposta:" -ForegroundColor Green
    $response | ConvertTo-Json | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Establishments
Write-Host "4. Get Establishments" -ForegroundColor Yellow
Write-Host "   GET $BaseUrl/establishments" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/establishments" -Method GET -Headers $headers
    Write-Host "   ✅ Resposta (primeiros 2):" -ForegroundColor Green
    $response | Select-Object -First 2 | ConvertTo-Json | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Favorites
Write-Host "5. Get Favorites" -ForegroundColor Yellow
Write-Host "   GET $BaseUrl/favorites" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/favorites" -Method GET -Headers $headers
    Write-Host "   ✅ Resposta:" -ForegroundColor Green
    if ($response.Count -gt 0) {
        $response | Select-Object -First 2 | ConvertTo-Json | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
    } else {
        Write-Host "      []" -ForegroundColor White
    }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get My Queues
Write-Host "6. Get My Queues" -ForegroundColor Yellow
Write-Host "   GET $BaseUrl/queues/my-queues" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/queues/my-queues" -Method GET -Headers $headers
    Write-Host "   ✅ Resposta:" -ForegroundColor Green
    $response | ConvertTo-Json | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Get Notifications
Write-Host "7. Get Notifications" -ForegroundColor Yellow
Write-Host "   GET $BaseUrl/notifications" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/notifications" -Method GET -Headers $headers
    Write-Host "   ✅ Resposta (primeiras 2):" -ForegroundColor Green
    $response | Select-Object -First 2 | ConvertTo-Json | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: System Statistics
Write-Host "8. System Statistics" -ForegroundColor Yellow
Write-Host "   GET $BaseUrl/health/stats" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/health/stats" -Method GET -Headers $headers
    Write-Host "   ✅ Resposta:" -ForegroundColor Green
    $response | ConvertTo-Json | ForEach-Object { Write-Host "      $_" -ForegroundColor White }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ Testes Completos!                               ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green

