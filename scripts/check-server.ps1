try {
  $r = Invoke-WebRequest -Uri 'http://[::1]:5174/' -Timeout 10
  Write-Output ("HTTP OK: " + $r.StatusCode)
} catch {
  Write-Output ("Request failed: " + $_.Exception.Message)
}
