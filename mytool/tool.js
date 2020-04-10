//格式化时间字符串
/* let time = '2020-4-8 16:36:8';
console.log(time.formatTime());
console.log(time.formatTime('{1}月 {3}时'));
console.log(time.formatTime('{1}-{2} {3}:{4}')); */
String.prototype.formatTime = function formatTime(template) {
    let arr = this.match(/\d+/g).map(item => {
        return item.length < 2 ? '0' + item : item;
    });
    template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
    return template.replace(/{(\d+)}/g, (_, group) => {
        return arr[group] || '00';
    });
};

//获取url参数
String.prototype.queryURLParams = function queryURLParams() {
    let obj = {};
    //哈希值处理
    this.replace(/#([^?=#&]+)/g, (_, group) => obj['HASH'] = group);
    //问号传参信息处理
    this.replace(/([^?#=&]+)=([^?#=&]+)/g, (_, group1, group2) => {
        obj[group1] = group2;
    });
    return obj;
};


//offset:获取元素距离body的左和上偏移量 Get the left and up offsets of the current element from the body
function offset(element) {
    //获取当前元素的父参照物和其距离父参照物的偏移
    let parent = element.offsetParent,
        top = element.offsettop,
        left = element.offsetLeft;
    //循环依次向上查找父参照物（一直到找不到为止）
    while (parent) {
        if (!/MSIE 8/.test(navigator.userAgent)) {
            left += parent.clientLeft;
            top += parent.clientTop;
        };
        //加上父参照物的偏移量
        left += parent.offsetLeft;
        top += parent.offsetTop;
        //继续向上查找
        parent = parent.offsetParent;
    };
    //把查找的结果返回
    return {
        top,
        left
    }
};