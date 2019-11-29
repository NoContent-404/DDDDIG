cc.Class({
    extends: cc.Component,
    properties: {
       
        label : cc.Label,
        Start : {
            default : null,
            type : cc.Node
        },
        
        isStart : false,    //  是否为星星方块
        timer : null,
    },


    onLoad () {
        // let self = this;
        
    },

    /**
     * 
     * @param {方块的值} value 
     */
    setValue (value) {
        let self = this;
        self.label.string = value;
    },

    /**
     * 
     * 显示星星
     */
    showStart () {
        let self = this;
        self.Start.active = true;
        self.isStart = true;
    },
    
    
     /**
     * 
     * 初始化
     */
    init () {
        let self = this;
        let value = Math.floor(Math.random()*10+1); //  获取数值
        self.label.string = value;
        if(value>10 && value<15){   //  设置颜色
            self.node.color = new cc.Color(247, 143, 10); //  颜色
        }
        let startValue = Math.floor(Math.random()*10+1);   //  获取随机值
        if(startValue < 3){
            self.showStart();
        }
        self.zindex = 99;
    },

    /**
     * 
     * 位置
     */
    initPos (pos) {
        let self = this;
        self.node.x=pos.x;
        self.node.y=pos.y;
    },

});
