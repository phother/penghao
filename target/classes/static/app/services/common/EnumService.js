/**
 * 基础（枚举）数据存储服务
 * Created by wangwj on 2016/6/4.
 */
angular.module("MetronicApp").service("EnumService", function () {
    this._data = {
        /*性别*/
        "genderType": [
            {"key": "male", "text": "男"},
            {"key": "female", "text": "女"}
        ]
    };
    this.get = function (key) {
        return this._data[key];
    }
});