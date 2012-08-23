var stage = null;
var player = {x:128,y:100};
var velocity = {x:10,y:5};
$(function(){
    var gameDiv = $('#game');
    var h = gameDiv.height();
    var w = gameDiv.width();
    stage = new Kinetic.Stage({
        container:'game',
        width:w,
        height:h,
        listening:false
    });

  
    /*
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
        width:406,
        lineHeight:1,
        height:50,
        padding:10,
        align:'center',
        text: "Loading...",
        fontSize: 28,
        listening:false,
        fontFamily: "Calibri",
        textFill: "#FFFFFF",
        offset:[-(w/2-250),-(h/2-70)]
    });
   
   
    var percentText = new Kinetic.Text({
        x: 0,
        y: 0,
        text: "0%",
        fontSize: 10,
        fontFamily: "Calibri",
        textFill: "#FFFFFF",
        offset:[-(w/2-246),-(h/2+28)]
    });
    

    loadingScreen.add(loadingText);
    loadingPoints.add(percentText);
    loadingScreen.add(loadingPoints);
    

    stage.add(loadingScreen); */
    var loader = new Kinetic.Loader(toLoad);
    
    loader.onProgress(function(data){
        return;
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
        text.setText(~~(data.percent)+'%');
        
        loadingScreen.draw(); 
    });
    loader.onError(function(data){
        console.warn("Error on Load "+data.name);
    });
    loader.onComplete(function(){
        
            var game = new Game();
            game.run("frontier_plains.json");
            return;
        var startText = new Kinetic.Text({
            x: 0,
            y: 0,
            width:406,
            lineHeight:1,
            height:50,
            padding:10,
            align:'center',
            text: "Start",
            fontSize: 14,
            listening:false,
            fontFamily: "Calibri",
            textFill: "#FFFFFF",
            offset:[-(w/2-250),-(h/2-70)]
        });
   
        var startBtn = new Kinetic.Image({
            image:Kinetic.Assets['button'],
            crop:{
                x:0,
                y:28,
                width:141,
                height:28
            },
            width:141,
            height:28,
            offset:[-(w/2-125),-(h/2-70)]
        });
        loadingScreen.remove(loadingText);
        loadingScreen.add(startBtn);
        loadingScreen.add(startText);
        
        loadingScreen.draw();
        startBtn.on("click",function(){
            stage.remove(loadingScreen);
      
           // var game = new Game();
          //  game.run("frontier_plains.json");
        });
      
       
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

Game.prototype.render = function(diff){
  
    
    }
Game.prototype.update = function(){
    
   
    
    }
Game.prototype.run = function(level){
 
    //create Map
    var map = new Map(stage,player.x,player.y);
    map.load(level);
   
 
}
Game.prototype.pause = function(){
    this.paused = true;
}
Game.prototype.unpause = function(){
    this.paused = false;
}

