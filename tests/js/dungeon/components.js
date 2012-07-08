Crafty.c("Player",{
    _velocity:3,
    init:function(){
        this.w = 30;
        this.h = 30;
        this.requires("Collision,Fourway")
        .collision([0,0],[this.w,0],[this.w,this.h],[0,this.h])
        .fourway(this._velocity)
        .bind("Moved",function(from){
            var collision = this.hit("Wall"),target;
            if(collision){
                target = collision[0];
                this.x += Math.ceil(target.normal.x * -target.overlap);
                this.y += Math.ceil(target.normal.y * -target.overlap);
            }
            collision = this.hit("Door");
            if(collision){
               
            }
        
        });
    }
})