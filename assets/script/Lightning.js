
cc.Class({
    extends: cc.Component,

    properties: {
        energy : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setEnergy (lightningEnergy) {
        let self = this;

        self.energy.string = lightningEnergy;
    }
    
});
