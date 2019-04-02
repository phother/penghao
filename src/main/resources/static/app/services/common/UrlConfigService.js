/**
 * URL统一管理服务
 * Created by wangwj on 2016/6/4.
 */
angular.module("MetronicApp").service("UrlConfigService", function () {
    var Host = "";
    var RootPath = "";

    this.urlConfig = {
        //码表
        dataDictionary: {
            url: Host + RootPath + "/w/dicts/sync"
        },

        appCommon: {
            authorizations: {
                myMenus: Host + "/w/authorizations/myAuthorizedMenus"
            },
            login: {
                login: Host + "/w/login",
                checkLogin: Host + RootPath + "/w/checkLogin",
                logout: Host + "/logout"
            }
        },
        fileStorage: {
            uploadUrl: Host + "/upload",
            downloadUrl: Host + "/download"
        },
        system: {
            dictionary: {
                category: {
                	searchListUrl: Host + RootPath + "/w/dicts/categories/s",
                    url: Host + RootPath + "/w/dicts/categories/:id",
                    discardUrl: Host + RootPath + "/w/dicts/categories/:id/discard"
                },
                code: {
                    listUrl: Host + RootPath + "/w/dicts/categories/:categoryId/codes/:id",
                    url: Host + RootPath + "/w/dicts/:id",
                    discardUrl: Host + RootPath + "/w/dicts/:id/discard",
                    moveup: Host + RootPath + "/w/dicts/:id/moveup",
                    movedown: Host + RootPath + "/w/dicts/:id/movedown"
                }
            },
            menu: {
                url: Host + RootPath + "/w/sys/menus/:id",
                rootMenus: Host + RootPath + "/w/sys/menus/baseMenus",
                subMenus: Host + RootPath + "/w/sys/menus/:parentId/subMenus",
                menuTree: Host + RootPath + "/w/sys/menus/nodes"
            },
            UEditor: {
                UEditorUrl: Host + RootPath + "/w/sys/UEditor"
            },
            role: {
            	searchListUrl: Host + RootPath + "/w/roles/s",
                url: Host + RootPath + "/w/roles/:id",
                roleMenus: Host + RootPath + "/w/authorizations/roleMenus/:roleId"
            },
            department: {
                searchListUrl: Host + RootPath + "/w/departments/s",
                url: Host + RootPath + "/w/departments/:id",
            },
            platformUser: {
                searchListUrl: Host + RootPath + "/w/platformUser/s",
                url: Host + RootPath + "/w/platformUser/:id",
                enable: Host + RootPath + "/w/platformUser/:id/enable",
                disable: Host + RootPath + "/w/platformUser/:id/disable",
                changePasswordUrl: Host + RootPath + "/w/platformUser/:id/changePassword",
                getDeptByUserIdUrl: Host + RootPath + "/w/platformUser/getDept/:id",
                getUserDeptUrl: Host + RootPath + "/w/platformUser/getDept"
            },
            echartsDemo: {
                echartsLineUrl: Host + RootPath + "/w/sys/echarts/echartsLine",
                echartsPieUrl: Host + RootPath + "/w/sys/echarts/echartsPie"
            },
            fullCalendar: {
                fullCalendarUrl: Host + RootPath + "/w/sys/fullCalendar/"
            },
            dashboard: {
                url: Host + RootPath + "/w/sys/jsPlumb/:id"
            },
            D3Demo: {
                url: Host + RootPath + "/w/sys/D3demo"
            }
        },
        currencyReimburses: {
            listUrl: Host + RootPath + "/w/currencyReimburses/s",
            saveUrl: Host + RootPath + "/w/currencyReimburses",
            formUrl: Host + RootPath + "/w/currencyReimburses/:id",
            deleteUrl: Host + RootPath + "/w/currencyReimburses/:id",
        },
        travelExpense:{
            listUrl: Host + RootPath + "/w/travelReimburses/s",
            saveUrl: Host + RootPath + "/w/travelReimburses",
            url: Host + RootPath + "/w/travelReimburses/:id",
        }
    };
});

