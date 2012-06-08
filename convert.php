<?php
include 'map.php';

$converter = new TileMapConverter();
$converter->convert('src/frontier_outpost.tmx');
$converter->save('src/frontier_outpost.js');