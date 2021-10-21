(function(root) {
    class AudioMange {
        constructor() {
            this.audio = new Audio();
            this.status = 'pause'; //刚开始时暂停的
        }
        load(src) { //加载音乐
            this.audio.src = src;
            this.audio.load(); //加载音乐
        }
        play() { //播放音乐
            this.audio.play();
            this.status = "play";
        }
        pause() { //暂停音乐
            this.audio.pause();
            this.status = "pause";
        }
        end(fn) { //音乐播放完成事件
            this.audio.onended = fn; //音乐播放完成就会调用这个回调函数
        }
        playTo(time) { // 跳到某个时间点
            this.audio.currentTime = time; //以秒为单位
        }
    }
    root.music = new AudioMange();
})(window.player || (window.player = {}))