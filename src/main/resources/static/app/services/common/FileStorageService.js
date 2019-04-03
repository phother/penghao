/**
 * 文件上传，下载
 * Created by wangwj on 2016/7/16.
 * Updated by wangwj on 2016/9/9.
 */
angular.module("MetronicApp").service('FileStorageService',
    ['$resource','$http', 'toastr', 'UrlConfigService',
        function ($resource,$http, toastr, UrlConfigService) {
            this._uploadUrl = UrlConfigService.urlConfig.fileStorage.uploadUrl;
            this._downLoadUrl = UrlConfigService.urlConfig.fileStorage.downloadUrl;

            this.getFileUploadUrl = function () {
                return this._uploadUrl;
            };

            this.getFileDownloadUrl = function (fileNo, type) {
                return this._downLoadUrl + "/" + fileNo + (type ? '?type=' + type : '');
            };

            this.downloadFileByNoAndType = function (fileNo, type) {
                var url = this._downLoadUrl + "/" + fileNo + (type ? '?type=' + type : '');
                this.downloadFileByUrl(url)
            };

            this.downloadFileByUrl = function (url, paramMap, fileName) {
                var flag = false;
                if (paramMap) {
                    angular.forEach(paramMap, function (value, key) {
                        if (!flag) {
                            url += ("?");
                            flag = true;
                        }
                        if (value) {
                            url += ("&" + key + "=" + value);
                        }
                    });
                }
                var link = document.createElement('a');
                if ('download' in link) {
                    link.setAttribute("id", "download_link");
                    link.setAttribute('href', url);
                    if (fileName) {
                        link.setAttribute("download", fileName);
                    } else {
                        link.setAttribute("download", null);
                    }
                    link.click();
                } else {
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("id", "download_iframe");
                    iframe.style.display = "none";
                    iframe.src = url;
                    document.body.appendChild(iframe);
                }
            };

            this.clearFlowFile = function ($flow) {
                for (var i = $flow.files.length - 1; i >= 0; i--) {
                    $flow.files[i].cancel();
                }
            };

            this.validateFile = function (file, typePattern, typeErrorMsg, size) {
                if (!size) {
                    size = 1024 * 1024 * 1024;
                } else {
                    size = parseInt(size);
                }
                var fileSize = file.file.size;
                if (fileSize > size) {
                    var limitSize = size / 1024 / 1024;
                    toastr.error("", "文件不能超过" + limitSize + "M");
                    return false;
                }
                var fileType = file.file.type;
                if (typePattern) {
                    if (!typeErrorMsg) {
                        typeErrorMsg = "文件格式不正确。"
                    }
                    if (!typePattern.test(fileType)) {
                        toastr.error("", typeErrorMsg);
                        return false;
                    }
                }
                return true;
            };

            this.exportExcelfile = function (url, param, name) {
                var queryMap = {};
                if (param) {
                    for (var k in param) {
                        if (param.hasOwnProperty(k) && param[k] != undefined && param[k] !== "") {
                            queryMap['s_' + k] = param[k];
                        }
                    }
                }
                var urlParamEncodeStr = this._urlParamEncode(queryMap);

                if (urlParamEncodeStr) {
                    if(param.sort){
                        url = url + "?sort="+param.sort+",desc"+"&" + this._urlParamEncode(queryMap);
                    }else{
                        url = url + "?" + this._urlParamEncode(queryMap);
                    }
                }
                $http.get(url, {responseType: 'arraybuffer'})
                    .success(function (data, status, headers) {
                        var octetStreamMime = 'application/octet-stream';
                        var success = false;
                        headers = headers();
                        var filename = headers['x-filename'] || name;
                        var contentType = headers['content-type'] || octetStreamMime;
                        try {
                            console.log("Trying saveBlob method ...");
                            var blob = new Blob([data], {type: contentType});
                            if (navigator.msSaveBlob)
                                navigator.msSaveBlob(blob, filename);
                            else {
                                var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                                if (saveBlob === undefined) throw "Not supported";
                                saveBlob(blob, filename);
                            }
                            console.log("saveBlob succeeded");
                            success = true;
                        } catch (ex) {
                            console.log("saveBlob method failed with the following exception:");
                            console.log(ex);
                        }
                        if (!success) {
                            var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                            if (urlCreator) {
                                var link = document.createElement('a');
                                if ('download' in link) {
                                    try {
                                        console.log("Trying download link method with simulated click ...");
                                        var blob = new Blob([data], {type: contentType});
                                        var url = urlCreator.createObjectURL(blob);
                                        link.setAttribute('href', url);

                                        link.setAttribute("download", filename);

                                        var event = document.createEvent('MouseEvents');
                                        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                        link.dispatchEvent(event);
                                        console.log("Download link method with simulated click succeeded");
                                        success = true;
                                    } catch (ex) {
                                        console.log("Download link method with simulated click failed with the following exception:");
                                        console.log(ex);
                                    }
                                }
                                if (!success) {
                                    try {
                                        console.log("Trying download link method with window.location ...");
                                        var blob = new Blob([data], {type: octetStreamMime});
                                        var url = urlCreator.createObjectURL(blob);
                                        window.location = url;
                                        console.log("Download link method with window.location succeeded");
                                        success = true;
                                    } catch (ex) {
                                        console.log("Download link method with window.location failed with the following exception:");
                                        console.log(ex);
                                    }
                                }
                            }
                        }
                        if (!success) {
                            console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                            window.open(httpPath, '_blank', '');
                        }
                    })
                    .error(function (data, status) {
                        console.log("Request failed with status: " + status);
                        // $scope.errorDetails = "Request failed with status: " + status;
                    });
            };

            this._encodeUrl = function (key, value) {
                if (key && value != undefined && value !== "") {
                    return key + '=' + encodeURIComponent(value === null ? '' : String(value)).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+');
                } else {
                    return "";
                }
            };

            this._urlParamEncode = function (param) {
                var service = this;
                var urlParam = [];
                for (var key in param) {
                    key = encodeURIComponent(key);
                    var values = param[key];
                    if (values != undefined && values.constructor == Array) {//数组
                        var queryValues = [];
                        for (var i = 0, len = values.length, value; i < len; i++) {
                            value = values[i];
                            queryValues.push(service._encodeUrl(key, value));
                        }
                        urlParam = urlParam.concat(queryValues);
                    } else { //字符串
                        urlParam.push(service._encodeUrl(key, values));
                    }
                }
                return urlParam.join('&');
            };
        }
    ]
);