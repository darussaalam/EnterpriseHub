<?php
$sizes = [72, 96, 128, 144, 152, 192, 384, 512];

foreach ($sizes as $size) {
    $im = imagecreatetruecolor($size, $size);
    
    // Background blue #1e40af
    $blue = imagecolorallocate($im, 30, 64, 175);
    $cyan = imagecolorallocate($im, 14, 165, 233);
    $white = imagecolorallocate($im, 255, 255, 255);
    
    // Fill background
    imagefilledrectangle($im, 0, 0, $size, $size, $blue);
    
    // Draw rounded center box
    $pad = (int)($size * 0.2);
    imagefilledrectangle($im, $pad, $pad, $size - $pad, $size - $pad, $cyan);
    
    $innerPad = (int)($size * 0.3);
    imagefilledrectangle($im, $innerPad, $innerPad, $size - $innerPad, $size - $innerPad, $white);
    
    $corePad = (int)($size * 0.4);
    imagefilledrectangle($im, $corePad, $corePad, $size - $corePad, $size - $corePad, $blue);

    imagepng($im, __DIR__ . "/public/icons/icon-{$size}.png");
    imagedestroy($im);
}

echo "All icons generated successfully!\n";
