
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this.node.on(cc.Node.EventType.TOUCH_START,this.initPassFun,this);
    },

    start () {

    },

    initPassFun(){
        cc.log(this.node.name);
    }

    // update (dt) {},
});
