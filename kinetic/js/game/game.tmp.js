var stage = null;
$(function(){
    var gameDiv = $('#game');
    var h = gameDiv.height();
    var w = gameDiv.width();
    stage = new Kinetic.Stage({
        container:'game',
        width:w,
        height:h
    });
    
    var loadingScreen = new Kinetic.Layer();
    var loadingBG = new Kinetic.Rect({
        width:w,
        height:h,
        fill:"#333333"
    });
    var loadingBarBG = new Kinetic.Rect({
        width:406,
        height:24,
        x:w/2-250,
        y:h/2-12,
        fill:'#232323',
        cornerRadius:2
    });
    loadingScreen.add(loadingBG);
    loadingScreen.add(loadingBarBG);
   
    
    var loadingPoints = new Kinetic.Group();
 
    for(var i = 0;i<100;i++){
        var loadingPoint = new Kinetic.Rect({
            width:2,
            height:16,
            x:i*(4),
            y:2,
            name:i,
            offset:[-(w/2-246),-(h/2-10)],
            fill:'#818181'
        });
        loadingPoints.add(loadingPoint);
    }
    var loadingText = new Kinetic.Text({
        x: 0,
        y: 0,
        text: "0%",
        fontSize: 10,
        fontFamily: "Calibri",
        textFill: "#FFFFFF",
        offset:[-(w/2-246),-(h/2+28)]
    });
        
    loadingPoints.add(loadingText);
    loadingScreen.add(loadingPoints);
    

    stage.add(loadingScreen);
    var loader = new Kinetic.Loader(toLoad);
    
    loader.onProgress(function(data){
        for(var i = 0,il = data.percent;i<il;i++){
            var point = loadingPoints.children[i];
            if(point){
                point.attrs.height = 16;
                point.attrs.fill = '#FFFFFF'; 
            }
          
        }
        point.attrs.height =30;
        var text = loadingPoints.children[100];
        text.attrs.x = (data.percent*4)-(16);
        text.setText(data.percent+'%');
        
        loadingScreen.draw(); 
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
    this.stage = new Kinetic.Stage({
        container:'game',
        width:this.gameDiv.width(),
        height:this.gameDiv.height()
    });
    this.paused = false;
  
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
  
    
    }
Game.prototype.update = function(){
    
   
    
    }
Game.prototype.run = function(data){
 
    //create Map
    var map = new Map(data);
    map.init(this.stage);
    this.stage.draw();
    
    var lastTime = 0;
    var game = this;
    var fps = 1;
    var tick = ~~(1000/fps);
   
    this.stage.onFrame(function(frame){
        if(!!game.paused) return;
        var currTime = +new Date;
        game.update();
        var timeToCall = Math.max(0, tick - (currTime - lastTime));
    
        var id = window.setTimeout(function() {
            game.render(timeToCall);
        },
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    });
    this.stage.start();
    
    
}
Game.prototype.pause = function(){
    this.paused = true;
}
Game.prototype.unpause = function(){
    this.paused = false;
}

