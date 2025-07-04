# 🔁 Mută fișiere frontend în structura corectă
$frontendPath = "frontend\src"

# Creează folderele (dacă nu există deja)
New-Item -ItemType Directory -Force -Path "$frontendPath\features\Auth"
New-Item -ItemType Directory -Force -Path "$frontendPath\features\ClientProfile"
New-Item -ItemType Directory -Force -Path "$frontendPath\auth"
New-Item -ItemType Directory -Force -Path "$frontendPath\api"
New-Item -ItemType Directory -Force -Path "$frontendPath\components\common"

# Mută fișierele reale (dacă există)
Move-Item -Path "frontend\Login.tsx" -Destination "$frontendPath\features\Auth\Login.tsx" -ErrorAction SilentlyContinue
Move-Item -Path "frontend\src\Signup.tsx" -Destination "$frontendPath\features\Auth\Signup.tsx" -ErrorAction SilentlyContinue
Move-Item -Path "frontend\src\components\ClientSetupForm.tsx" -Destination "$frontendPath\features\ClientProfile\ClientSetupForm.tsx" -ErrorAction SilentlyContinue
Move-Item -Path "frontend\src\contexts\AuthContext.tsx" -Destination "$frontendPath\auth\AuthContext.tsx" -ErrorAction SilentlyContinue
Move-Item -Path "frontend\src\api\auth.ts" -Destination "$frontendPath\api\axios.ts" -ErrorAction SilentlyContinue
Move-Item -Path "frontend\src\components\ProtectedRoute.tsx" -Destination "$frontendPath\auth\ProtectedRoute.tsx" -ErrorAction SilentlyContinue
Move-Item -Path "frontend\src\pages\ConfirmEmail.tsx" -Destination "$frontendPath\pages\ConfirmEmail.tsx" -ErrorAction SilentlyContinue
Move-Item -Path "frontend\src\pages\Dashboard.tsx" -Destination "$frontendPath\pages\Dashboard.tsx" -ErrorAction SilentlyContinue

Write-Host "`n✅ Fișierele au fost mutate în structura profesională!"
