$(function(){
  
    var toLoad = [
    {
        id:"tall structures",
        src:"img/grassland_structures.png"
    },

    {
        id:"water",
        src:"img/grassland_water.png"
    },

    {
        id:"trees",
        src:"img/grassland_trees.png"
    },

    {
        id:"grassland",
        src:"img/grassland.png"
    },

    {
        id:"male player",
        src:"img/male_player.png"
    }
    ];
    var loader = new Kinetic.Loader(toLoad);

    loader.onProgress(function(data){
        console.log(data);
    });
    loader.onError(function(data){
        console.warn("Error on Load "+data.name);
    });
    loader.onComplete(function(){
        var game = new Game();
        game.load('frontier_plains.json');
       
    });
 
    loader.load();
});

var Game = function(){
    this.gameDiv = $('#game');
    this.window = $(document);
    this.stage = new Kinetic.Stage({
        container:'game',
        width:this.gameDiv.width(),
        height:this.gameDiv.height()
        
    });
    this.paused = false;
  this.keyboard = new Kinetic.Keyboard();
}
Game.prototype.load = function(file){
    var game = this;

    $.ajax({
        url:"js/maps/"+file,
        success:function(data){
            game.run(data);
        }
    });
}
Game.prototype.render = function(diff){
    if(!this.map) return;
    
    this.stage.draw();
}
Game.prototype.update = function(){
    if(!this.keyboard.isDown()) return;
    var speed = 15;
    
      if(this.keyboard.isDown('W') || this.keyboard.isDown('UP_ARROW')){
   
            this.stage.attrs.y +=speed
           
        }
        if(this.keyboard.isDown('S')|| this.keyboard.isDown('DOWN_ARROW')){

            this.stage.attrs.y -=speed;
          
        }
        if(this.keyboard.isDown('D') || this.keyboard.isDown('RIGHT_ARROW')){

            this.stage.attrs.x -=speed;
          
        }
        if(this.keyboard.isDown('A')|| this.keyboard.isDown('LEFT_ARROW')){
   
            this.stage.attrs.x +=speed;
            
        }
        console.time("Map Update");
        this.map.update();
        console.timeEnd("Map Update");
}
Game.prototype.run = function(data){
 
    //create Map
    this.map = new Map(data);
    this.map.init(this.stage);
    var lastTime = 0;
    var game = this;
    var fps = 25;
    this.stage.draw();
    this.x = this.stage.attrs.x;
    this.y = this.stage.attrs.y;
    this.stage.onFrame(function(frame){
        if(!!game.paused) return;
        var currTime = +new Date;
        game.update();
        var timeToCall = Math.max(0, ~~(1000/fps) - (currTime - lastTime));
    
        var id = window.setTimeout(function() {
            game.render(timeToCall);
        },
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    });
    this.stage.start();
    
    this.enableEvents();
}
Game.prototype.enableEvents = function(){
    var game = this;
    this.window.on("keyup keydown",function(e){
     
       game.keyboard.dispatch(e); 
    }).on("focusin",function(e){
       game.keyboard.enable();
    }).on("focusout",function(e){
       game.keyboard.disable();
    }).trigger("focus");
}
Game.prototype.pause = function(){
    this.paused = true;
}
Game.prototype.unpause = function(){
    this.paused = false;
}

