Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap("C:\Users\GGEZ\Documents\GitHub\vortex-gaming\public\images\vortex_landing_reference.jpg")

# Card positions in 1662x489:
# Inferno: x: 1205..1315, y: 175..435
# Mirage: x: 1315..1500, y: 80..465
# Nuke: x: 1500..1615, y: 185..440

$rectInferno = New-Object System.Drawing.Rectangle(1200, 170, 120, 270)
$bmpInferno = $b.Clone($rectInferno, $b.PixelFormat)
$bmpInferno.Save("C:\Users\GGEZ\Documents\GitHub\vortex-gaming\public\images\card_inferno.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpInferno.Dispose()

$rectMirage = New-Object System.Drawing.Rectangle(1310, 75, 195, 395)
$bmpMirage = $b.Clone($rectMirage, $b.PixelFormat)
$bmpMirage.Save("C:\Users\GGEZ\Documents\GitHub\vortex-gaming\public\images\card_mirage.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpMirage.Dispose()

$rectNuke = New-Object System.Drawing.Rectangle(1495, 180, 125, 265)
$bmpNuke = $b.Clone($rectNuke, $b.PixelFormat)
$bmpNuke.Save("C:\Users\GGEZ\Documents\GitHub\vortex-gaming\public\images\card_nuke.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpNuke.Dispose()

$b.Dispose()
Write-Host "Cards cropped successfully!"
