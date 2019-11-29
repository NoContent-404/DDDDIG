let count_en = 0; //用来计算右上角的能量
//机器人全局能量
cc.robot_ALLen = 0;
cc.Class({
    extends: cc.Component,

    properties: {
        figure: {
            default : null,
            type : cc.Node
        },
        touch_count:0,
    },
    
    onLoad () {
        cc.diamon = this;
        //开启碰撞检测
        cc.director.getCollisionManager().enabled=true;
        //绘制碰撞区域
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onCollisionEnter:function(other, self){
        cc.log(other.node.name+"--this.touch_count碰："+this.touch_count)
        cc.robot_ALLen = cc.robot_en.string;
        
        if(other.node.name == "railing"){
            cc.player_leftTouch = true;
            cc.player_left = cc.player_x;
            // this.touch_count = 0;
            return;
        }
        if(other.node.name == "Lightning"){
            other.node.destroy();
            cc.robot_en.string = parseInt(other.node.getChildByName("Label").getComponent(cc.Label).string) + parseInt(cc.robot_en.string);
            cc.robot_ALLen = cc.robot_en.string;
            // return;
        }
       if(other.node.name == "mission"){
           this.touch_count++;
           
            cc.touch_mission = true;//用来判断碰到方块时,再次触摸地图不可以移动
            cc.player.stuat = false;
            var block_string = other.node.getChildByName("Label").getComponent(cc.Label).string;
            var count = block_string;

            var energy = cc.find('Canvas').getChildByName('energyCount').getComponent(cc.Label);
            if(this.figure.getComponent('figure').openStart){
                other.node.destroy();
            }else{
            this.schedule(function(){
                cc.player.lightRedFunvtion();
                count_en ++;
                energy.string = count_en;
                count--;

                cc.robot_ALLen --;
                other.node.getChildByName("Label").getComponent(cc.Label).string = count;
                cc.robot_en.string = cc.robot_ALLen;
                if(count === 0){ 
                    if(cc.endFour){
                        return;
                    }
                    if(other.node.getComponent('DiamondNum').isStart){
                        this.figure.getComponent('figure').openStartPattern();  //  开启星星模式
                    }
                    other.node.destroy();
                    cc.player.stuat = true;
                }
                if(cc.robot_ALLen == 0){
                    // cc.log("你在本次通关失败~~");
                    cc.player.victory();
                    this.unscheduleAllCallbacks();
                    cc.robot_ALLen_istrue = true; //当自生能量等于0时，不可以移动和开始
                    cc.player.stuat = false;
                }
        }.bind(this),1,block_string - 1);
    }
       }      
    },
    onCollisionExit:function(other,self){
            
        cc.log(other.node.name+"--this.touch_count离：",this.touch_count)
            cc.player_leftTouch = false;
            if(other.node.name == "mission"){
                this.touch_count--;
                if(this.touch_count >= 1){   
                    cc.player.stuat = false;
                    cc.touch_mission = true;
                }else {
                    this.touch_count = 0;
                    cc.player.stuat = true;
                    cc.touch_mission = false;
                    this.unscheduleAllCallbacks();
                }
            }
            // if(other.node.name == "left" || other.node.name == "right"){
            //     this.touch_count = 0;
            // }
             
        
    
        
    },

    start () {

    },
    update (dt) {

    },
});
