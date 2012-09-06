var Game = function(config){
    this._config = config;
}

Game.prototype ={
    _stage:null,
    _window:null,
    _map:null,
    _paused:false,
    _speed:{
        x:6,
        y:6
    },
    run:function(){
        this._init();
    },
    _init:function(){
        this._window = $('#game');
        var stats = new Stats();
        $('#stats').append(stats.domElement);
        this._stage = new Kinetic.Stage({
            container:'game',
            //  width:640,
            // height:480
            width:this._window.width(),
            height:this._window.height()
        });
        this._map = new Map(this._stage);
        this._map.load(this._config);
        this._keyboard = new Kinetic.Keyboard();
        var keyboard = this._keyboard;
        $(document).focus();
     
     
      
        var maxFPS = 25;
        var tick = 1000/maxFPS;
        var maxFrames = 5;
        var time = Date.now();
        var game = this;

        $(document).on("keyup keydown",function(e){
            e.preventDefault();
            keyboard.dispatch(e);
         
        }).on("focusin",function(){
            keyboard.enable();
        }).on("focusout",function(){
            keyboard.disable();
        });
        
        var animation = new Kinetic.Animation({
            func:function(frame){
                if(game.isPaused()) return;
                stats.update();
                var loops =0;
                while(Date.now() > time && loops < maxFrames){
                    game.update();
                    time += tick;
                    loops++;
                }
                if(loops > 0){
                    var inter = parseFloat((Date.now()+tick-time) / tick);
                    game.update(inter);
                    game.render();
                    time = Date.now();
                }
               
            }
        });
        animation.start();
       
    },
    render:function(){
       
        
        this._map.draw(); 
         
    },
    isPaused:function(){
        return this._paused;
    },
    pause:function(){
        this._paused = true;
    },
    unpause:function(){
        this._paused = false;
    },
    update:function(inter){
        if(!inter) inter = 1;
        var pos = this._stage.attrs;
        var speed = this._speed;
      
        
        if(this._keyboard.isDown('UP_ARROW')){
   
            this._stage.attrs.y = ~~(pos.y + speed.y * inter); 
        }
        if(this._keyboard.isDown('DOWN_ARROW')){

            this._stage.attrs.y = ~~(pos.y- speed.y * inter); 
        }
        if( this._keyboard.isDown('RIGHT_ARROW')){

            this._stage.attrs.x = ~~(pos.x - speed.x * inter);
        }
        if(this._keyboard.isDown('LEFT_ARROW')){
   
            this._stage.attrs.x =~~(pos.x + speed.x * inter);
        }
    }
}
