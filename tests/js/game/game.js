$(function(){
    var size = $(document);
    
    var stage = new Kinetic.Stage({
        container: "game",
        width:800,
        height:600
    });
    var spriteLayer = new Kinetic.Layer();
    var grassland = new Image();
    grassland.onload = function(){
        var i = 16;
        for(var y = 0,yl = 1024;y<yl;y+=128){
            
            for(var x = 0,xl = 1024;x<xl;x+=64){
                var settings =  {
                    none:[{
                          x:x,y:y,
                        width:64,
                        height:128
                    }]
                }
                var sprite = new Kinetic.Sprite({
                
                    image:grassland,
                    name:i,
                    animation:'none',
                    animations:settings,
                    visible:false
                });
                spriteLayer.add(sprite);
                i++;
            }
          
          
        }
        stage.add(spriteLayer);
        render();
    }
    grassland.src = "img/grassland.png";
  
    function render(){
        var map = frontier_outpost.metadata;
        var bgTiles = frontier_outpost.layers.background.split(",");
        var backgroundLayer = new Kinetic.Layer();
        var i = 0;
        for(var y = 0,yl=10;y<yl;y++){
            
            for(var x= 0,xl=10;x<xl;x++){
                i = y*map.height+x;
                var tile = bgTiles[i];
                if(tile > 0 && tile < 144){
                    var sprite = spriteLayer.get('.'+tile);
                    sprite = sprite[0];
                    if(sprite){
                        console.log(sprite);
                    console.log(tile);
                 //sprite.moveTo(backgroundLayer); 
                    }
                   
                   
                 
                }
            }
        }
        stage.add(backgroundLayer);
        stage.draw();
    }
      
   

});
