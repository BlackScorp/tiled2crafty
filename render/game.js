$(function(){
    Crafty.init();
    var tiles = frontier_outpost.layers.object.split(",");

    var iso = Crafty.isometric.init(128).grid(64);
  
    for(var y = 5;y<15;y++){
        for(var x = 5;x<15;x++){
            var sprite = tiles[y*x];
           
            if(sprite > 0){
               var tile = Crafty.e("2D","DOM",tiles[y*x].toString());//.text("X:"+x+"/Y:"+y);
            iso.place(tile,x,y); 
            }
            
        }
    }
});