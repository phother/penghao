/**
 * 文件上传，下载
 * Created by wangwj on 2016/7/16.
 * Updated by wangwj on 2016/9/9.
 */
angular.module("MetronicApp").service('FileStorageService',
    ['$resource', 'toastr', 'UrlConfigService',
        function ($resource, toastr, UrlConfigService) {
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
        }
    ]
);