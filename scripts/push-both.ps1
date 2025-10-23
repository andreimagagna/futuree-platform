param(
  [string]$Branch
)

function Write-Info($msg) { Write-Host "[push-both] $msg" -ForegroundColor Cyan }
function Write-Err($msg) { Write-Host "[push-both] $msg" -ForegroundColor Red }

# Detect current branch if not provided
if (-not $Branch -or $Branch -eq "") {
  try {
    $Branch = (git rev-parse --abbrev-ref HEAD).Trim()
  } catch {
    Write-Err "Não foi possível detectar a branch atual. Passe com -Branch <nome>."; exit 1
  }
}

Write-Info "Branch alvo: $Branch"

# Ensure remotes exist
$remotes = @("origin", "platform")
foreach ($r in $remotes) {
  $exists = git remote | Select-String -SimpleMatch $r
  if (-not $exists) {
    Write-Err "Remote '$r' não encontrado. Pulei esse remote."
  }
}

# Push to each remote
foreach ($r in $remotes) {
  $exists = git remote | Select-String -SimpleMatch $r
  if ($exists) {
    Write-Info "Fazendo push para $r/$Branch..."
    try {
      git push -u $r $Branch
    } catch {
      Write-Err "Falha ao enviar para $r. Verifique credenciais/permissões."
    }
  }
}

Write-Info "Concluído."
