$(function(){
    Crafty.init();
    var tiles = frontier_outpost.layers.object.split(",");
   
    var iso = Crafty.isometric.init(frontier_outpost.metadata.tilewidth,frontier_outpost.metadata.tileheight);
    
    //Crafty.e("2D","DOM","Text",209);
       
    for(var y = 0;y<frontier_outpost.metadata.height;y++){
        for(var x = 0;x<frontier_outpost.metadata.width;x++){
            var sprite = tiles[x*y];
      
            if(sprite > 0){
              var tile = Crafty.e("2D","DOM","Text",sprite);//.text("X:"+x+"/Y:"+y);
               iso.place(tile,x,y); 
            }
            
        }
    }
});