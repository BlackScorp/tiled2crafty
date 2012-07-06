$(function(){
  
    //Init Crafty
    Crafty.init(800,600);
    //Init Canvas
    Crafty.canvas.init();
    Math.seedrandom('BlackScorp');
    
    var newRoom = function(){
        Crafty.background('#000000');
        var elements = Crafty("*");
        for(var i = 0,il = elements.length;i<il;i++){
            var id = elements[i];
            if(id){
                console.log(id);
            }
            
            //.destroy();
           
           
          
        }
       
        var room = Crafty.e("RandomRoom");
        
        
        Crafty.viewport.x = Crafty.viewport.width/2-~~(room.w*32/2);
        Crafty.viewport.y = Crafty.viewport.height/2-~~(room.h*32/2);
  
        for(var y = 1,yl=room.h;y<=yl;y++){
       
            for(var x = 1,xl = room.w;x<=xl;x++){
                var tile = null,type='Ground',exit =false;
               
                if(x == 1)  type='Wall';
                if(y == 1) type='Wall';
                if(y == room.h)type='Wall';
                if(x == room.w)type='Wall';
                if(x == 1 || y == 1 || x == room.w || y == room.h){
                    var aDoor = Crafty.math.randomInt(0,100);
                    if(aDoor > 90){
                        type='Door';
                        exit = true;
                   
                    } 
              
                } 
                if(x == 1 && y == 1) type='Corner';
                if(x == 1 && y == room.h) type='Corner';
                if(x == room.w && y == room.h) type='Corner';
                if(x == room.w && y == 1) type='Corner';
            
                tile = Crafty.e("2D","Canvas",type);
                tile.attr({
                    x:x*32,
                    y:y*32,
                    w:32,
                    h:32
                });
                if(exit){
                    var e = Crafty.e("2D,Canvas,Color,Exit").color("violet");
                    var eX = x,eY=y;
                    if(x == room.w) eX = (x+1);
                    if(y == room.h) eY = (y+1);
                    if(x == 1) eX = (x-1) ;
                    if(y == 1) eY = (y-1) ;
                    e.attr( {
                        x:eX*32,
                        y:eY*32,
                        w:32,
                        h:32
                    });
                }
           
            }
        }
        var player = Crafty.e("2D,Canvas,Color,Fourway,Collision").color("blue").fourway(3);
        player.collision(
            [0,0],
            [30,0],
            [30,30],
            [0,30]
            );
        player.x = Crafty.math.randomInt(2, room.w-1)*32;
        player.y = Crafty.math.randomInt(2, room.h-1)*32;
        player.w = 30;
        player.h = 30;
        player.bind("Moved",function(from){
            var collision = this.hit("Wall"),target;
            if(collision){
                target = collision[0];
                this.x += Math.ceil(target.normal.x * -target.overlap);
                this.y += Math.ceil(target.normal.y * -target.overlap);
            }
            collision = this.hit("Exit");
            if(collision){
                newRoom();
            }
        
        });
    }
    newRoom();
});
