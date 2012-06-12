
Crafty.extend({
    /**@
     * #Crafty.isometric
     * @category 2D
     * Place entities in a 45deg isometric fashion.
     */
    isometric: {      
        _iso:null,
        /**@
         * #Crafty.isometric.size
         * @comp Crafty.isometric
         * @sign public this Crafty.isometric.size(Number tileSize)
         * @param tileSize - The size of the tiles to place.
         * Method used to initialize the size of the isometric placement.
         * Recommended to use a size alues in the power of `2` (128, 64 or 32).
         * This makes it easy to calculate positions and implement zooming.
         * ~~~
         * var iso = Crafty.isometric.init(128);
         * ~~~
         * @see Crafty.isometric.place
         */
        init: function (tw,th,mw,mh,orientation) {
   
            switch(orientation){
                case 'staggered':{
                     
                        break;
                }
                default:{
                        this._iso = Crafty.diamond.init(tw,th,mw,mh);
                }
            }
            
            return this._iso;
        }
    }
});

/**@
* #Collision
* @category Collision
* Components to display Crafty.polygon Array for debugging collision detection
* * @example
* ~~~
* Crafty.e("2D,DOM,Player,Collision,WiredHitBox").collision(new Crafty.polygon([0,0],[0,300],[300,300],[300,0])) 
* ~~~
* this will display a wired square over your original Canvas screen 
*/
Crafty.c("WiredHitBox", {
    _points:{},
    _ctx: null,
    init:function(){

        if (!Crafty.support.canvas) return;
        var c = document.getElementById('HitBox');
        if(!c){
            c = document.createElement("canvas");
            c.id = 'HitBox';
            c.width = Crafty.viewport.width+'px';
            c.height = Crafty.viewport.height+'px';
            c.style.position = 'absolute';
            c.style.left = "0px";
            c.style.top = "0px";
            c.style.zIndex = Crafty.stage.elem.style.zIndex+1;
            Crafty.stage.elem.appendChild(c); 
        } 
    
        this._ctx = c.getContext('2d');
        
        if(!this.map) this.collision();
        
        this.requires("Collision").bind("NewComponent",function(){
            this._points[this[0]] = [];
            this._points[this[0]].push(this.map.points);
        }).bind("RemoveComponent",function(id){
            delete(this._points[id]);
        }).bind("Change",function(){
            this.drawHitBox();     
        }); 
        
       
        return this;
    },
    drawHitBox:function(){
       // this._ctx.width = this._ctx.width;
        this._ctx.beginPath(); 
        for(var c in this._points){
            var points = this._points[c];
             //  console.log(c);
            for(var p in points){
                var point = points[p];
                if(p>0){
                 
                     this._ctx.lineTo(point[0],point[1]);  
                   
                }else{
                    this._ctx.moveTo(point[0],point[1]);   
                }
                
            }
                     
        }
        this._ctx.closePath(); 
        this._ctx.stroke(); 
    }
});