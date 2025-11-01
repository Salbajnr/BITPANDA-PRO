# Clean up client directory
$clientDir = "c:\Users\DELL 7480\Desktop\True life Stor\BITPANDA-PRO\client"

# Remove node_modules and package-lock.json
if (Test-Path "$clientDir\node_modules") {
    Remove-Item -Path "$clientDir\node_modules" -Recurse -Force
}
if (Test-Path "$clientDir\package-lock.json") {
    Remove-Item -Path "$clientDir\package-lock.json" -Force
}

# Install dependencies
Set-Location $clientDir
npm install
