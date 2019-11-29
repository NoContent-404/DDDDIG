
cc.Class({
    extends: cc.Component,

    properties: {
        pass_btnPre:cc.Prefab,
        pass_btn:cc.Sprite,
        select_pass:cc.Sprite,
        select_robot:cc.Sprite,
        itemTemplate: { 
            default: null,
            type: cc.Node
        },
    },

    commonFunction(t,f){
        this.select_pass.node.active = f;
        this.select_robot.node.active = f;
        this.pass_btn.node.active = t;
        cc.player.touchh_start.node.active = f;
    },
    //选择关卡的监听
    selectPassFunction(){
        cc.log("选择关卡-----------");
        this.commonFunction(true,false)
        var action = cc.moveBy(1,cc.v2(0,1280));
        this.pass_btn.node.runAction(action);
        cc.newplayer1.destroy();
        
        // 使用给定的模板在场景中生成一个新节点
        this.scheduleOnce(function(){
            var newplayer = cc.instantiate(cc.player.player);
            newplayer.parent =cc.find('Canvas');
            cc.newplayer_pass = newplayer;
            newplayer.setPosition(0,cc.player.node.y * 0.8);
            cc.player.robotAmi()
        },1);
        
    },
    //选择人物的监听
    selectRobotFunction(){
        cc.log("选择人物------------");
    },
    //取消选择关卡的监听
    noSelectPassFunction(){
        var action = cc.moveBy(1,cc.v2(0,-1280));
        this.pass_btn.node.runAction(action);
        cc.newplayer_pass.destroy();
        
        this.scheduleOnce(function(){
            this.commonFunction(false,true);
            cc.player.spawnNewPlayer();
        },1);
 
    },
    //生成选择关卡的按钮函数
    selectPassBtn(){
        
        // 为按钮设置一个位置
        for(var i= 0 ; i < 12; i ++){
            var pass_btnPre = cc.instantiate(this.pass_btnPre);
            pass_btnPre.parent = this.itemTemplate;
            var pass_btnPre_name = cc.find('Canvas').getChildByName('pass_bg').getChildByName('itemTemplate').getChildByName("pass_btn");
            pass_btnPre_name.name = "btn" + (i+1);
            // cc.log(pass_btnPre_name.name);
            var pass_btnPre_str = cc.find('Canvas').getChildByName('pass_bg').getChildByName('itemTemplate').getChildByName(pass_btnPre_name.name).getChildByName("pass_btn_str").getComponent(cc.Label);
           
            if(i >= 0 && i<3){
                pass_btnPre.setPosition( -200 + i*200, 300);
                pass_btnPre_str.string = (i+1);
                // cc.log(pass_btnPre_str.string)
            }
            if(i >=3 && i < 6){
                pass_btnPre.setPosition( -800 + i*200, 150);
                pass_btnPre_str.string = (i+1);
            }
            if(i >=6 && i < 9){
                pass_btnPre.setPosition( -1400 + i*200, 0);
                pass_btnPre.color = new cc.Color(247, 143, 10);
                pass_btnPre_str.string = (i+1);

            }
            if(i >=9){
                pass_btnPre.setPosition( -2000 + i*200, -150);
                pass_btnPre.color = new cc.Color(247, 143, 10);
                pass_btnPre_str.string = (i+1);

            }
        }
    },
    onLoad () {
        this.selectPassBtn();
    },
    start () {

    },

    update (dt) {
        
    },
    
});
