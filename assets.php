<?php

class AssetsConverter {

    private $inputDir = 'src';
    private $outputDir = 'result';
    private $assets = array();
 

    public function __construct() {
        ;
    }

    private function loadFiles() {
        foreach (scandir($this->inputDir) as $file) {
            if ($file !== '.' || $file !== '..') {
                $ext = pathinfo($file);
                $ext = $ext['extension'];
                if ($ext == 'tsx') {
                    $this->assets[] = $this->inputDir . '/' . $file;
                }
            }
        }
    }

    private function readFiles() {
        $output = '';
        if (count($this->assets) > 0) {
            foreach ($this->assets as $asset) {
                //  $xml = simplexml_load_string(file_get_contents($asset));
                $xml = simplexml_load_file($asset);
                // echo $this->pr($xml);
                
                $path = '';
                if($xml->properties){
                    foreach($xml->properties as $prop){
                        if ($prop->property['name'] == 'path') {
                           $path =  $prop->property['value'];
                        }
                    }
                }
                
            
               

                if (count($xml->tile) > 1) {
                    $names = array();
                        $id = 0;
                    for ($y = 0; $y < floor($xml->image['height'] / $xml['tileheight']); $y++) {
                        for ($x = 0; $x < floor($xml->image['width'] / $xml['tilewidth']); $x++) {
                            
                            if ($xml->tile[$id]) {
                                foreach ($xml->tile[$id]->properties as $prop) {
                                    if ($prop->property['name'] == 'name') {
                                        $names[$id]= $prop->property['value'].sprintf(':[%d,%d]',$x,$y);
                                    } else {
                                        $names [$id]= 'unnamed'.$id.sprintf(':[%d,%d]',$x,$y);
                                    }
                                   
                                }
                            }else{
                               $names [$id]= 'unnamed'.$id.sprintf(':[%d,%d]',$x,$y); 
                            }
                            $id++;
                        }
                    }
                         $output .= sprintf('Crafty.sprite(%d,%d,"%s",{
                    %s
                 });' . "\r\n", $xml['tilewidth'], $xml['tileheight'], $path.$xml->image['source'], implode(','."\n",$names));
                } else {
                     $names = '';
                    foreach ($xml->tile->properties as $prop) {
                        if ($prop->property['name'] == 'name') {
                            $names = $prop->property['value'];
                        } else {
                            $names = $xml->image['source'];
                        }
                        $names .= ':[0,0]';
                    }
                         $output .= sprintf('Crafty.sprite(%d,%d,"%s",{
                    %s
                 });' . "\n", $xml['tilewidth'], $xml['tileheight'], $path.$xml->image['source'], $names);
                }

           
                  
            }
        }
        if(file_put_contents($this->outputDir.'/sprites.js', $output)) {
            echo '<h1 style="color:green">Assets created</h1> <br/>'.nl2br(file_get_contents($this->outputDir.'/sprites.js'));
        }
    }

    public function convert() {
        $this->loadFiles();
        $this->readFiles();

    }

    private function pr($val) {
        echo '<pre>' . print_r($val, true) . '</pre>';
    }

}