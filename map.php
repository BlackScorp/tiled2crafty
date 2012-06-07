<?php 

class TileMapConverter{
    private $map = array();
    private $sprites = array();
    public function convert($file){
        if(!file_exists($file)) return "file not exists";
         $xml = simplexml_load_file($file);
         $this->createMap($xml);
        
     
          $this->pr(($this->map));
        
    }
    private function createMap($xml){
            $r = array(
             'metadata'=>array(
                 
                 'orientation'=>(string)$xml['orientation'],
                 'width'=>(string)$xml['width'],
                 'height'=>(string)$xml['height'],
                 'tilewidth'=>(string)$xml['tilewidth'],
                 'tileheight'=>(string)$xml['tileheight']
             )
         );
         foreach($xml->properties as $property){
            
             foreach($property as $p){
                 
                 if($p['name'] == 'title') $r['metadata']['title']= (string)$p['value'];
             }
         }
         foreach($xml->layer as $layer){
           
             if(!isset($layer['visible'])){
                 foreach($layer->data as $data){
                     //ignore attributes, take just the data
                 $d = array_values((array)$data);
                    $d = str_replace("\n","",($d[count($d)-1]));
                 }
                
                 $r['layers'][(string)$layer['name']]=$d;
            }
         }
         
         $this->map = json_encode($r);
    }
    public function save($output){
        file_put_contents($output, $this->map);
    }
    private function pr($value){
        echo '<pre>'.print_r($value,true).'</pre>';
    }
}