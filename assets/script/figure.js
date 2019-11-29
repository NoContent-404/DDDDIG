var audioPlayer = require('audioPlayer');
cc.Class({
    extends: cc.Component,

    properties: {
        head : cc.Node,

        
        jumpHeight : 0, // 主角跳跃高度
        
        jumpDuration : 0,   // 主角跳跃持续时间
        
        RotationAngle : 0,  // 人物旋转角度
        
        openStart : false,  // 星星模式的开关


    },

  

    start () {

    },

      //人物跳跃的动作顺序
    setJumpAction: function () {
        let self = this;
        // 跳跃上升
        var jumpUp = cc.moveBy(self.jumpDuration, cc.v2(0, self.jumpHeight * 1.5)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(self.jumpDuration-0.3, cc.v2(0, -self.jumpHeight* 1.5 )).easing(cc.easeCubicActionIn());
           //跳跃下落音效
           cc.loader.loadRes('music/dig_start_landing', cc.AudioClip, function (err, AudioClip) {
            audioPlayer.playYinXiao(AudioClip);
        }); 

        //跳跃过程中旋转180度
        var rotationAngle = cc.rotateBy(0.5, self.RotationAngle);
        return cc.spawn(jumpUp,rotationAngle,jumpDown);
    },


    /**
     *  定义人物动作
     * 
     */
    JumP(){
        let self = this;
        // 初始化跳跃动作
        let jumpAction = self.setJumpAction();
        //    var players = this.node.getChildByName('figure');   //  人物
        self.node.runAction(jumpAction);
            
            //跳跃音效
        cc.loader.loadRes('music/dig_start', cc.AudioClip, function (err, AudioClip) {
           audioPlayer.playYinXiao(AudioClip);//开启跳跃音效
        });

        self.scheduleOnce(function() {  //  设置延迟开启动画

           self.head.getComponent(cc.Animation).play('zuantou');//  开启钻头动画

           self.node.getComponent(cc.Animation).play('renMove')//   开启人物身体动画
           
           cc.loader.loadRes('music/dig_start_landing', cc.AudioClip, function (err, AudioClip) {audioPlayer.playYinXiao(AudioClip); }); //开启跳跃音效

       }, 1);
        //    // 创建一个移动动作
        //    var action = cc.moveTo(1, -22,250);

        //    // 执行动作
        //    this.Light.runAction(action);     
   },



   /**
    * 
    * 开启星星模式
    */
    openStartPattern () {
        let self = this;
        self.openStart = true;
     
        self.head.color = new cc.Color(255, 0, 0); //  颜色
        self.scheduleOnce(() =>{  //  设置延迟关闭星星模式
            self.head.color = new cc.Color(247, 143, 10); //  颜色
            self.openStart = false;
        }, 5);
    }

});
