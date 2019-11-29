

cc.Class({
    extends: cc.Component,

    properties: {
     
       
    },

  
     onLoad () {
       // this.collide_box()//判断碰撞

     },

        //碰撞
        // collide_box(){
      
        //     var players = this.node.getChildByName('figure');
        //     //var mission = this.node.getChildByName('mission');
        //     for(let i = 0;i<cc.player.FKList.length;i++){
               
        //         var boxRect =  cc.player.FKList[i].getBoundingBoxToWorld();
        //         var playerRect =players.getBoundingBoxToWorld();
        //         if (boxRect.intersects(playerRect)) {//判断矩形是否相交
        //             //cc.log('collide_box')
        //             cc.log('相交了')
        //             cc.player.FKList[i].color=cc.Color.YELLOW.fromHEX("#2CCA17");
        //           cc.player.stuat = false;
        //          }else{
        //             cc.player.FKList[i].color=cc.Color.YELLOW.fromHEX("#FFFFFF");
                   
        //           // cc.player.stuat = true;
        //         }
        //     }
           
           
        // },
    

    update (dt) {
      // this.collide_box()//判断碰撞
    },
});
