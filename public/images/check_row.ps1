Add-Type -AssemblyName System.Drawing

$p = "C:\Users\GGEZ\Documents\GitHub\vortex-gaming\public\images\vortex_landing_reference.jpg"
$b = [System.Drawing.Bitmap]::FromFile($p)

Write-Host "Width: $($b.Width) Height: $($b.Height)"
$y = $b.Height - 1
$whiteCount = 0
for ($x = 0; $x -lt $b.Width; $x += 10) {
    $pixel = $b.GetPixel($x, $y)
    if ($pixel.R -gt 150) {
        $whiteCount++
    }
}
Write-Host "Row $y has $whiteCount white pixels (out of $([int]($b.Width/10)))"
$b.Dispose()
