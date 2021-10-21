(function(root) {
    class Index {
        constructor(len) {
            this.index = 0;
            this.len = len;
        }
        prev() { //上一首
            return this.get(-1);
        }
        next() { //下一首
            return this.get(1);
        }
        get(val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }

    }
    root.controlIndex = Index;
})(window.player || (window.player = {}))