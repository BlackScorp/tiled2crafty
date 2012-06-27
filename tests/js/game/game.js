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
        
        for(var y = 0,yl = this.height;y<yl;y+=128){
            
            for(var x = 0,xl = this.width;x<xl;x+=64){
                
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
        
        for(var y = 0,yl=64;y<yl;y++){
            
            for(var x= 0,xl=64;x<xl;x++){
                i = y*map.height+x;
                var tile = bgTiles[i];
              
                if(tile > 0 && tile < 144){
                  
                    var sprite = spriteLayer.get('.'+tile)[0];
                    if(sprite){
                        sprite.visible = true;
                         sprite.cloneTo(backgroundLayer);
                         
                    }    
                }
            }
        }
        console.log( spriteLayer.get('.16')[0]);
        backgroundLayer.draw();
        stage.add(backgroundLayer);

        console.log(backgroundLayer);
        console.log(spriteLayer);
    }
      
   

});
