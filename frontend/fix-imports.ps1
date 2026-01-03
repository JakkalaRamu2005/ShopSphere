# Fix all context imports
$files = Get-ChildItem -Path "src\components" -Recurse -Filter *.jsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $updated = $content `
        -replace 'from "\.\.\/AuthContext"', 'from "../../context/AuthContext"' `
        -replace "from '\.\.\/AuthContext'", "from '../../context/AuthContext'" `
        -replace 'from "\.\.\/CartContext"', 'from "../../context/CartContext"' `
        -replace "from '\.\.\/CartContext'", "from '../../context/CartContext'" `
        -replace 'from "\.\.\/WishlistContext"', 'from "../../context/WishlistContext"' `
        -replace "from '\.\.\/WishlistContext'", "from '../../context/WishlistContext'" `
        -replace 'from "\./AuthContext"', 'from "../context/AuthContext"' `
        -replace "from '\./AuthContext'", "from '../context/AuthContext'"
    
    if ($content -ne $updated) {
        Set-Content -Path $file.FullName -Value $updated -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Done!"
