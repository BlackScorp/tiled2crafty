Crafty.c("RandomRoom",{
    w:0,
    h:0,
    maxW:15,
    maxH:15,
    doors:null,
    items:null,
    init:function(){
       
        this.w = Crafty.math.randomInt(4, this.maxW);
        this.h =  Crafty.math.randomInt(4, this.maxH);
    } 
});
Crafty.c("Ground",{
    init:function(){
        this.w=32;
        this.h=32;
        this.requires("Color").color("white");
    }
});
Crafty.c("Door",{
    init:function(){
        this.requires("Ground").color("green");
    }
});
Crafty.c("Wall",{
    init:function(){
        this.requires("Collision,Ground").color("brown").collision(
            [0,0],
            [this.w,0],
            [this.w,this.h],
            [0,this.h]
            );
    } 
});
Crafty.c("Corner",{
    init:function(){
        this.requires("Wall").color("red");
    } 
});

