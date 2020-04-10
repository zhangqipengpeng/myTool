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

//给元素设置css样式（css方法） 获取元素到body的距离（offset方法）
let utils = (function () {
	function getCss(element, attr) {
		let value = window.getComputedStyle(element)[attr],
			reg = /^\d+(px|rem|em)?$/i;
		if (reg.test(value)) {
			value = parseFloat(value);
		}
		return value;
	}

	function setCss(element, attr, value) {
		if (attr === "opacity") {
			element['style']['opacity'] = value;
			element['style']['filter'] = `alpha(opacity=${value*100})`;
			return;
		}
		let reg = /^(width|height|margin|padding)?(top|left|bottom|right)?$/i;
		if (reg.test(attr)) {

			if (!isNaN(value)) {
				value += 'px';
			}
		}
		element['style'][attr] = value;
	}

	function setGroupCss(element, options) {
		for (let key in options) {
			if (!options.hasOwnProperty(key)) break;
			setCss(element, key, options[key]);
		}
	}

	function css(element) {
		let len = arguments.length,
			attr = arguments[1],
			value = arguments[2];
		if (len >= 3) {
			// 单一设置样式
			setCss(element, attr, value);
			return;
		}
		if (attr !== null && typeof attr === "object") {
			// 批量设置
			setGroupCss(element, attr);
			return;
		}
		// 获取样式
		return getCss(element, attr);
	}

	function offset(element) {
		let parent = element.offsetParent,
			top = element.offsetTop,
			left = element.offsetLeft;
		while (parent) {
			if (!/MSIE 8/.test(navigator.userAgent)) {
				left += parent.clientLeft;
				top += parent.clientTop;
			}
			left += parent.offsetLeft;
			top += parent.offsetTop;
			parent = parent.offsetParent;
		}
		return {
			top,
			left
		};
	}
	
	return {
		css,
		offset
	};
})();