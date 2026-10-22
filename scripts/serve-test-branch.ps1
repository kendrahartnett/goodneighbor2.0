param(
  [Parameter(Mandatory = $true)][string]$Branch,
  [Parameter(Mandatory = $true)][string]$ExpectedHost,
  [ValidateSet('start', 'dev')][string]$Mode = 'start'
)

$ErrorActionPreference = 'Stop'
if ($Mode -eq 'dev' -and (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue)) {
  throw 'Port 3000 is already in use. Stop the other local server with Ctrl+C, then run npm run dev:test again.'
}
$projectId = 'fragrant-heart-35231205'
$direct = (& neon connection-string $Branch --project-id $projectId).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Could not load the direct branch URL.' }
$pooled = (& neon connection-string $Branch --project-id $projectId --pooled).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Could not load the pooled branch URL.' }
if (([uri]$direct).Host -ne $ExpectedHost -or ([uri]$pooled).Host -ne $ExpectedHost.Replace('.c-7.', '-pooler.c-7.')) {
  throw 'The connection URLs do not match the intended isolated branch.'
}

$env:DIRECT_URL = $direct
$env:DATABASE_URL = $pooled
if ($Mode -eq 'dev') {
  Write-Output "Developing against isolated branch $Branch on http://localhost:3000 (credentials hidden)."
  & npm run dev -- --port 3000
} else {
  Write-Output "Serving the isolated branch $Branch on http://localhost:3001 (credentials hidden)."
  & npm run start -- --port 3001
}
