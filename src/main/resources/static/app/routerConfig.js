/**
 * Created by wangwj on 16-8-16.
 */
/* Setup Rounting For All Pages */
angular.module("MetronicApp").config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url 配置路由需要引用第三方技术ui.router，并注入$stateProvider和$urlRouterProvider
    $urlRouterProvider.otherwise("/dash.html");//默认路由跳转地址

    $stateProvider
    //我的实例列表
        .state('dash', {
            url: "/dash.html",
            templateUrl: "views/dash.html",
            data: {
                pageTitle: "主页",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"}
                ]
            },
            controller: "DashController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'app/controllers/DashController.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCategoryList', {
            url: "/system/dictionary/category/list.html",
            templateUrl: "views/system/dictionary/category/list.html",
            data: {
                pageTitle: "码表类型管理",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "", class: "", title: "码表类型管理"}
                ]
            },
            controller: "DictionaryCategoryListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCategoryController.js',
                            'app/services/system/dictionary/DictionaryCategoryService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCategoryCreate', {
            url: "/system/dictionary/category/create.html",
            templateUrl: "views/system/dictionary/category/edit.html",
            data: {
                pageTitle: "创建码表类型信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表类型管理"},
                    {href: "", class: "", title: "创建码表类型信息"}
                ]
            },
            controller: "DictionaryCategoryEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/dictionary/DictionaryCategoryController.js',
                            'app/services/system/dictionary/DictionaryCategoryService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCategoryEdit', {
            url: "/system/dictionary/category/edit.html",
            templateUrl: "views/system/dictionary/category/edit.html",
            data: {
                pageTitle: "编辑码表类型信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表类型管理"},
                    {href: "", class: "", title: "编辑码表类型信息"}
                ]
            },
            controller: "DictionaryCategoryEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/dictionary/DictionaryCategoryController.js',
                            'app/services/system/dictionary/DictionaryCategoryService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCategoryView', {
            url: "/system/dictionary/category/view.html",
            templateUrl: "views/system/dictionary/category/view.html",
            data: {
                pageTitle: "查看码表类型信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表类型管理"},
                    {href: "", class: "", title: "查看码表类型信息"}
                ]
            },
            controller: "DictionaryCategoryViewController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/dictionary/DictionaryCategoryController.js',
                            'app/services/system/dictionary/DictionaryCategoryService.js'
                        ]
                    });
                }]
            }
        })

        .state('dictionaryCodeList', {
            url: "/system/dictionary/code/list.html",
            templateUrl: "views/system/dictionary/code/list.html",
            data: {
                pageTitle: "码表类型管理",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表类型管理"},
                    {href: "", class: "", title: "码表类型管理"}
                ]
            },
            controller: "DictionaryCodeListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCodeController.js',
                            'app/services/system/dictionary/DictionaryCodeService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCodeCreate', {
            url: "/system/dictionary/code/create.html",
            templateUrl: "views/system/dictionary/code/edit.html",
            data: {
                pageTitle: "创建码表类型信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表类型管理"},
                    {href: "#/system/dictionary/code/list.html", class: "", title: "码表类型管理"},
                    {href: "", class: "", title: "创建码表类型信息"}
                ]
            },
            controller: "DictionaryCodeEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCodeController.js',
                            'app/services/system/dictionary/DictionaryCodeService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCodeEdit', {
            url: "/system/dictionary/code/edit.html",
            templateUrl: "views/system/dictionary/code/edit.html",
            data: {
                pageTitle: "编辑码表类型信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表类型管理"},
                    {href: "#/system/dictionary/code/list.html", class: "", title: "码表类型管理"},
                    {href: "", class: "", title: "编辑码表类型信息"}
                ]
            },
            controller: "DictionaryCodeEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCodeController.js',
                            'app/services/system/dictionary/DictionaryCodeService.js'
                        ]
                    });
                }]
            }
        })
        .state('dictionaryCodeView', {
            url: "/system/dictionary/code/view.html",
            templateUrl: "views/system/dictionary/code/view.html",
            data: {
                pageTitle: "查看码表类型信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/dictionary/category/list.html", class: "", title: "码表类型管理"},
                    {href: "#/system/dictionary/code/list.html", class: "", title: "码表类型管理"},
                    {href: "", class: "", title: "查看码表类型信息"}
                ]
            },
            controller: "DictionaryCodeEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/dictionary/DictionaryCodeController.js',
                            'app/services/system/dictionary/DictionaryCodeService.js'
                        ]
                    });
                }]
            }
        })
        .state('menuList', {
            url: "/system/menu/list.html",
            templateUrl: "views/system/menu/list.html",
            data: {
                pageTitle: "菜单信息列表",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "", class: "", title: "菜单管理"}
                ]
            },
            controller: "MenuListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/menu/MenuController.js',
                            'app/services/system/menu/MenuService.js'
                        ]
                    });
                }]
            }
        })
        .state('menuCreate', {
            url: "/system/menu/create.html",
            templateUrl: "views/system/menu/edit.html",
            data: {
                pageTitle: "创建菜单信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/menu/list.html", class: "", title: "菜单管理"},
                    {href: "", class: "", title: "创建菜单信息"}
                ]
            },
            controller: "MenuEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/menu/MenuController.js',
                            'app/services/system/menu/MenuService.js'
                        ]
                    });
                }]
            }
        })
        .state('menuEdit', {
            url: "/system/menu/edit.html",
            templateUrl: "views/system/menu/edit.html",
            data: {
                pageTitle: "编辑菜单信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/menu/list.html", class: "", title: "菜单管理"},
                    {href: "", class: "", title: "编辑菜单信息"}
                ]
            },
            controller: "MenuEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/menu/MenuController.js',
                            'app/services/system/menu/MenuService.js'
                        ]
                    });
                }]
            }
        })
        .state('menuView', {
            url: "/system/menu/view.html",
            templateUrl: "views/system/menu/view.html",
            data: {
                pageTitle: "查看菜单信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/menu/list.html", class: "", title: "菜单管理"},
                    {href: "", class: "", title: "查看菜单信息"}
                ]
            },
            controller: "MenuEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/menu/MenuController.js',
                            'app/services/system/menu/MenuService.js'
                        ]
                    });
                }]
            }
        })

        .state('roleList', {
            url: "/system/role/list.html",
            templateUrl: "views/system/role/list.html",
            data: {
                pageTitle: "角色信息列表",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "", class: "", title: "角色管理"}
                ]
            },
            controller: "RoleListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/role/RoleController.js',
                            'app/services/system/role/RoleService.js'
                        ]
                    });
                }]
            }
        })

        .state('roleCreate', {
            url: "/system/role/create.html",
            templateUrl: "views/system/role/edit.html",
            data: {
                pageTitle: "创建角色信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/role/list.html", class: "", title: "角色管理"},
                    {href: "", class: "", title: "创建角色信息"}
                ]
            },
            controller: "RoleEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/role/RoleController.js',
                            'app/services/system/role/RoleService.js'
                        ]
                    });
                }]
            }
        })

        .state('roleEdit', {
            url: "/system/role/edit.html",
            templateUrl: "views/system/role/edit.html",
            data: {
                pageTitle: "编辑角色信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/role/list.html", class: "", title: "角色管理"},
                    {href: "", class: "", title: "编辑角色信息"}
                ]
            },
            controller: "RoleEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/role/RoleController.js',
                            'app/services/system/role/RoleService.js'
                        ]
                    });
                }]
            }
        })

        .state('roleView', {
            url: "/system/role/view.html",
            templateUrl: "views/system/role/view.html",
            data: {
                pageTitle: "查看角色信息",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/role/list.html", class: "", title: "角色管理"},
                    {href: "", class: "", title: "查看角色信息"}
                ]
            },
            controller: "RoleEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/role/RoleController.js',
                            'app/services/system/role/RoleService.js'
                        ]
                    });
                }]
            }
        })

        .state('platformUserList', {
            url: "/system/platformUser/list.html",
            templateUrl: "views/system/platformUser/list.html",
            data: {
                pageTitle: "平台用户管理列表",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "", class: "", title: "平台用户管理列表"}
                ]
            },
            controller: "PlatformUserController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/platformUser/PlatformUserController.js',
                            'app/services/system/platformUser/PlatformUserService.js'
                        ]
                    });
                }]
            }
        })
        .state('platformUserEdit', {
            url: "/system/platformUser/edit.html",
            templateUrl: "views/system/platformUser/edit.html",
            data: {
                pageTitle: "平台用户管理列表--编辑",
                pageBar: [
                    {href: "", class: "fa fa-cog", title: "系统管理"},
                    {href: "#/system/platformUser/list.html", class: "", title: "平台用户管理列表"},
                    {href: "", class: "", title: "编辑平台用户"}

                ]
            },
            controller: "PlatformUserEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/platformUser/PlatformUserController.js',
                            'app/services/system/platformUser/PlatformUserService.js'
                        ]
                    });
                }]
            }
        })
        .state('platformUserCreate', {
            url: "/system/platformUser/create.html",
            templateUrl: "views/system/platformUser/edit.html",
            data: {
                pageTitle: "平台用户管理列表--新增",
                pageBar: [
                    {href: "", class: "fa fa-users", title: "注册用户管理"},
                    {href: "#/system/platformUser/list.html", class: "", title: "平台用户管理列表"},
                    {href: "", class: "", title: "新增平台用户"}
                ]
            },
            controller: "PlatformUserEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/platformUser/PlatformUserController.js',
                            'app/services/system/platformUser/PlatformUserService.js'
                        ]
                    });
                }]
            }
        })
        .state('platformUserView', {
            url: "/system/platformUser/view.html",
            templateUrl: "views/system/platformUser/view.html",
            data: {
                pageTitle: "平台用户管理列表--查看",
                pageBar: [
                    {href: "", class: "fa fa-users", title: "注册用户管理"},
                    {href: "#/system/platformUser/list.html", class: "", title: "平台用户管理列表"},
                    {href: "", class: "", title: "查看平台用户"}
                ]
            },
            controller: "PlatformUserEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/platformUser/PlatformUserController.js',
                            'app/services/system/platformUser/PlatformUserService.js'
                        ]
                    });
                }]
            }
        })
        .state('platformUserPasswordEdit', {
            url: "/system/platformUser/password.html",
            templateUrl: "views/system/platformUser/password.html",
            data: {
                pageTitle: "平台用户管理列表--密码修改",
                pageBar: [
                    {href: "", class: "fa fa-users", title: "注册用户管理"},
                    {href: "#/system/platformUser/list.html", class: "", title: "平台用户管理列表"},
                    {href: "", class: "", title: "修改平台用户密码"}
                ]
            },
            controller: "PlatformUserPasswordEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/platformUser/PlatformUserController.js',
                            'app/services/system/platformUser/PlatformUserService.js'
                        ]
                    });
                }]
            }
        })

        .state('jsTreeDemo', {
            url: "/system/jsTreeDemo/list.html",
            templateUrl: "views/system/jsTreeDemo/list.html",
            data: {
                pageTitle: "tree",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "tree示例"},
                ]
            },
            controller: "JsTreeDemoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngTable/directive.js',
                            'app/controllers/system/jsTreeDemo/JsTreeDemoController.js',
                            'app/services/system/jsTreeDemo/JsTreeDemoService.js'
                        ]
                    });
                }]
            }
        })

        .state('echartsDemo', {
            url: "/system/echartsDemo/list.html",
            templateUrl: "views/system/echartsDemo/list.html",
            data: {
                pageTitle: "tree",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "图表示例"},
                ]
            },
            controller: "EchartsDemoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/directives/ngEcharts/ngEchartsLine.js',
                            'app/directives/ngEcharts/ngEchartsPie.js',
                            'app/controllers/system/echartsDemo/EchartsDemoController.js',
                            'app/services/system/echartsDemo/EchartsDemoService.js'
                        ]
                    });
                }]
            }
        })

        .state('ueditorDemo', {
            url: "/system/ueditorDemo/list.html",
            templateUrl: "views/system/ueditorDemo/list.html",
            data: {
                pageTitle: "ueditor",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "ueditor示例"},
                ]
            },
            controller: "UEditorDemoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/UEditorDemo/UEditorDemoController.js',
                            'app/services/system/UEditorDemo/UEditorDemoService.js'
                        ]
                    });
                }]
            }
        })

        .state('mapDemo', {
            url: "/system/mapDemo/list.html",
            templateUrl: "views/system/mapDemo/list.html",
            data: {
                pageTitle: "mapDemo",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "map示例"},
                ]
            },
            controller: "MapDemoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/mapDemo/MapDemoController.js',
                            'app/services/system/mapDemo/MapDemoService.js'
                        ]
                    });
                }]
            }
        })

         .state('fullCalendarDemo', {
             url: "/system/fullCalendarDemo/list.html",
             templateUrl: "views/system/fullCalendarDemo/list.html",
             data: {
                 pageTitle: "fullCalendarDemo",
                 pageBar: [
                     {href: "", class: "fa fa-home", title: "主页"},
                     {href: "", class: "", title: "日期日程"},
                 ]
             },
             controller: "FullCalendarDemoController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                             'app/controllers/system/fullCalendarDemo/FullCalendarDemoController.js',
                             'app/services/system/fullCalendarDemo/FullCalendarDemoService.js',
                             'bower_components/fullcalendarCustom/dist/fullcalendar.css',
                             'bower_components/fullcalendarCustom/dist/fullcalendar.print.css',
                             'bower_components/fullcalendarCustom/dist/fullcalendar.js'
                         ]
                     });
                 }]
             }
         })

        .state('angularFullCalendar', {
            url: "/system/angularFullCalendarDemo/list.html",
            templateUrl: "views/system/angularFullCalendarDemo/list.html",
            data: {
                pageTitle: "angularFullCalendarDemo",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "日期日程angular-ui"},
                ]
            },
            controller: "AngularFullCalendarDemoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/angularFullCalendarDemo/AngularFullCalendarDemoController.js',
                            'app/services/system/angularFullCalendarDemo/AngularFullCalendarDemoService.js'
                        ]
                    });
                }]
            }
        })

        .state('jsPlumbDemo', {
            url: "/system/jsPlumbDemo/list.html",
            templateUrl: "views/system/jsPlumbDemo/list.html",
            data: {
                pageTitle: "jsPlumbDemo",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "流程图示例"},
                ]
            },
            controller: "JsPlumbDemoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/system/jsPlumbDemo/JsPlumbDemoController.js',
                            'app/services/system/jsPlumbDemo/JsPlumbDemoService.js',
                            'bower_components/jsPlumb/dist/js/jsPlumb-2.1.4.js',
                            'bower_components/jQuery-contextMenu/dist/jquery.contextMenu.min.js',
                            'bower_components/jQuery-contextMenu/dist/jquery.contextMenu.min.css',
                            'assets/pages/css/jsPlumb.css'
                        ]
                    });
                }]
            }
        })

        .state('D3Demo', {
            url: "/system/D3Demo/list.html",
            templateUrl: "views/system/D3Demo/list.html",
            data: {
                pageTitle: "D3Demo",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "D3示例"}
                ]
            },
            controller: "D3DemoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'bower_components/d3/d3.js',
                            'app/controllers/system/D3Demo/D3DemoController.js',
                            'app/services/system/D3Demo/D3DemoService.js'
                        ]
                    });
                }]
            }
        })
        .state('test', {
            url: "/root/test/list.html",
            templateUrl: "views/root/test/list.html",
            data: {
                pageTitle: "test",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "test"}
                ]
            },
            controller: "testController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/BaseController.js',
                            'app/controllers/test/testController.js',
                            'app/services/test/testParentService.js',
                            'app/services/test/testService.js',
                            'app/directives/ngTable/directive.js'
                        ]
                    });
                }]
            }
        })

        .state('testEdit', {
            url: "/root/test/edit.html",
            templateUrl: "views/root/test/edit.html",
            data: {
                pageTitle: "test",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "test"}
                ]
            },
            controller: "testEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/BaseController.js',
                            'app/controllers/test/testController.js',
                            'app/services/test/testParentService.js',
                            'app/services/test/testService.js',
                            'app/directives/ngTable/directive.js'
                        ]
                    });
                }]
            }
        })
        .state('testView', {
        url: "/root/test/view.html",
        templateUrl: "views/root/test/view.html",
        data: {
            pageTitle: "test",
            pageBar: [
                {href: "", class: "fa fa-home", title: "主页"},
                {href: "", class: "", title: "test"}
            ]
        },
        controller: "testEditController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'app/controllers/BaseController.js',
                        'app/controllers/test/testController.js',
                        'app/services/test/testParentService.js',
                        'app/services/test/testService.js',
                        'app/directives/ngTable/directive.js'
                    ]
                });
            }]
        }
    })
        .state('roleListDemo', {
            url: "/root/roles/list.html",
            templateUrl: "views/root/roles/list.html",
            data: {
                pageTitle: "角色管理",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "test"}
                ]
            },
            controller: "RoleListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/BaseController.js',
                            'app/controllers/role/RoleController.js',
                            'app/services/test/testParentService.js',
                            'app/services/role/RoleService.js',
                            'app/directives/ngTable/directive.js'
                        ]
                    });
                }]
            }
        })
        .state('roleEditDemo', {
            url: "/root/roles/edit.html",
            templateUrl: "views/root/roles/edit.html",
            data: {
                pageTitle: "角色管理-新增",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "test"}
                ]
            },
            controller: "RoleEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/BaseController.js',
                            'app/controllers/role/RoleController.js',
                            'app/services/test/testParentService.js',
                            'app/services/role/RoleService.js',
                            'app/directives/ngTable/directive.js'
                        ]
                    });
                }]
            }
        })
        .state('roleViewDemo', {
            url: "/root/roles/view.html",
            templateUrl: "views/root/roles/view.html",
            data: {
                pageTitle: "角色管理-查看",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "test"}
                ]
            },
            controller: "RoleEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/BaseController.js',
                            'app/controllers/role/RoleController.js',
                            'app/services/test/testParentService.js',
                            'app/services/role/RoleService.js',
                            'app/directives/ngTable/directive.js'
                        ]
                    });
                }]
            }
        })
        .state('menuListDemo', {
            url: "/root/menu/list.html",
            templateUrl: "views/root/menu/list.html",
            data: {
                pageTitle: "菜单管理",
                pageBar: [
                    {href: "", class: "fa fa-home", title: "主页"},
                    {href: "", class: "", title: "test"}
                ]
            },
            controller: "MenuListController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/BaseController.js',
                            'app/controllers/menu/MenuController.js',
                            'app/services/test/testParentService.js',
                            'app/services/menu/MenuService.js',
                            'app/directives/ngTable/directive.js'
                        ]
                    });
                }]
            }
        })

        .state('cinemaSignUpAudit', {
            url: "/reimbursement/currency/list.html",
            templateUrl: "/views/reimbursement/currency/list.html",
            data: {pageTitle: "影院注册审核"},
            controller: "CinemaSignUpAuditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'app/filters/common/filters.js',
                            'app/directives/ngTable/directive.js',
                            'app/controllers/reimbursement/currency/CinemaSignUpAuditController.js',
                            'app/services/reimbursement/currency/CinemaSignUpAuditService.js'
                        ]
                    });
                }]
            }
        })

        .state('cinemaSignUpAuditCreate', {
            url: "/reimbursement/currency/create.html",
            templateUrl: "/views/reimbursement/currency/create.html",
            data: {pageTitle: "影院注册审核-新增"},
            controller: "CinemaSignUpAuditCreateController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'app/filters/common/filters.js',
                            'app/directives/ngTable/directive.js',
                            'app/controllers/reimbursement/currency/CinemaSignUpAuditController.js',
                            'app/services/reimbursement/currency/CinemaSignUpAuditService.js'
                        ]
                    });
                }]
            }
        })

        .state('cinemaSignUpAuditCheck', {
            url: "/reimbursement/currency/view.html",
            templateUrl: "/views/reimbursement/currency/view.html",
            data: {pageTitle: "影院注册审核-查看"},
            controller: "CinemaSignUpAuditCheckController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'app/filters/common/filters.js',
                            'app/directives/ngTable/directive.js',
                            'app/controllers/reimbursement/currency/CinemaSignUpAuditController.js',
                            'app/services/reimbursement/currency/CinemaSignUpAuditService.js'
                        ]
                    });
                }]
            }
        })

}]);