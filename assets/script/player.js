var audioPlayer = require('audioPlayer');

cc.touch_start = true; //用来判断游戏开始机器人只能跳跃一次
cc.endFour = false; //是否到达地面
cc.touch_start_one = false;//第一次触摸时为跳跃状态
cc.touch_mission = false;
cc.Class({
    extends: cc.Component,

    properties: {

        mission: cc.Prefab,
        Lightning: cc.Prefab,
        scoreboard: cc.Prefab,
        light_reduction: cc.Prefab,
        moveBg: cc.Node,
        mask: cc.Mask,
        bg: cc.Node,
        diamondsNode: cc.Node,

        draw: cc.Graphics,

        green: {
            default: null,
            type: cc.Node,
        },

        player: {
            default: null,
            type: cc.Prefab,
        },

        playerNode: {//hhq
            default: null,
            type: cc.Node,
        },

        Light: {
            default: null,
            type: cc.Node,
        },
        burrows: {
            default: null,
            type: cc.Node,
        },


        railing: {//hhq
            default: null,
            type: cc.Prefab,
        },
        railingNode: {//hhq
            default: null,
            type: cc.Node,
        },
        lightningNode: {//hhq
            default: null,
            type: cc.Node,
        },
        bgSprite: {
            default: [],
            type: cc.Node,
        },
        initBg: cc.Sprite,
        roll_speed: 4,


        topstartSprite: cc.Sprite,
        touchh_start: cc.Button,
        touchh_end: cc.Button,
        topcontinue: cc.Sprite,
        // find_canvas:null,

        recordsCreateDiamondNum: 0,    //  生成次数/可用于判断回收
        loopNum: 0,
        diamondInitialPos: 0, // 初始方块生成位置
        lightY: 0, // 初始闪电生成位置
        diamond_Y : 0,  //  记录方块Y轴

        recordMovebg_Y: 0, // 生成
        recovery: 0, // 生成

        isCreateLightning: true,   //  生成能量开关
        isCreateDiamind: true,   //  生成能量开关
        isGroup: true,     //  是否生成的是方块组
        singlePos_X: 0, //  记录生成单个方块的X轴
        createNum : 0,
        isS: false,     //  是否回收
    },
    onLoad() {
        let self = this; //hhq
        this.state = 1;
        this.Num = 1;
        this.LinghtNum = 1;
        this.randY = -800; //-572.5
        // this.lightY = -200;
        this.moveLeght = 0;//每帧移动的距离;



        /**
         * 
         * 方块对象池
         */

        self.diamondPool = new cc.NodePool();   //  创建对象池
        let initDpCount = 30;   //  数量
        for (let i = 0; i < initDpCount; ++i) {
            let diamondPrefab = cc.instantiate(self.mission); // 创建节点
            self.diamondPool.put(diamondPrefab); // 通过 putInPool 接口放入对象池
        }

        /**
         * 
         * 栏杆对象池
         */
        self.railingPool = new cc.NodePool();   //  创建对象池
        let initRpCount = 10;   //  数量
        for (let i = 0; i < initRpCount; i++) {
            let railingPrefab = cc.instantiate(self.railing);
            self.railingPool.put(railingPrefab);
        }

        /**
         * l
         * 能量对象池
         */
        self.lightPool = new cc.NodePool();   //  创建对象池
        let initLpCount = 10;   //  数量
        for (let i = 0; i < initLpCount; i++) {
            let lightPrefab = cc.instantiate(self.Lightning);
            self.lightPool.put(lightPrefab);
        }





        this.time = 0;
        this.stuat = false;
        this.re = false;
        this.detectionStarte = false;
        cc.player = this;
        this.i = 1;
        this.FKList = [];
        this.LightList = [];
        this.victoryList = [];
        // 获取地平面的 y 轴坐标
        this.greenY = this.green.y + this.green.height;
        this.greenX = this.green.x;
        var LevelL = this.node.getChildByName('gauge').getChildByName('gauge_circle').getChildByName('Label').getComponent(cc.Label);
        var LevelR = this.node.getChildByName('gauge').getChildByName('gauge_circle1').getChildByName('Label').getComponent(cc.Label);
        var Level = this.node.getChildByName('Level').getChildByName('count').getComponent(cc.Label).string;
        LevelL.string = Level;
        LevelR.string = ++Level;
        cc.robot_en = cc.find('Canvas').getChildByName('Lightning').getChildByName('Label').getComponent(cc.Label)
        // 生成一个新的人物
        this.spawnNewPlayer();
        this.topstartFunction(this.topstartSprite);

        this.touchh_start.node.on(cc.Node.EventType.TOUCH_START, self.OnGameStart, self);

        this.touchh_start.node.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            if (cc.robot_ALLen_istrue) {
                return;
            }

            this.dragMove(e);//拖动时移动的距离;
        }, this);
        this.touchh_start.node.on(cc.Node.EventType.TOUCH_END, (e) => {
            cc.newplayer1.angle = -180;
        }, this);

    },
    //闪电减少的函数
    lightRedFunvtion() {
        cc.player.light_reduction.active = true;
        var reduction = cc.instantiate(this.light_reduction);
        reduction.parent = this.playerNode.getChildByName('figure');
        cc.reduction_a = reduction;
        reduction.setPosition(0, -300);
        // cc.log(reduction);
        var action = cc.moveBy(1, cc.v2(0, -300));
        var action2 = cc.fadeOut(1, 0);
        reduction.runAction(action);
        reduction.runAction(action2);

        this.scheduleOnce(function () {
            reduction.destroy();
        }, 1);
    },

    //开始的时候闪烁文字
    topstartFunction(topstartSprite) {
        var action1 = cc.fadeIn(1, 200);
        var action2 = cc.fadeOut(1, 0);
        var seq = cc.repeatForever(cc.sequence(action1, action2));
        topstartSprite.node.runAction(seq);
    },



    //背景移动
    bgMoveFunction(bgList, speed) {
        for (var i = 0; i < bgList.length; i++) {
            bgList[i].y += speed;
        }

        if (bgList[0].y >= bgList[0].height) {
            bgList[0].y = -960;
            this.initBg.node.active = false;
        }
        if (bgList[1].y >= -1260 + 2 * bgList[1].height) {
            bgList[1].y = -1260

        }

        this.recovery +=speed;

        if (this.isCreateDiamind) {    //  判断是否需要生成方块,可用于结束后关闭
            if (this.recovery >= 160) {
                this.spawnMission();    //  生成方块
            }
        }
        if (this.isCreateLightning) {  //  判断是否需要生成能量,可用于结束后关闭
            if (this.recovery >= 160) {
                // this.recordMovebg_Y = 0;
                this.spawnNewStar()
                this.recovery = 0;
            }
        }
        
        if(this.recordsCreateDiamondNum === 3 && this.isS === true){
            this.onDiamondKilled();
            this.recordMovebg_Y = 0;
        }

        this.recordMovebg_Y += 2;   //  控制生成方块和能量
        


    },
    offTouchEvent: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
    },
    //点击开始移动,获得人物开始时的x轴坐标
    startmove() {
        var players = this.playerNode.getChildByName('figure');
        this.start_x = players.x;
        this.MoveEndx = 0;

    },
    // 机器人跳跃动作
    robotAction() {
        this.stuat = true;
        console.log('游戏开始了-----------'); //游戏开始
        this.hidden(false);
        this.JumP();

        //播放挖地洞音效
        cc.loader.loadRes('music/drill_loop', cc.AudioClip, function (err, AudioClip) {
            audioPlayer.playerBgMusic(AudioClip);
        });

        //如果没有指定播放哪个动画，并且有设置 defaultClip 的话，则会播放 defaultClip 动画
        var fig = cc.find('Canvas').getChildByName('figure');
        var animFigure = fig.getComponent(cc.Animation);
        animFigure.play('renMove');

        var fig = cc.find('Canvas').getChildByName('figure').getChildByName('tou');
        var anim = fig.getComponent(cc.Animation);
        anim.play('zuantou');
    },
    //机器人动画
    robotAmi() {
        var fig = cc.find('Canvas').getChildByName('figure');
        var animchushi1 = fig.getComponent(cc.Animation);
        animchushi1.play('chushi1');
    },

    dragMove(e) {
        var end_x = e.touch._point.x; //触摸移动结束时的x轴
        var startx = e.touch._startPoint.x; //触摸开始时的x轴;
        var endx = end_x - startx; //移动的位移
        let pos = this.start_x + endx //人物移动的总距离
        var players = this.playerNode.getChildByName('figure');
        var moveLeght = endx - this.MoveEndx;
        cc.player_x = players.x;
        this.playerMove(pos);
        if (cc.player_leftTouch) {
            this.playerMove(cc.player_left);
        } else {
            this.playerMove(pos);
        }

        if (moveLeght > 1) {
            for (let i = 0; i < moveLeght; i++) {
                // this._addCircle(this.playerEndx + i, players.y - this.moveLeght)//绘画
                cc.newplayer1.angle = -160;;
            }
        } else if (moveLeght < -1) {
            for (let i = 0; i > moveLeght; i--) {
                // this._addCircle(this.playerEndx - i, players.y - this.moveLeght)//绘画
                cc.newplayer1.angle = 160;
            }
        } else {
            // this._addCircle(players.x, players.y - this.moveLeght)//绘画
        }

        this.MoveEndx = endx;
        this.playerEndx = players.x;
        this.unscheduleAllCallbacks();
    },

    playerMove(a) {
        var players = this.playerNode.getChildByName('figure');
        players.x = a;

        this.Light.x = a - 20;
        if (players.x > 320) {
            players.x = 320;
            this.Light.x = 300;
        }
        if (players.x < -320) {
            players.x = -320;
            this.Light.x = -340;
        }
    },

    _addCircle() {
        var playerPos = this.playerNode.getChildByName('figure');
        var graphics = this.mask._graphics;
        graphics.circle(playerPos.x, playerPos.y - this.moveLeght, 35)
        graphics.fill();
    },

    onButtonClick(event, customData) {
        // cc.log("点击回到顶部的按钮")
        this.touchh_end.node.active = false;
        this.touchh_start.node.active = true;
        cc.robot_ALLen_istrue = false;
        cc.touch_start_one = false;
        cc.touch_mission = false;
        cc.director.loadScene('game');  //  重新加载场景
    },

    // reMask(){
    //     console.log('初始化MASK');
    //     this.mask.type = cc.Mask.Type.RECT;
    // },

    destructionAll() {
        var re = cc.find('Canvas').getChildByName('score');
        var reV = cc.find('Canvas').getChildByName('scoreboard');
        var fig = cc.find('Canvas').getChildByName('figure');
        fig.destroy();
        if (re != null) {

            var lighting = cc.find('Canvas').getChildByName('Lightning').getChildByName('Label').getComponent(cc.Label);
            lighting.string = 10;

            var energyCount = cc.find('Canvas').getChildByName('energyCount').getComponent(cc.Label);
            energyCount.string = 0;
            re.destroy();
        }
        if (reV != null) {
            reV.destroy();

            let i = 10;
            var lighting = cc.find('Canvas').getChildByName('Lightning').getChildByName('Label').getComponent(cc.Label);
            let j = parseInt(lighting.string, 10); //returns 10
            lighting.string = j + i;
        }
        if (re != null) {

            re.destroyAllChildren();
        }

        for (let i = 0; i < this.FKList.length; i++) {
            this.FKList[i].destroy();
        }
        for (let j = 0; j < this.LightList.length; j++) {
            this.LightList[j].destroy();
        }
    },

    hidden: function (m) {

        //不需要的图片false掉
        this.node.getChildByName('start').active = m;
        this.node.getChildByName('DDDDIG').active = m;
        this.node.getChildByName('Level').active = m;
        this.node.getChildByName('select_pass').active = m;
        this.node.getChildByName('select_robot').active = m;
        this.node.getChildByName('settings').active = m;
        this.node.getChildByName('ads').active = m;

        this.node.getChildByName('gauge').active = true
        this.node.getChildByName('energyCount').active = true;
    },

    /**
    * 生成人物
    * 
    */
    spawnNewPlayer: function () {
        let self = this;
        // 使用给定的模板在场景中生成一个新节点
        var figure = cc.instantiate(self.player);
        // 将新增的节点添加到 Canvas 节点下面
        figure.parent = self.playerNode;
        // 为人物设置一个位置
        figure.setPosition(self.getNewPlayerPosition());
        cc.newplayer1 = figure;

    },

    /**
     * 触发开始Game
     */

    OnGameStart() {
        if (cc.robot_ALLen_istrue) {
            return;
        }
        let self = this;
        self.startmove(figure); //  人物左右移动
        if (cc.touch_mission) {
            return;
        }
        cc.player.stuat = true; //  屏幕滚动状态
        console.log('touch start');
        if (cc.touch_start_one) {
            return
        }
        this.topstartSprite.node.pauseAllActions();
        this.topstartSprite.node.active = false;
        cc.touch_start_one = true;
        let figure = self.playerNode.getChildByName('figure');
        self.hidden();  //  隐藏界面
        figure.getComponent('figure').JumP();    //  人物跳跃


        // self.node.off(cc.Node.EventType.TOUCH_START, self.touchBegan, self);//注销监听，防止第二次跳跃

    },

    getNewPlayerPosition: function () {
        var playerPos = this.node.getChildByName('bg').getChildByName('mask').getChildByName('ground_top');
        // 根据地面位置宽度得到一个人物的x坐标
        var randX = playerPos.x;
        // 根据地面位置高度得到一个人物的y坐标
        this.randY = playerPos.y + playerPos.height;
        // 返回人物坐标
        return cc.v2(randX, this.randY);
    },


    /*************************************************************hhq  */
    /**
       * 生成方块组   /  栏杆
       */
    createDiamondGroup() {
        let self = this;

        for (let i = 0; i < 5; i++) {
            let diamond = null;
            if (self.diamondPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                diamond = self.diamondPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                diamond = cc.instantiate(self.mission);
               
            }
            diamond.parent = self.diamondsNode; // 将生成的加入节点树
            self.FKList.push(diamond);
            let pos = self.getNewMissionPosition();//  获取位置
            let diamondCom = diamond.getComponent('DiamondNum');
            diamondCom.init();  //  初始化数据
            diamondCom.initPos(pos);    //  写入位置

        }

    },

    /**
     * 生成一个或者多个方块组   /  栏杆
     */
    createDiamond(Num) {
        // cc.log('生成多少个方块' + Num);
        let self = this;

        for (let i = 0; i < Num; i++) {
            /** 确定方块位置 */
            self.positionRound = Math.floor(Math.random() * 5 + 1); //  随机位置
            if (self.singlePos_X === self.positionRound) {    //  防止生成重叠
                i--
                continue;
            }
            self.singlePos_X = self.positionRound;  //  记录位置

            /** 生成方块 */
            let diamond = null;
            if (self.diamondPool.size() > 0) {
                diamond = self.diamondPool.get();
            } else {
                diamond = cc.instantiate(self.mission);
               
            }
            diamond.parent = self.diamondsNode; // 将生成的加入节点树
            self.FKList.push(diamond);
            let diamondCom = diamond.getComponent('DiamondNum');
            let pos = self.getNewMissionPosition()  //  获取方块可显示位置
            diamondCom.init();
            diamondCom.initPos(pos);

            /**  生成栏杆 */
            let isRailing = Math.round(Math.random()) //  控制栏杆的生成1为生成,0为不生成
            if (pos.x < 285 && isRailing > 0) {   //  设置最右边不生成
                let railingType = Math.floor(Math.random() * 2);  //  0   1    栏杆类型

                let minus = -1;    //  设置反转
                for (let j = 0; j < 2; j++) {
                    let buildType = 0 - Math.floor(Math.random() * 2);  //  随机生成栏杆类型  -1 0 1

                    let railing = null;
                    if (self.railingPool.size() > 0) {  //  从栏杆对象池中获取栏杆
                        railing = self.railingPool.get();
                    } else {
                        // railing = cc.instantiate(self.railing);
                        break;
                    }
                    if (buildType !== 0) {  //  双向栏杆
                        railing.parent = self.railingNode;  //   设置栏杆父节点 railingNode 节点下面
                        railing.getComponent('Railing').changeRailing(railingType, buildType);
                        railing.setPosition(pos.x + 68.5, pos.y + (105 + 67.5) * buildType);  // 为栏杆设置一个位置
                        break;
                    }
                    railing.parent = self.railingNode;  //   设置栏杆父节点 diamondsNode 节点下面
                    cc.log('名字' + railing.name)
                    railing.getComponent('Railing').changeRailing(railingType, buildType, minus);   //  （长/短 ，显示类型,是否反转）
                    railing.setPosition(pos.x + 68.5, pos.y + ((105 + 67.5) * minus));  // 为栏杆设置一个位置
                    minus = minus * -1;
                }

            }
        }
        self.singlePos_X = -100;    //  初始化记录
    },


    /**
     * 获取方块位置
     */
    getNewMissionPosition: function () {
        let self = this;
        let randX = -425;
        randX = randX + (self.positionRound * 142 * 1); // 根据地面位置宽度得到方块的x坐标
        self.positionRound++;
        // cc.log("方块Y" + self.diamondInitialPos);
        return cc.v2(randX, self.diamondInitialPos);  // 返回方块坐标
    },

    /**
     * 
     * 回收方块资源
     */
    onDiamondKilled() {
        let self = this;
        for (let i = 0; i < self.FKList.length; i++) {
            if(!cc.isValid(self.FKList[i])){
                self.FKList.splice(i,1);
                i--
                continue;
            }
            self.diamond_Y=self.FKList[i].y;
            break;
        }
        
        for (let i = 0; i < self.FKList.length; i++) {
         
            if(!cc.isValid(self.FKList[i])){
                self.FKList.splice(i,1);
                i--
                continue;
            }
            
            if(self.diamond_Y === self.FKList[i].y){
                self.diamondPool.put(self.FKList[i]);
                self.FKList.splice(i,1);
                i--;
              
            }

        }

        self.isS = false;


    },
    /**
     * 
     * 回收栏杆资源
     */
    onRailingKilled(railing) {
        let self = this;
        self.railingPool.put(railing);
    },




    spawnMission() {
        let self = this;

        if (self.recordsCreateDiamondNum === 5) {    //  生成方块组
            self.isGroup = true;   //   用于判断是否生成的事方块组
            self.createDiamondGroup();
            self.recordsCreateDiamondNum = 1;   //  重置记录数值
            self.loopNum++; //  测试

        } else {  //  生成非方块组
            self.isGroup = false;
            let num = Math.floor(Math.random() * 2 + 1)
            self.createDiamond(num);
            self.recordsCreateDiamondNum++;
        
                self.isS = true;
     

        }

        self.diamondInitialPos -= (210 + 106.5 + 20 ); // 往下生成  （railingg高度 + 方块的半高 + 20）

    },

    spawnNewStar() { // hhq
        let self = this;
        let lightning = null;
        if (self.lightPool.size() > 0) {
            lightning = self.lightPool.get();
        } else {
            cc.log('没有东西了')
            return;
        }
        // let lightning = cc.instantiate(self.Lightning);  // 使用给定的模板在场景中生成一个新节点
        lightning.parent = self.lightningNode;// 设置父节点 lightningNode 节点下面
        let lightPos = self.getNewLightPosition();  //  获取随机位置
        lightning.getComponent('Lightning').init(lightPos); //  设置能量
        self.LightList.push(lightning);

        // lightning.setPosition(lightPos); // 为闪电设置一个随机位置
        this.lightY -= 336.5;
    },


    getNewLightPosition: function () {// hhq

        let lightningX = -425;
        // 根据屏幕宽度，随机得到一个能量 x 坐标
        // var maxX =  this.node.getChildByName('bg').width/3;
        let lightningPos = Math.floor(Math.random() * 5);
        lightningX = lightningX + (lightningPos * 142 * 1); // 根据地面位置y宽度得到方块的x坐标
        return cc.v2(lightningX, this.lightY);

    },
    //人物爆炸动画
    robotBoomFunc() {
        var tou = this.playerNode.getChildByName('figure').getChildByName('tou');
        var actou = cc.moveBy(0.5, cc.v2(50, 50));
        tou.node.runAction(actou);
    },

    start() {

    },

    onDestroy() {
        this.offTouchEvent();
    },

    update(dt) {
        this.positionRound = 1;
        if (this.stuat == true) {
            this.bgMoveFunction(this.bgSprite, this.roll_speed);
            var gauge = this.node.getChildByName('gauge').getChildByName('gauge_bar');
            gauge.width -= 0.23;
            if (this.moveBg.y === 4000) {
                // cc.endFour = false;
                // this.stuat = false;
                // //游戏结束，停止钻头
                // this.FKList = [];
                // // this.victory();
                // this.scoring();
            }

            //  this.time += dt;//dt为每一帧执行的时间，把它加起来等于运行了多长时间
            //  var x1 = Math.round( this.time);

         

            var players = this.playerNode.getChildByName('figure');
            // this._addCircle(players.x, players.y - this.moveLeght);


            

            this.moveBg.y += 4;
            // this.moveLeght += 4;
            // this.bg.y += 4;
            this.recovery +=this.roll_speed * dt;
          
        }
    },
    scoring() {
        let energyCount = cc.find('Canvas').getChildByName('energyCount').getComponent(cc.Label).string;
        let count = cc.find('Canvas').getChildByName('scoreboard').getChildByName('score').getComponent(cc.Label);
        count.string = energyCount;

        //    //停止播放挖地洞音效
        // cc.loader.loadRes('music/drill_loop', cc.AudioClip, function (err, AudioClip) {
        //     audioPlayer.stopBgMusic(AudioClip);
        // });

        // //播放赢得音效
        // cc.loader.loadRes('music/Fireworks', cc.AudioClip, function (err, AudioClip) {
        //     audioPlayer.playYinXiao(AudioClip);
        // });

    },
    victory() {
        this.touchh_end.node.active = true;
        this.touchh_start.node.active = false;
        // 使用给定的模板在场景中生成一个新节点
        var newscoreboard = cc.instantiate(this.scoreboard);
        // 将新增的节点添加到 Canvas 节点下面
        newscoreboard.parent = cc.find('Canvas');
        this.victoryList.push(newscoreboard);
        newscoreboard.y = 300;
        this.topcontinue.node.active = true;
        this.topstartFunction(this.topcontinue);
    },

});
