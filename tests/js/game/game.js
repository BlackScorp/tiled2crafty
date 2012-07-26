$(function(){
    var size = $(document);
    
    var stage = new Kinetic.Stage({
        container: "game",
        width:800,
        height:600,
        x:-2000,
        y:-10
        
    });
    

   
    var tilesets = frontier_outpost.tilesets;
    var map = new Kinetic.Tiled(frontier_outpost,stage);
   

    var loaded = 0;
    var sprites = {};
    for(var i = 0,il = tilesets.length;i<il;i++){
        var set = tilesets[i];
        var img = new Image();
        img.onload = function(){
            
           
          tilesets[loaded].img = this;
            
            loaded++;
            if(loaded == tilesets.length){
                map.createSprites();
               map.createMap();
            }
        }
        
        img.src = set.image;
    }


   

});
