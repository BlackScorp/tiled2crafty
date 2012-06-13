$(function(){
    Crafty.init();
    Crafty.canvas.init();
   
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
  
    //iso.centerAt(0,0);
    Crafty.background("url(frontier_outpost.png) #000 "+(Crafty.viewport.x)+"px "+ (Crafty.viewport.y)+"px no-repeat");

  var i = 0;
    for(var y = 0;y<map.height;y++){
        for(var x = 0;x<map.width;x++){
            var object = objects[i];
            var collision = collisions[i];
            if(object > 0){
               var tile = Crafty.e("2D","Canvas",object);
               
               
                iso.place(tile,x,y,tile.__offset[0],tile.__offset[1]); 
            }else if(collision > 0){
              //  var collisionTile = Crafty.e("2D","DOM","Solid","BaseTile","Color");
               // iso.place(collisionTile,x,y);
            }
            i++;
        }
        i = y*map.height;
    }
    var scrollSpeed = 5;
    Crafty.bind("KeyDown",function(e){
        this._isDown = true;
        this._keyCode = e.keyCode;
     
    })
    Crafty.bind("KeyUp",function(e){
        this._isDown = false;
    })
   Crafty.bind("EnterFrame",function(){
        if(!this._isDown) return;
         if(Crafty.keys['W'] == this._keyCode ){
           Crafty.viewport.y+=scrollSpeed;
       }
        if(Crafty.keys['A'] == this._keyCode ){
           Crafty.viewport.x+=scrollSpeed;
       }
        if(Crafty.keys['S'] == this._keyCode ){
           Crafty.viewport.y-=scrollSpeed;
       }
        if(Crafty.keys['D'] == this._keyCode ){
           Crafty.viewport.x-=scrollSpeed;
       }
        Crafty.background("url(frontier_outpost.png) #000 "+(Crafty.viewport.x)+"px "+ (Crafty.viewport.y)+"px no-repeat");

    });
    
 
});
