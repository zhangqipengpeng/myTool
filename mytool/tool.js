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
			element['style']['filter'] = `alpha(opacity=${value * 100})`;
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
	};

	let class2type = {};
	let toString = class2type.toString;
	"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(item => {
		class2type["[object " + item + "]"] = item.toLowerCase();
	});
	//检测数据类型
	function toType(obj) {
		if (obj == null) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[toString.call(obj)] || "object" :
			typeof obj;
	};

	function isFunction(obj) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	}

	function isWindow(obj) {
		return obj != null && obj === obj.window;
	}

	function isArrayLike(obj) {
		var length = !!obj && "length" in obj && obj.length,
			type = toType(obj);
		if (isFunction(obj) || isWindow(obj)) {
			return false;
		}
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	};
	/*
 	 * _each封装一个强大的迭代器 
	 *   @params
	 *      obj:要迭代的数组、类数组、对象
	 *      callback:每一次迭代触发执行的回调函数
	 *      context:要改变的回调函数的THIS
	 *   @return 
	 *      返回处理后的新数组/对象
	 */
	function _each(obj, callback, context = window) {
		obj = _cloneDeep(obj);
		if (obj == null) {
			throw new TypeError('OBJ必须是一个对象/数组/类数组!');
		}
		if (typeof obj !== "object") {
			throw new TypeError('OBJ必须是一个对象/数组/类数组!');
		}
		if (typeof callback !== "function") {
			throw new TypeError('CALLBACK必须是一个函数!');
		}
		if (isArrayLike(obj)) {
			for (let i = 0; i < obj.length; i++) {
				let res = callback.call(context, obj[i], i);
				if (res === false) {
					break;
				}
				if (res !== undefined) {
					obj[i] = res;
				}
			}
		} else {
			for (let key in obj) {
				if (!obj.hasOwnProperty(key)) break;
				let res = callback.call(context, obj[key], key);
				if (res === false) break;
				if (res !== undefined) obj[key] = res;
			}
		}
		return obj;
	};
	//深克隆
	function _cloneDeep(obj) {
		if (obj === null) return null;
		if (typeof obj !== "object") return obj;
		if (obj instanceof RegExp) return new RegExp(obj);
		if (obj instanceof Date) return new Date(obj);
		let cloneObj = new obj.constructor;
		for (let key in obj) {
			if (!obj.hasOwnProperty(key)) break;
			cloneObj[key] = obj[key];
		}
		return cloneObj;
	}
	//深比较
	function _assignDeep(obj1, obj2) {
		let obj = _cloneDeep(obj1);
		for (let key in obj2) {
			if (!obj2.hasOwnProperty(key)) break;
			let v2 = obj2[key],
				v1 = obj[key];
			if (toType(v1) === "object" && toType(v2) === "object") {
				obj[key] = _assignDeep(v1, v2);
				continue;
			}
			obj[key] = v2;
		}
		return obj;
	}

	return {
		css,
		offset,
		toType,
		isArrayLike,
		_each,
		_cloneDeep,
		_assignDeep
	};
})();