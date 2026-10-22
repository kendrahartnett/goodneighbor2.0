param(
  [Parameter(Mandatory = $true)][string]$Branch,
  [Parameter(Mandatory = $true)][string]$ExpectedHost
)

$ErrorActionPreference = 'Stop'
$projectId = 'fragrant-heart-35231205'
$direct = (& neon connection-string $Branch --project-id $projectId).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Could not load the direct branch URL.' }
$pooled = (& neon connection-string $Branch --project-id $projectId --pooled).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Could not load the pooled branch URL.' }

$directHost = ([uri]$direct).Host
$pooledHost = ([uri]$pooled).Host
if ($directHost -ne $ExpectedHost -or $pooledHost -ne $ExpectedHost.Replace('.c-7.', '-pooler.c-7.')) {
  throw 'The connection URLs do not match the intended isolated branch.'
}

$env:DIRECT_URL = $direct
$env:DATABASE_URL = $pooled
Write-Output "Testing branch $Branch at $directHost (credentials hidden)."
$before = & npx prisma migrate status 2>&1
$before | Write-Output
if ($LASTEXITCODE -ne 0 -and (($before -join ' ') -notmatch '20261012000000_listing_requests_and_publication')) {
  throw 'Migration status failed before deployment.'
}
& npm run db:deploy
if ($LASTEXITCODE -ne 0) { throw 'Migration deployment failed.' }
& npx prisma migrate status
if ($LASTEXITCODE -ne 0) { throw 'Migration status failed after deployment.' }
& npx tsx scripts/verify-publication.ts
if ($LASTEXITCODE -ne 0) { throw 'Publication backfill verification failed.' }
