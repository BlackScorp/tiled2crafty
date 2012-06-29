Crafty.c("Player",{
    gender:null,
    name:'',
    equipment:{
        head:null,
        armor:null,
        left:null,
        right:null
    },
    mapName:'',
    direction:'s',
    position:{
        x:0,
        y:0
    },
    ground:null,
    movementSpeed:{
        x:5,
        y:2.5
    },
    url:null,
    xsrf:null,
    init:function(){ 
        
      
        this.addComponent("2D,Canvas,male,SpriteAnimation,Multiway,Collision")
        .attr({
            w:128,
            h:128
        })
        //Walking animation
        .animate('walk_w',4,0,11)
        .animate('walk_nw',4,1,11)
        .animate('walk_n',4,2,11)
        .animate('walk_ne',4,3,11)
        .animate('walk_e',4,4,11)
        .animate('walk_se',4,5,11)
        .animate('walk_s',4,6,11)
        .animate('walk_sw',4,7,11)
        
        
        //Standing
        .animate('stand_w',0,0,3)
        .animate('stand_nw',0,1,3)
        .animate('stand_n',0,2,3)
        .animate('stand_ne',0,3,3)
        .animate('stand_e',0,4,3)
        .animate('stand_se',0,5,3)
        .animate('stand_s',0,6,3)
        .animate('stand_sw',0,7,3)
        //Attacking
        .animate('attack_w',12,0,15)
        .animate('attack_nw',12,1,15)
        .animate('attack_n',12,2,15)
        .animate('attack_ne',12,3,15)
        .animate('attack_e',12,4,15)
        .animate('attack_se',12,5,15)
        .animate('attack_s',12,6,15)
        .animate('attack_sw',12,7,15)
        
        //Block
        .animate('block_w',16,0,17)
        .animate('block_nw',16,1,7)
        .animate('block_n',16,2,17)
        .animate('block_ne',16,3,17)
        .animate('block_e',16,4,17)
        .animate('block_se',16,5,17)
        .animate('block_s',16,6,17)
        .animate('block_sw',16,7,17)
        
        //Hurt
        .animate('hurt_w',18,0,19)
        .animate('hurt_nw',18,1,19)
        .animate('hurt_n',18,2,19)
        .animate('hurt_ne',18,3,19)
        .animate('hurt_e',18,4,19)
        .animate('hurt_se',18,5,19)
        .animate('hurt_s',18,6,19)
        .animate('hurt_sw',18,7,19)
        
        //Die
        .animate('die_w',20,0,23)
        .animate('die_nw',20,1,23)
        .animate('die_n',20,2,23)
        .animate('die_ne',20,3,23)
        .animate('die_e',20,4,23)
        .animate('die_se',20,5,23)
        .animate('die_s',20,6,23)
        .animate('die_sw',20,7,23)
        
        //Skill
        .animate('skill_w',24,0,27)
        .animate('skill_nw',24,1,27)
        .animate('skill_n',24,2,27)
        .animate('skill_ne',24,3,27)
        .animate('skill_e',24,4,27)
        .animate('skill_se',24,5,27)
        .animate('skill_s',24,6,27)
        .animate('skill_sw',24,7,27)
        
        //Shoot
        .animate('shoot_w',28,0,31)
        .animate('shoot_nw',28,1,31)
        .animate('shoot_n',28,2,31)
        .animate('shoot_ne',28,3,31)
        .animate('shoot_e',28,4,31)
        .animate('shoot_se',28,5,31)
        .animate('shoot_s',28,6,31)
        .animate('shoot_sw',28,7,31)
        .bind("NewDirection",function(direction){
           
            if (direction.x == 0 && direction.y < 0 ) {
                this.direction = 'n';
            }
            if (direction.x > 0 && direction.y < 0 ) {
                this.direction = 'ne';
            }
            if (direction.x > 0 && direction.y == 0) {
                this.direction = 'e';
            }
            if (direction.x > 0 && direction.y > 0) {
                this.direction = 'se';
            }
            if (direction.x == 0 && direction.y > 0) {
                this.direction = 's';
            }
            if (direction.x < 0 && direction.y > 0) {
                this.direction = 'sw';
            }
            if (direction.x < 0 && direction.y == 0) {
                this.direction = 'w';
            }
            if (direction.x < 0 && direction.y < 0) {
                this.direction = 'nw';
            }
            
            if(!direction.x && !direction.y) {
                if (!this.isPlaying())
                    this.stop().animate('stand_'+this.direction,30,-1);
            }else{
                if (!this.isPlaying("walk_"+this.direction))
                    this.stop().animate("walk_"+this.direction, 30,-1);
            }
    
        })
        .bind("KeyDown",function(e){
          
            return true;
            if(e.keyCode === Crafty.keys.U)
                eq.trigger("Die");
            
            if(e.keyCode === Crafty.keys.I)
                eq.trigger("Hurt");
            
            if(e.keyCode === Crafty.keys.O)
                eq.trigger("Block");
            
            if(e.keyCode === Crafty.keys.J)
                eq.trigger("Skill");
            if(e.keyCode === Crafty.keys.K)
                eq.trigger("Shoot");
            if(e.keyCode === Crafty.keys.SPACE)
                eq.trigger("Attack");
        })
        .bind('Moved', function(from) {   
            var vp = {
                x:-this.x-this.w/2+Crafty.viewport.width/2,
                y:-this.y-this.h+Crafty.viewport.height/2
            }
          
            Crafty.viewport.x = vp.x;
            Crafty.viewport.y = vp.y;
         
           
        })
        .multiway(this.movementSpeed,{
            W: -90, 
            S: 90, 
            D: 0, 
            A: 180
        })
        .animate('stand_'+this.direction,30,-1)

        return this;
    }
  
});


