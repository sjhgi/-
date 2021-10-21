(function(root) {
    // 进度条
    class Progress {
        constructor() {
            this.durTime = 0; //获取音乐总时间
            this.frame = null; //计时器
            this.lastPercent = 0;
            this.init();

        }
        init() { //初始化方法
            this.getDom();
        }
        getDom() { //获取dom元素
            this.startTime = document.querySelector('.startTime');
            this.overTime = document.querySelector('.overTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
        }
        renderAllTime(time) { //获取总时间
            this.durTime = time;
            time = this.formatTime(time);
            this.overTime.innerHTML = time;
        }
        formatTime(time) { //把时间变为00:00模式
            time = Math.round(time); //四舍五入
            let m = Math.floor(time / 60); //传过来的是秒，变为分
            let s = time % 60;
            m = m.toString().padStart(2, 0); //不够两位前面补0
            s = s.toString().padStart(2, 0);
            return `${m}:${s}`;
        }
        move(per) { //移动
            //进度条移动
            // 看看有参数传入嘛，没有参数传输证明是暂停的时候掉的需要记录this.lastPercent的值，有参数传入证明是上一首下一首，这时应把他归0

            this.lastPercent = per === undefined ? this.lastPercent : per;
            cancelAnimationFrame(this.frameId); //每次调用之前先把上次的清除
            let This = this;
            this.beginTime = new Date().getTime(); //getTime转为毫秒--记录调用move的时候的时间
            function frame() { //相当于一个定时器
                let curTime = new Date().getTime();
                let pre = This.lastPercent + (curTime - This.beginTime) / (This.durTime * 1000); //百分比
                if (pre <= 1) {
                    This.update(pre);
                } else {
                    cancelAnimationFrame(This.frameId); //清除定时
                }
                This.frameId = requestAnimationFrame(frame); //关键帧，跟随浏览器的刷新频率决定

            }
            frame();
        }
        update(pre) { //更新
            // 更新左边时间
            this.startTime.innerHTML = this.formatTime(pre * this.durTime);
            //更新进度条
            this.frontBg.style.width = pre * 100 + '%';
            //跟新圆点
            let l = pre * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = `translateX(${l}px)`;
        }
        stop() { //停止
            cancelAnimationFrame(this.frameId);
            let stopTime = new Date().getTime(); //记下停止的时间
            //如果不用+=的话会漏掉一次已播放的时长百分比
            this.lastPercent += (stopTime - this.beginTime) / (this.durTime * 1000);
        }
    }

    function progressExample() {
        return new Progress();
    }
    // 拖拽
    class Drag {
        constructor(obj) {
            this.obj = obj;
            this.startPointX = 0; //拖拽时按下的坐标位置
            this.movePointX = 0; //按下时已经走的距离
            this.percentage = 0; //百分比
        }
        init() {
            this.obj.style.transform = `translateX(0)`;
            this.obj.addEventListener('touchstart', (ev) => { //手指按下事件
                // 因为有多个手指按下所以形成一个数组changedTouches,只选择第一次按下的那个
                this.startPointX = ev.changedTouches[0].pageX;
                this.movePointX = parseFloat(this.obj.style.transform.split('(')[1]);
                // console.log(this.movePointX, this.startPointX)
                this.start && this.start();
            })
            this.obj.addEventListener('touchmove', (ev) => { //手指移动事件
                this.disPoint = ev.changedTouches[0].pageX - this.startPointX; //拖动的距离
                let l = this.disPoint + this.movePointX; //小圆点要走的距离
                if (l < 0) {
                    l = 0;
                } else if (l > this.obj.parentNode.offsetWidth) {
                    l = this.obj.parentNode.offsetWidth;
                }
                this.obj.style.transform = `translateX(${l}px)`;
                this.percentage = l / this.obj.parentNode.offsetWidth; //计算出百分比
                this.move && this.move(this.percentage);
                ev.preventDefault();
            })
            this.obj.addEventListener('touchend', (ev) => { //手指松开事件
                this.end && this.end(this.percentage);
            })
        }
    }

    function drag(obj) {
        return new Drag(obj);
    }
    root.progress = {
        pre: progressExample,
        drag: drag
    }
})(window.player || (window.player = {}))