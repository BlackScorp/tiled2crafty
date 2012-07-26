$(function(){
    var size = $(document);
    
     var stage = new Kinetic.Stage({
        container: "game",
        width:800,
        height:600
    });
    

   
    var tilesets = frontier_outpost.tilesets;
    tilesets.splice(0,1); //remove collision assets
         var map = new Kinetic.Tiled(frontier_outpost,stage);
   
    var load_assets = function(i,img){
      
        tilesets[i-1].img = img;
        if(i == tilesets.length) {
            map.createSprites(tilesets);
          //  map.createMap();
        }
    }
    
    for(var i = 0,il = tilesets.length;i<il;i++){
        var set = tilesets[i];
        var img = new Image();
        img.onload = load_assets(i+1,img);
        img.src = set.image;
    }

      
   

});
