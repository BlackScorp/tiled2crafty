Crafty.scene("Dungeon",function(){
    var roomW = 0,roomH=0,tileW=32,tileH=32,maxRooms=0;
    Crafty.background('#000000');
   

    var player = Crafty.e("2D,Canvas,Color,Player,Persist").color("blue");
    player.x = Crafty.math.randomInt(2,roomW-2)*tileW;
    player.y = Crafty.math.randomInt(2,roomH-2)*tileH;
    var dungeon = Crafty.dungeon.init();
   
    Crafty.scene("Room1");
});

Crafty.scene("City",function(){

    });