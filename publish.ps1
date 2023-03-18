$files = @("package.json", "LICENSE", "README.md", "package-lock.json")

Remove-Item -Recurse node_modules
Invoke-Expression "npm install"

if (Test-Path -Path lib) {
  Remove-Item -Recurse lib
}

Invoke-Expression "npm run build"
Remove-Item -Recurse ./lib/*.test.*
Remove-Item -Recurse ./lib/esm/*.test.*

foreach ($file in $files) {
  Invoke-Expression "copy $($file) lib/$($file)"
}

Set-Content ./lib/esm/package.json '{ "type": "module" }'

Invoke-Expression "npm test"

Invoke-Expression "cd lib"
Invoke-Expression "npm publish"
