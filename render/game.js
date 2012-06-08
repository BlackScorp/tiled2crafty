$(function(){
    Crafty.init();
    var objects = frontier_outpost.layers.object.split(",");
    var collision = frontier_outpost.layers.collision.split(",");
    Crafty.viewport.y = -500;
    var vp = Crafty.viewport;
    var iso = Crafty.isometric.init(frontier_outpost.metadata.tilewidth,frontier_outpost.metadata.tileheight);
   // Crafty.background("url(frontier_outpost.png) -"+vp.x+"px -"+vp.y+"px no-repeat");
   // Crafty.e("2D","DOM","Text",242);
       
    for(var y = 0;y<frontier_outpost.metadata.height;y++){
       for(var x = 0;x<frontier_outpost.metadata.width;x++){
          var object = objects[y*x];
   
            if(object > 0){
              var tile = Crafty.e("2D","DOM","Text",object);//.text("X:"+x+"/Y:"+y);
               iso.place(tile,x,y); 
            }
            
        }
    }
});