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
     * 改变颜色
     */
    changeColor () {},

    // /**
    //  * 
    //  * 开启自毁
    //  */
    // diamondOpendDestruct () {
    //     let self = this;
    //     self.timer = setTimeout(function () {
    //         if(cc.isValid(self.node)){
    //             self.node.destroy();
    //         }
    //     }, 5000);
    // },

    // diamondCloseDestruct () {
    //     let self = this;
    //     clearTimeout(self.timer);
    // }


});
