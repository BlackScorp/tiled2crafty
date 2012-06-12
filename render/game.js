$(function(){
    Crafty.init();
    var objects = frontier_outpost.layers.object.split(",");
    var collisions = frontier_outpost.layers.collision.split(",");

    var vp = Crafty.viewport;
    var map = frontier_outpost.metadata;
 
    var iso = Crafty.diamondIso.init(map.tilewidth,map.tileheight,map.width,map.height);
    //  Crafty.background("url(frontier_outpost.png) #000 top left no-repeat");
    // var tile = Crafty.e("2D","DOM",241,"Collision","WiredHitBox");
   // iso.place(tile,5,5);
   // tile.collision(iso.polygon());
    var i = 0;
    for(var y = 0;y<20;y++){
       
        for(var x = 0;x<20;x++){
         
            var object = objects[i];
            var collision = collisions[i];
           
            if(object > 0){
                var tile = Crafty.e("2D","DOM",object);//.text("X:"+x+"/Y:"+y);
            
                iso.place(tile,x,y); 
                if(collision > 0){
                  tile.addComponent("Collision","Solid","WiredHitBox").collision(iso.polygon());
                }
            }
            i++;
        }
        i = 64*y;
    }
    
 /*
    $('#cr-stage').css({
        'overflow':'scroll'
    });
    $('#cr-stage > div').css({
        'background':'url(frontier_outpost.png) #000 top left no-repeat',
        'width':'4096px',
        'height':'2048px',
        'top':'0px',
        'left':'0px'
    });
    $('#cr-stage > canvas').css({
        'zIndex':2
    });
    */
});