(function(root) {
    function listControl(data, wrap) {
        let list = document.createElement('div');
        let dl = document.createElement('dl');
        let dt = document.createElement('dt');
        let close = document.createElement('div');
        let musicList = [];
        list.className = "songList";
        dt.innerHTML = "播放列表";
        close.className = "close";
        dl.appendChild(dt);
        data.forEach((item, index) => {
            let dd = document.createElement('dd');
            dd.innerHTML = item.name;
            //给每个dd加个事件，手指触摸则触发，然后变为选中状态
            dd.addEventListener('touchend', () => { changeSelect(index) });
            musicList.push(dd);
            dl.appendChild(dd);
        })
        list.appendChild(dl);
        list.appendChild(close);
        wrap.appendChild(list);
        changeSelect(0); //第一个先默认为选中状态
        let disY = list.offsetHeight;
        list.style.transform = `translateY(${disY}px)`;
        close.addEventListener('touchend', slidedown); //关闭按钮
        function slideup() { //列表滑动显示
            list.style.transition = '.2s';
            list.style.transform = `translateY(0)`;
        }

        function slidedown() { //列表滑动隐藏
            list.style.transition = '.2s';
            list.style.transform = `translateY(${disY}px)`;
        }
        //切换选中元素
        function changeSelect(index) {
            for (let i = 0; i < musicList.length; i++) {
                musicList[i].className = '';
            }
            musicList[index].className = 'active';
        }
        return {
            musicList,
            slideup,
            slidedown,
            changeSelect
        }
    }
    root.listControl = listControl;
})(window.player || (window.player = {}))