let fs = require('fs');
let obj = {};
['readFile', 'readdir'].forEach(key => {
    obj[key] = function (url, encoding = null) {
        if (/\.(js|css|html|txt|json)/i.test(url)) {
            encoding = 'utf-8'
        };
        return new Promise((res, rej) => {
            fs[key](url, encoding, (err, data) => {
                if (!err) {
                    res(data)
                } else {
                    rej(err)
                };
            });
        });
    };
});

['mkdir', 'rmdir', 'unlink'].forEach(key => {
    obj[key] = function (url) {
        return new Promise((res, rej) => {
            fs[key](url, (err) => {
                if (!err) {
                    res('success');
                } else {
                    rej(err);
                };
            });
        });
    };
});

['writeFile', 'appendFile'].forEach(key => {
    obj[key] = function (url, data, encoding = 'utf-8') {
        return new Promise((res, rej) => {
            fs[key](url, data, encoding, (err) => {
                if (!err) {
                    res('success');
                } else {
                    rej(err);
                };
            });
        });
    };
});
module.exports = obj;