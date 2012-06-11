<?php

class TileMapConverter {

    private $map = array();
    private $sprites = array();

    public function convert($file) {
        if (!file_exists($file))
            return "file not exists";
        $xml = simplexml_load_file($file);
        $this->createMap($xml);
        $this->createAssets($xml);

        $this->pr($this->map);
        $this->pr($this->sprites);
    }

    private function createAssets($xml) {
        $r = array();
        foreach ($xml->tileset as $tileset) {
            $ignore = false;
            foreach ($tileset->properties as $property) {

                foreach ($property as $p) {
                  
                    if ($p['name'] == 'ignore')
                       $ignore = false;
                }
            }
            
            if (!$ignore) {
                $offsetX = 0;
                $offsetY = 0;
                $offsetX = (int) $tileset->tileoffset['x'];
                $offsetY = (int) $tileset->tileoffset['y'];
                $w = $tileset['tilewidth'] + $offsetX;
                $h = $tileset['tileheight'] + $offsetY;
                $id = (int) $tileset['firstgid'];
                $img = (string) $tileset->image['source'];
                $maxX = round((int) $tileset->image['width'] / $w);
                $maxY = round((int) $tileset->image['height'] / $h);
                $data = array();
                for ($y = 0; $y < $maxY; $y++) {
                    for ($x = 0; $x < $maxX; $x++) {
                        $data[] = sprintf('%d:[%d,%d]', $id, $x, $y);
                        $id++;
                    }
                }
                $r[] = sprintf('Crafty.sprite(%d,%d,"%s",{' . "\n" . '%s' . "\n" . '}0,0,%d,%d);', $w-$offsetX, $h-$offsetY, $img, implode(",\n", $data), $offsetX, $offsetY);
            }
           // $this->pr($tileset);
        }
        $this->sprites = implode("\n", $r);

        //$this->sprites = ($r);
    }

    private function createMap($xml) {
        $r = array(
            'metadata' => array(
                'orientation' => (string) $xml['orientation'],
                'width' => (string) $xml['width'],
                'height' => (string) $xml['height'],
                'tilewidth' => (string) $xml['tilewidth'],
                'tileheight' => (string) $xml['tileheight']
            )
        );
        foreach ($xml->properties as $property) {

            foreach ($property as $p) {

                if ($p['name'] == 'title')
                    $r['metadata']['title'] = (string) $p['value'];
            }
        }
        foreach ($xml->layer as $layer) {

            if (!isset($layer['visible'])) {
                foreach ($layer->data as $data) {
                    //ignore attributes, take just the data
                    $d = array_values((array) $data);
                    $d = str_replace("\n", "", ($d[count($d) - 1]));
                }

                $r['layers'][(string) $layer['name']] = $d;
            }
        }

        $this->map = ($r);
    }

    public function save($output) {
        // file_put_contents($output, $this->map);
    }

    private function pr($value) {
        echo '<pre>' . print_r($value, true) . '</pre>';
    }

}