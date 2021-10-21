(function(root) {
    //歌曲背景图片
    function renderImg(src) {
        root.blurImg(src); //给body添加背景图片
        let imgDom = document.querySelector('.songImg img');
        imgDom.src = src;
    }
    //歌曲信息
    function renderInfo(name, Album, author) {
        let songInfoChildern = document.querySelector('.songInfo').children;
        songInfoChildern[0].innerHTML = name;
        songInfoChildern[1].innerHTML = Album;
        songInfoChildern[2].innerHTML = author;
    }
    //渲染是否喜欢
    function renderLiker(like, index) {
        let likeDom = document.querySelectorAll('.bottomMenu ul li');
        if (like) {
            //给他加个class
            likeDom[0].classList.add('like');
        } else {
            likeDom[0].classList.remove('like');
        }
    }
    root.render = function(data) {
        renderImg(data.image);
        renderInfo(data.name, data.album, data.singer);
        renderLiker(data.isLike);
    }
})(window.player || (window.player = {}))