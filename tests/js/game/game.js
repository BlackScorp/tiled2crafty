$(function(){
    var size = $(document);
    
    var stage = new Kinetic.Stage({
        container: "game",
        width:800,
        height:600
    });
    

   
    var tilesets = frontier_outpost.tilesets;
    var map = new Kinetic.Tiled(frontier_outpost,stage);
   

<<<<<<< HEAD
=======
    var loaded = 0;
    for(var i = 0,il = tilesets.length-1;i<il;i++){
        var set = tilesets[i];
        var img = new Image();
        img.onload = function(){
            tilesets[i].img = this;
            loaded++;
     
            if(loaded == il) map.createSprites();

  
        }
        
        img.src = set.image;
    }

      
>>>>>>> 58aa35d629af3fcf2d3bf93eeda7f9a91096d5c6
   

});
