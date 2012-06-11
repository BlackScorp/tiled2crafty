$(function(){
    Crafty.init();
    var objects = frontier_outpost.layers.object.split(",");
    var collision = frontier_outpost.layers.collision.split(",");

    var vp = Crafty.viewport;
    var map = frontier_outpost.metadata;
 
    var iso = Crafty.diamondIso.init(map.tilewidth,map.tileheight,map.width,map.height);
     Crafty.background("url(frontier_outpost.png) #000 top left no-repeat");
  // var tile = Crafty.e("2D","DOM",144);
   //iso.place(tile,0,0);
     var i = 0;
    for(var y = 0;y<64;y++){
        for(var x = 0;x<64;x++){
            var object = objects[i];
   
            if(object > 0){
              var tile = Crafty.e("2D","DOM","Text",object);//.text("X:"+x+"/Y:"+y);
              iso.place(tile,x,y); 
            }
            i++;
        }
    }
    
 
   // $('#cr-stage').css({'overflow':'scroll'});
  //  $('#cr-stage > div').css({'background':'url(frontier_outpost.png) top left no-repeat'});
});