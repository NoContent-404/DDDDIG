
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled=true;
        //绘制碰撞区域
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onCollisionEnter:function(other, self){
        if(other.node.name == "left" || other.node.name == "right"){
            cc.player.stuat = true;
            cc.player_leftTouch = true;
            cc.player_left = cc.player_x; 
            return;
        }
        cc.log(other)
        if(other.node.name == "railing"){
            cc.log("碰到了railing")
            cc.player.stuat = true;
            cc.player_leftTouch = true;  //用来表示碰到了方块左右俩边的判断
            cc.player_left = cc.player_x; 
            return;
        }
    },
    onCollisionExit:function(other,self){
        if(other.node.name == "mission"){
            cc.player.stuat = true;
            cc.touch_mission = false;
            // cc.player_leftTouch = false;
            this.unscheduleAllCallbacks();
        }
        if(other.node.name == "left" || other.node.name == "right" || other.node.name == "railing"){
            // cc.log(other.node.name+"结束了碰撞")
            cc.player_leftTouch = false;
        }
    },

    start () {

    },

    // update (dt) {},
});
