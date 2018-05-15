$files = @("package.json", "LICENSE", "README.md", "yarn.lock")

Invoke-Expression "npm run build"

foreach ($file in $files) {
    Invoke-Expression "copy $($file) lib/$($file)"
}

Invoke-Expression "cd lib"
Invoke-Expression "npm publish"