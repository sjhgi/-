(function($, player) {
    class MusicPlayer {
        constructor(dom) {
            this.wrap = dom; //
            this.dataList = []; //用来存放数据
            this.indexObj = null; //索引值对象，用于切换歌曲
            this.timer = null; //旋转唱片的计时器
            this.list = null; //列表切歌对象
            this.curIndex = null; //记录当前的索引值
            this.progress = player.progress.pre(); //存储progress里面pre的实例方法
        }
        init() { // 初始化
            this.getDom();
            this.getData('../mock/data.json');
        }
        getDom() { // 获取页面里面的元素
            this.songImg = document.querySelector('.songImg img');
            this.bottomMenu = document.querySelectorAll('.bottomMenu ul li');
        }
        getData(url) { // 获取数据
            $.ajax({
                url: url,
                method: 'get',
                success: data => {
                    this.dataList = data;
                    this.indexObj = new player.controlIndex(data.length); //创建索引对象
                    this.listPlay();
                    this.dragProgress();
                    this.loadMusic(this.indexObj.index); //初始的时候加载第0个
                    this.musicControl();
                },
                error: function() {
                    console.log('获取数据失败');
                }
            })
        }
        loadMusic(index) { //加载音乐
            player.render(this.dataList[index]); //渲染页面
            player.music.load(this.dataList[index].audioSrc); //加载音乐
            this.progress.renderAllTime(this.dataList[index].duration); //渲染音乐的总时间
            if (player.music.status == 'play') { //切换的时候如果处于播放状态，就接着播放
                this.imgRotate(0);
                player.music.play();
                this.bottomMenu[2].className = 'playing'; //播放状态换按钮
                this.progress.move(0);
            } else {
                player.music.pause();
            }
            this.list.changeSelect(index); //让现在正在播放的索引值跟列表里面被选中的一一对应
            this.curIndex = index; //记录当前的索引
            //歌曲播放到头了要切歌
            player.music.end(() => {
                this.loadMusic(this.indexObj.next());
            })
        }
        musicControl() { //控制音乐(上一首，下一首....)
            // 上一首
            this.bottomMenu[1].addEventListener('touchend', () => { //touchend手指按下事件
                player.music.status = 'play';
                this.loadMusic(this.indexObj.prev());

            })
            this.bottomMenu[2].addEventListener('touchend', () => { // 暂停
                if (player.music.status == "play") { //处于播放状态让他暂停
                    player.music.pause(); //暂停
                    this.bottomMenu[2].className = ''; //暂停的话去掉class变为暂停按钮
                    this.imgStop(); //暂停旋转
                    this.progress.stop();
                } else {
                    player.music.play(); //开始
                    this.bottomMenu[2].className = 'playing'; //开始的话变换按钮
                    //第二次播放的时候需要加上上一次旋转的角度。但是第一次的时候这个角度是没有的，取不到。所以做了一个容错处理
                    let rog = this.songImg.dataset.rotate || 0;
                    this.imgRotate(rog); //开始旋转
                    this.progress.move(); //调用移动方法，进度条跟圆点

                }
            })
            this.bottomMenu[3].addEventListener('touchend', () => { // 下一首
                player.music.status = 'play';
                this.loadMusic(this.indexObj.next()); //调用索引模块的next方法
            })
        }
        imgRotate(rog) { //旋转唱片
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                rog = +rog + 0.2;
                this.songImg.style.transform = `rotate(${rog}deg)`;
                this.songImg.dataset.rotate = rog; //设置自定义属性用来记录角度，不然暂停在开始就乱了
            }, 1000 / 60);
        }
        imgStop() { //暂停旋转唱片
            clearInterval(this.timer);
        }
        listPlay() { //列表切歌
            this.list = player.listControl(this.dataList, this.wrap);
            this.bottomMenu[4].addEventListener('touchend', () => { //展开列表
                this.list.slideup();
            })
            this.list.musicList.forEach((item, index) => { //歌曲列表添加事件
                item.addEventListener('touchend', () => {
                    if (this.curIndex == index) { //自己是选中状态时在点击切换自己不会反应
                        return;
                    }
                    player.music.status = 'play';
                    this.indexObj.index = index; //更新索引值
                    this.loadMusic(this.indexObj.index);
                    this.list.slidedown(); //点击完后收起来

                })
            })
        }
        dragProgress() { //拖拽进度条
            let circle = player.progress.drag(document.querySelector('.circle'));
            circle.init();
            circle.start = () => { //按下圆点
                // player.music.pause(); //拖拽的时候让音乐暂停
            }
            circle.move = (per) => { //拖拽圆点
                // this.progress.update(per);
                this.progress.move(per);
            }
            circle.end = (per) => { //抬起圆点
                let curTime = per * this.dataList[this.indexObj.index].duration; //小圆点的位置
                player.music.playTo(curTime);
                player.music.play();
                this.progress.move(per); //进度条也要走
                this.bottomMenu[2].className = 'playing';
                let rog = this.songImg.dataset.rotate || 0;
                this.imgRotate(rog); //开始旋转


            }
        }
    }
    let musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    musicPlayer.init(); //调用初始化方法
})(window.Zepto, window.player)