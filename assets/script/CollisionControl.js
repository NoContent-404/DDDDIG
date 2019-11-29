var audioPlayer = require('audioPlayer');
cc.Class({
    extends: cc.Component,

    properties: {
        score: cc.Prefab,
    },

    
     onLoad () {
        this.reashState = true;
        this.linghtState = false;
       // this.detectionStarte = false;
        cc.One = 0;
        this.count = 0;
        this.shibai = [];
        cc.Co = this;

        this.l = 1;
       // 获取碰撞检测系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
       // cc.director.getCollisionManager().enabledDebugDraw = true;
  
     },

     
    /**
 * 当碰撞产生的时候调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
onCollisionEnter: function (other, self) {
  
    cc.One +=1;
    console.log('======'+ cc.player.FKList);
    
    // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
    var playWorld = self.world;
    var fangKuaiWorld = other.world;

    

    // 碰撞组件的 aabb 碰撞框
    var palyAabb = playWorld.aabb;
    var fangKuaiAabb = fangKuaiWorld.aabb;

   
    

    //碰撞到能量的判断
    if(other.node.name =='Lightning'){

        //碰撞能量的音效
        cc.loader.loadRes('music/get_energy', cc.AudioClip, function (err, AudioClip) {
            audioPlayer.playYinXiao(AudioClip);
        });

        let www = other.node.getChildByName('Label').getComponent(cc.Label);  //能量的数值节点
        let FkCount = other.node.getChildByName('Label').getComponent(cc.Label);//能量的数值
        let i = parseInt(FkCount.string, 10);

        var Lightning =  cc.find('Canvas').getChildByName('Lightning').getChildByName('Label').getComponent(cc.Label);
        let j = parseInt(Lightning.string, 10);
        Lightning.string  = j+ i;

        other.node.active = false;
    }


    //当小人碰撞到方块停止滚动，离开方块时继续滚动
   if(other.node.name =='mission'){
   // this.detectionStarte = true;
        cc.player.stuat = false;
       
        console.log('停止滚动');

        let www = other.node.getChildByName('Label').getComponent(cc.Label);
        let FkCount = other.node.getChildByName('Label').getComponent(cc.Label).string;
        let energyCount = cc.find('Canvas').getChildByName('energyCount').getComponent(cc.Label);

        let Lightning =  cc.find('Canvas').getChildByName('Lightning').getChildByName('Label').getComponent(cc.Label);
        console.log('===='+ energyCount)
        let _count = FkCount;

    //定时器
    this.schedule (function(){

        //碰撞方块的音效
         cc.loader.loadRes('music/attack01', cc.AudioClip, function (err, AudioClip) {
            audioPlayer.playYinXiao(AudioClip);
        });

        energyCount.string = ++this.count;//积分加加
        Lightning.string = --Lightning.string;//能量数值减减
        www.string = --_count;  //方块数值减减
        let light =  Lightning.string;
        if(light == -1){
            this.linghtState = true;
        }
    //颜色渐变
     if(_count < 20 && _count >15){
            other.node.color = new cc.color(247, 105, 10);
    
    }
    if(_count < 15 && _count >10){
           other.node.color = new cc.color(247, 143, 10);
   
    }
    if(_count <10){
          other.node.color = new cc.color(250, 231, 7);

  }

    if(this.linghtState == true){
        console.log('结束游戏');
        Lightning.string = 0;
       this.reashState = false;
       cc.find('Canvas').getChildByName('replay').active =true;
       cc.find('Canvas').getChildByName('gauge').active = false;
       cc.find('Canvas').getChildByName('energyCount').active = false;
     

       //cc.player.re =true
       cc.player.stuat = false;
        console.log('停止滚动');
        this.unscheduleAllCallbacks();
        this.failure();
        this.scoring();
    }
       
       cc.log("计时器："+_count);
       if(_count ==0){
          
           other.node.active = false; //能量消失
           this.unscheduleAllCallbacks();//定时器停止

           cc.player.stuat = true; //ture地图继续滚动
         }
       // 0代表执行1次，
       // cc.macro.REPEAT_FOREVER
        },0.2,FkCount -1);

        
    }
 
},

/**
 * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
onCollisionStay: function (other, self) {
    console.log('on collision stay');

   
    if(this.reashState ==false){
        //开启碰撞检测系统，未开启时无法检测
    cc.director.getCollisionManager().enabled = false;
    }
 
},

/**
 * 当碰撞结束后调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
onCollisionExit: function (other, self) {
    console.log('on collision exit');
    console.log('this.detectionStarte'+ this.detectionStarte);

    cc.One -=1;
    
   this.detectionStarte = false;

    if(cc.player.re !=true){
       // if(cc.One ==0){
            cc.player.stuat = true;
      //  }
        
    }
   
    this.unscheduleAllCallbacks();
},

scoring(){
    let energyCount = cc.find('Canvas').getChildByName('energyCount').getComponent(cc.Label).string;
    let count = cc.find('Canvas').getChildByName('score').getChildByName('score').getComponent(cc.Label);
    count.string= energyCount;

 

    cc.player.stuat = false;

    var fig = cc.find('Canvas').getChildByName('figure').getChildByName('tou');
    var anim = fig.getComponent(cc.Animation);
    // 指定暂停 test 动画
     anim.pause('zuantou');

      //停止播放挖地洞音效
      cc.loader.loadRes('music/drill_loop', cc.AudioClip, function (err, AudioClip) {
        audioPlayer.stopBgMusic(AudioClip);
    });


      //播放输得音效
      cc.loader.loadRes('music/fever_end', cc.AudioClip, function (err, AudioClip) {
        audioPlayer.playYinXiao(AudioClip);
    });



     var fig = cc.find('Canvas').getChildByName('figure');
     var animFigure = fig.getComponent(cc.Animation);
    
     animFigure.pause('renMove');

    

},


failure(){

   
    // 使用给定的模板在场景中生成一个新节点
    var newscoreboard = cc.instantiate(this.score);
    // 将新增的节点添加到 Canvas 节点下面
    newscoreboard.parent =cc.find('Canvas');
    this.shibai.push(newscoreboard);
    newscoreboard.y =300;
},


start () {
    //开启碰撞检测系统，未开启时无法检测
    cc.director.getCollisionManager().enabled = true;
   
},

    //  update (dt) {
      
    //  },


});
