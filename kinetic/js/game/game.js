$(function(){
    var files = [
   
    "img/grassland_structures.png",
    "img/grassland_water.png",
    "img/grassland_trees.png",
    "img/grassland.png",
    "img/male_player.png"

    ];
    var loader = new Kinetic.Loader(files);

    loader.onProgress(function(data){
        console.log(data);
    });
    loader.onError(function(data){
        console.warn("Error on Load "+data.name);
    });
    loader.onComplete(function(){
        var game = new Game();
        game.start();
    });
 
    loader.load();
});

var Game = function(){
    this.stage = new Kinetic.Stage({
        container:'game',
        width:800,
        height:600
    });
    this.paused = false;
    this.backgroundLayer = new Kinetic.Layer({
        name:'background' 
    });
    this.objectLayer = new Kinetic.Layer({
        name:'object' 
    });
    var sort = function(){
        this.children.sort(function(a,b){
            return a.attrs.zIndex - b.attrs.zIndex;
        })
    };
    this.backgroundLayer.beforeDraw(sort);
    this.objectLayer.beforeDraw(sort);
    this.stage.add(this.backgroundLayer);
    this.stage.add(this.objectLayer);
    
    var image = new Kinetic.Image({
        width:64,
        height:128,
        image:Kinetic.Assets["img/grassland.png"],
        crop:{
            x:0,y:0,width:64,height:128
        },
        x:0,
        y:0
    });
 
    this.backgroundLayer.add(image);
    this.stage.draw();
}
Game.prototype.update = function(){
    
    }
Game.prototype.start = function(){
    this.stage.onFrame(function(){
        if(!this.paused) return;
    });
    this.stage.start();
}
Game.prototype.pause = function(){
    this.paused = true;
}
Game.prototype.unpause = function(){
    this.paused = false;
}