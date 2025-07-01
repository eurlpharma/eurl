# PowerShell script to remove comments from TypeScript/TSX files

$files = Get-ChildItem -Path "src" -Recurse -Include "*.ts","*.tsx"

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Remove single-line comments (// ...)
    $content = $content -replace '//.*$', '' -replace '//.*', ''
    
    # Remove multi-line comments (/* ... */)
    $content = $content -replace '/\*.*?\*/', '' -replace '/\*[\s\S]*?\*/', ''
    
    # Remove JSX comments ({/* ... */})
    $content = $content -replace '\{\s*/\*.*?\*/\s*\}', ''
    
    # Remove empty lines that might be left after comment removal
    $content = $content -replace '(?m)^\s*$\r?\n', ''
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Comment removal completed!" 