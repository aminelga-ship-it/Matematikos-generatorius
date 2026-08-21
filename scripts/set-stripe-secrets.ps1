# Nuskaito .env.local ir nustato Stripe slaptus raktus Supabase Edge Functions.
# Paleiskite po to, kai .env.local uzpildytas: npm run deploy:stripe-secrets

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env.local"

if (-not (Test-Path $envFile)) {
  Write-Error ".env.local nerastas: $envFile"
}

$vars = @{}
Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { return }
  $idx = $line.IndexOf("=")
  if ($idx -lt 1) { return }
  $key = $line.Substring(0, $idx).Trim()
  $val = $line.Substring($idx + 1).Trim()
  if ($val -ne "") {
    $vars[$key] = $val
  }
}

$required = @(
  "STRIPE_SECRET_KEY",
  "PRICE_MONTHLY",
  "PRICE_YEARLY",
  "PRICE_UNLIMITED_MONTHLY",
  "PRICE_EXTRA_COINS"
)

foreach ($name in $required) {
  if (-not $vars.ContainsKey($name)) {
    Write-Error "Truksta $name .env.local faile."
  }
}

Write-Host "Nustatome Supabase secrets..."
npx supabase secrets set `
  STRIPE_SECRET_KEY=$($vars["STRIPE_SECRET_KEY"]) `
  PRICE_MONTHLY=$($vars["PRICE_MONTHLY"]) `
  PRICE_YEARLY=$($vars["PRICE_YEARLY"]) `
  PRICE_UNLIMITED_MONTHLY=$($vars["PRICE_UNLIMITED_MONTHLY"]) `
  PRICE_EXTRA_COINS=$($vars["PRICE_EXTRA_COINS"])

if ($vars.ContainsKey("STRIPE_WEBHOOK_SECRET")) {
  npx supabase secrets set STRIPE_WEBHOOK_SECRET=$($vars["STRIPE_WEBHOOK_SECRET"])
} else {
  Write-Warning "STRIPE_WEBHOOK_SECRET nerastas - webhook veiks tik po Stripe Dashboard webhook sukurimo."
}

if ($vars.ContainsKey("SITE_URL")) {
  npx supabase secrets set SITE_URL=$($vars["SITE_URL"])
}

Write-Host "Baigta. Dabar paleiskite npm run deploy:functions"
