
cc.Class({
    extends: cc.Component,

    properties: {
        energy : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init (pos) {
        let self = this;
        let lightningEnergy = Math.floor(Math.random() * 9 + 1);     //随机生成0-10的能量值
        self.energy.string = lightningEnergy;
        self.node.x = pos.x;
        self.node.y = pos.y;
    }
    
});
