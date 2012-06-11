$(function(){
    Crafty.init();
    var objects = frontier_outpost.layers.object.split(",");
    var collisions = frontier_outpost.layers.collision.split(",");

    var vp = Crafty.viewport;
    var map = frontier_outpost.metadata;
 
    var iso = Crafty.diamondIso.init(64,32,64,64);
     
  // var tile = Crafty.e("2D","DOM",144);
   //iso.place(tile,0,0);
   iso.centerAt(25,25);
   Crafty.background("url(frontier_outpost.png) #000 "+Crafty.viewport.x+"px "+ Crafty.viewport.y+"px no-repeat");
     var i = 0;
    for(var y = 0;y<64;y++){
        for(var x = 0;x<64;x++){
            var object = objects[i];
           
            if(object > 0){
              var tile = Crafty.e("2D","DOM","Text",object)
             
              iso.place(tile,x,y); 
            
            }
            i++;
        }
        i = y*64;
    }

 
});