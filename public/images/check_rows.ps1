Add-Type -AssemblyName System.Drawing

$p = "C:\Users\GGEZ\Documents\GitHub\vortex-gaming\public\images\vortex_landing_reference.jpg"
$b = [System.Drawing.Bitmap]::FromFile($p)

for ($y = $b.Height - 6; $y -lt $b.Height; $y++) {
    $p1 = $b.GetPixel(300, $y)
    $p2 = $b.GetPixel(800, $y)
    $p3 = $b.GetPixel(1200, $y)
    Write-Host "Row $y : (300: R=$($p1.R) G=$($p1.G) B=$($p1.B)) (800: R=$($p2.R) G=$($p2.G) B=$($p2.B)) (1200: R=$($p3.R) G=$($p3.G) B=$($p3.B))"
}
$b.Dispose()
