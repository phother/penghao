//定义map
function Map() {
    this.container = {};
}

//将key-value放入map中
Map.prototype.put = function (key, value) {
    try {
        if (key != null && key != "") {
            this.container[key] = value;
        }
    } catch (e) {
        return e;
    }
};

//根据key从map中取出对应的value
Map.prototype.get = function (key) {
    try {
        return this.container[key];
    } catch (e) {
        return e;
    }
};

//判断map中是否包含指定的key
Map.prototype.containsKey = function (key) {
    try {
        for (var p in this.container) {
            if (this.p == key)
                return true;
        }
        return false;

    } catch (e) {
        return e;
    }

};

//判断map中是否包含指定的value
Map.prototype.containsValue = function (value) {
    try {

        for (var p in this.container) {
            if (this.container[p] === value)
                return true;
        }

        return false;

    } catch (e) {
        return e;
    }
};


//删除map中指定的key
Map.prototype.remove = function (key) {
    try {

        delete this.container[key];

    } catch (e) {
        return e;
    }
};

//清空map
Map.prototype.clear = function () {
    try {
        delete this.container;
        this.container = {};

    } catch (e) {
        return e;
    }
};

//判断map是否为空
Map.prototype.isEmpty = function () {

    if (this.keyArray().length == 0)
        return true;
    else
        return false;
};

//获取map的大小
Map.prototype.size = function () {

    return this.keyArray().length;
};

//返回map中的key值数组
Map.prototype.keyArray = function () {

    var keys = new Array();
    for (var p in this.container) {
        keys.push(p);
    }

    return keys;
};

//返回map中的value值数组
Map.prototype.valueArray = function () {

    var values = new Array();
    var keys = this.keyArray();
    for (var i = 0; i < keys.length; i++) {
        values.push(this.container[keys[i]]);
    }

    return values;
};

function UUID() {
    this.id = this.createUUID();
}

// When asked what this Object is, lie and return it's value
UUID.prototype.valueOf = function () {
    return this.id;
};
UUID.prototype.toString = function () {
    return this.id;
};

//
// INSTANCE SPECIFIC METHODS
//
UUID.prototype.createUUID = function () {
    //
    // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
    // since JavaScript doesn't allow access to internal systems, the last 48 bits
    // of the node section is made up using a series of random numbers (6 octets long).
    //
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = UUID.getIntegerBits(t, 0, 31);
    var tm = UUID.getIntegerBits(t, 32, 47);
    var thv = UUID.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
    var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    // since detection of anything about the machine/browser is far to buggy,
    // include some more random numbers here
    // if NIC or an IP can be obtained reliably, that should be put in
    // here instead.
    var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
        UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
        UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
        UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
        UUID.getIntegerBits(UUID.rand(8191), 0, 15); // this last number is two octets long
    return tl + tm + thv + csar + csl + n;
};

//Pull out only certain bits from a very large integer, used to get the time
//code information for the first part of a UUID. Will return zero's if there
//aren't enough bits to shift where it needs to.
UUID.getIntegerBits = function (val, start, end) {
    var base16 = UUID.returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '') quadString += '0';
        else quadString += quadArray[i];
    }
    return quadString;
};

//Replaced from the original function to leverage the built in methods in
//JavaScript. Thanks to Robert Kieffer for pointing this one out
UUID.returnBase = function (number, base) {
    return (number).toString(base).toUpperCase();
};

//pick a random number within a range of numbers
//int b rand(int a); where 0 <= b <= a
UUID.rand = function (max) {
    return Math.floor(Math.random() * (max + 1));
};

/**
 * 时间日期转换
 * @param date
 * string number date moment
 * @returns {*}
 */
function translateDateToLong(date) {
    if (typeof date == "string") {
        if (date.indexOf("-") == -1 && date.indexOf("/") == -1) {
            return null;
        } else {
            return Date.parse(date.replace(/-/g, "/"));
        }
    } else if (typeof date == "object") {
        if ((moment.isMoment(date))) {
            return new Date(date).getTime();
        } else {
            if (date instanceof Date) {
                return date.getTime();
            } else {
                return null;
            }
        }
    } else if (typeof date == "number") {
        return date;
    } else {
        return date;
    }
}

/**
 * 时间日期转换 TO 一天的开始
 * @param date
 * string number date moment
 * @returns {*}
 */
function translateDateToStartOfDayLong(date) {
    var translateDate = new Date(translateDateToLong(date));
    translateDate.setHours(0);
    translateDate.setMinutes(0);
    translateDate.setSeconds(0);
    translateDate.setMilliseconds(0);
    return translateDate.getTime();
}

/**
 * 时间日期转换 TO 一天的结束
 * @param date
 * string number date moment
 * @returns {*}
 */
function translateDateToEndOfDayLong(date) {
    var translateDate = new Date(translateDateToLong(date));
    translateDate.setHours(23);
    translateDate.setMinutes(59);
    translateDate.setSeconds(59);
    translateDate.setMilliseconds(999);
    return translateDate.getTime();
}