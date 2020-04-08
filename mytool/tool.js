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


