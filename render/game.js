$(function(){
    Crafty.init();
    
    var backgrounds = frontier_outpost.layers.background.split(",");
    var objects = frontier_outpost.layers.object.split(",");
    var collisions = frontier_outpost.layers.collision.split(",");

    var vp = Crafty.viewport;
    var map = frontier_outpost.metadata;
  
    var iso = Crafty.diamondIso.init(map.tilewidth,map.tileheight,map.width,map.height);
    Crafty.c("BaseTile",{
        init:function(){
            this.w = map.tilewidth;
            this.h = map.tileheight;
        }
    })
  
    iso.centerAt(25,25);
    //Crafty.background("url(frontier_outpost.png) #000 "+(Crafty.viewport.x)+"px "+ (Crafty.viewport.y)+"px no-repeat");

  
    var i = 0;
  //  for(var y = 0;y<map.height;y++){
    //    for(var x = 0;x<map.width;x++){
               for(var y = 0;y<40;y++){
        for(var x = 0;x<40;x++){
            var object = objects[i];
            var collision = collisions[i];
            var background = backgrounds[i];
            var tile = null;
            if(background > 0){
                tile = Crafty.e("2D","DOM","Text",background);
                var offsetX = 0;
                var offsetY = 0;
                if(tile.__offset !== undefined){
                    offsetX = tile.__offset[0];
                    offsetY = tile.__offset[1];
                }
    
                iso.place(tile,x,y,offsetX,offsetY,0);
            }
            if(object > 0){
                tile = Crafty.e("2D","DOM","Text",object,1);
                if(collision > 0){
                    tile.addComponent("Solid");
                }
               
                iso.place(tile,x,y,tile.__offset[0],tile.__offset[1]); 
            }else if(collision > 0){
            //  var collisionTile = Crafty.e("2D","DOM","Solid","BaseTile","Color");
            // iso.place(collisionTile,x,y);
            }
            i++;
        }
        i = y*map.height;
    }
  
 
});
