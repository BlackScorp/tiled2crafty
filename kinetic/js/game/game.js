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
     
        var map = this._map;
      
        var FPS = 25;
        var game = this;
        var frame = 0;
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
               
                if(!map.isReady() && game.isPaused())return
                    
                stats.begin(); 
                game.update();
                if(++frame % FPS == 0) return;
                map.draw(); 
                stats.end();
            
                  
            }
        });
        animation.start();
       
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
    update:function(){
        if( !this._keyboard.isDown()) return;
        
        if(this._keyboard.isDown('UP_ARROW')){
   
            this._stage.attrs.y +=this._speed.y; 
        }
        if(this._keyboard.isDown('DOWN_ARROW')){

            this._stage.attrs.y -=this._speed.y; 
        }
        if( this._keyboard.isDown('RIGHT_ARROW')){

            this._stage.attrs.x -=this._speed.x; 
        }
        if(this._keyboard.isDown('LEFT_ARROW')){
   
            this._stage.attrs.x +=this._speed.x; 
        }
    }
}
