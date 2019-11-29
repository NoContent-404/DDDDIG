var audioPlayer = new Object();

audioPlayer.setYinLiang = function (yinLiang) {
    if (typeof yinLiang == "number") {
        cc.sys.localStorage.setItem('yinLiang', yinLiang);
        this.yinLiang = yinLiang;
        if (this.bgId != null) {
            cc.audioEngine.setVolume(this.bgId, this.yinLiang);
        }
    }
};

audioPlayer.setYinXiao = function (yinXiao) {
    if (typeof yinXiao == "number") {
        cc.sys.localStorage.setItem('yinXiao', yinXiao);
        this.yinXiao = yinXiao;
    }
};

audioPlayer.getYinLiang = function () {
    this.init();
    return this.yinLiang;
};

audioPlayer.getYinXiao = function () {
    this.init();
    return this.yinXiao;
};

audioPlayer.init = function () {
    if (this.yinLiang != null && this.yinXiao != null) {
        return;
    }
    var yinLiangS = cc.sys.localStorage.getItem('yinLiang');
    var yinLiang = 1;
    if (yinLiangS != null) {
        yinLiang = parseFloat(yinLiangS);
    }
    else {
        this.setYinLiang(1);
    }
    var yinXiaoS = cc.sys.localStorage.getItem('yinXiao');
    var yinXiao = 1;
    if (yinXiaoS != null) {
        yinXiao = parseFloat(yinXiaoS);
    }
    else {
        this.setYinXiao(yinXiao);
    }
    this.yinLiang = yinLiang;
    this.yinXiao = yinXiao;
};

audioPlayer.playYinXiao = function (audio) {
    console.log("音效 = " + audio );
    this.init();
    if (this.yinXiao <= 0) {
        return -1;
    }
    var audioID = cc.audioEngine.play(audio, false, this.yinXiao);
    return audioID;
};

audioPlayer.playYinLiang = function (audio, loop) {
    this.init();
    // if (this.yinLiang <= 0) {
    //     return -1;
    // }
    var audioID = cc.audioEngine.play(audio, loop, this.yinLiang);
    return audioID;
};

audioPlayer.playerBgMusic = function (audio) {
    if (this.bgId != null) {
        cc.audioEngine.stop(this.bgId);
        this.bgId = null;
    }
    this.bgId = this.playYinLiang(audio, true);
};

audioPlayer.stopBgMusic = function () {
    if (this.bgId != null) {
        cc.audioEngine.stop(this.bgId);
    }
    this.bgId = null;
};
audioPlayer.resumeBgMusic = function (audio) {
    if (this.bgId != null) {
        cc.audioEngine.stop(this.bgId);
    }
    this.bgId = this.playYinLiang(audio, true);
};
audioPlayer.playerBntMusic = function () {
    // 播放音效
    cc.loader.loadRes('audios/bg/anniu', cc.AudioClip, function (err, AudioClip) {
        audioPlayer.playYinXiao(AudioClip);
    });
};



module.exports = audioPlayer;