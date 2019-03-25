/**
 * Created by caoRN on 2016/11/22.
 * D3DemoController d3.v3
 */
angular.module('MetronicApp').controller('D3DemoController',
    ['$rootScope', '$scope', '$location', 'toastr', '$uibModal', 'D3DemoService',
        function ($rootScope, $scope, $location, toastr, $uibModal, D3DemoService) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            //创建Topology对象
            $scope.Topology = function (ele) {
                typeof(ele) == 'string' && (ele = document.getElementById(ele));
                var w = ele.clientWidth,
                    h = ele.clientHeight,
                    self = this;
                this.force = d3.layout.force().gravity(.05).distance(200).charge(-800).size([w, h]);
                this.nodes = this.force.nodes();
                this.links = this.force.links();
                this.clickFn = function () {
                };
                this.clickLn = function () {
                };
                this.vis = d3.select(ele).append("svg:svg")
                    .attr("width", w).attr("height", h).attr("pointer-events", "all");

                this.force.on("tick", function (x) {
                    self.vis.selectAll("g.node")
                        .attr("transform", function (d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    self.vis.selectAll("line.link")
                        .attr("x1", function (d) {
                            return d.source.x;
                        })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });
                });
            };

            //动画效果
            $scope.Topology.prototype.doZoom = function () {
                d3.select(this).select('g').attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
            };

            //增加节点
            $scope.Topology.prototype.addNode = function (node) {
                this.nodes.push(node);
            };

            $scope.Topology.prototype.addNodes = function (nodes) {
                if (Object.prototype.toString.call(nodes) == '[object Array]') {
                    var self = this;
                    nodes.forEach(function (node) {
                        self.addNode(node);
                    });
                }
            };

            //增加连线
            $scope.Topology.prototype.addLink = function (source, target) {
                this.links.push({source: this.findNode(source), target: this.findNode(target)});
            };

            //增加多个连线
            $scope.Topology.prototype.addLinks = function (links) {
                if (Object.prototype.toString.call(links) == '[object Array]') {
                    var self = this;
                    links.forEach(function (link) {
                        self.addLink(link['source'], link['target']);
                    });
                }
            };

            //删除节点
            $scope.Topology.prototype.removeNode = function (id) {
                var i = 0,
                    n = this.findNode(id),
                    links = this.links;
                while (i < links.length) {
                    links[i]['source'] == n || links[i]['target'] == n ? links.splice(i, 1) : ++i;
                }
                this.nodes.splice(this.findNodeIndex(id), 1);
            };

            //传入当前节点id，删除该节点下的子节点，同时清除link信息
            $scope.Topology.prototype.removeChildNodes = function (id) {
                var node = this.findNode(id),
                    nodes = this.nodes;
                links = this.links;
                self = this;

                var linksToDelete = [],
                    childNodes = [];

                links.forEach(function (link, index) {
                    link['source'] == node
                    && linksToDelete.push(index)
                    && childNodes.push(link['target']);
                });

                linksToDelete.reverse().forEach(function (index) {
                    links.splice(index, 1);
                });

                var remove = function (node) {
                    var length = links.length;
                    for (var i = length - 1; i >= 0; i--) {
                        if (links[i]['source'] == node) {
                            var target = links[i]['target'];
                            links.splice(i, 1);
                            nodes.splice(self.findNodeIndex(node.id), 1);
                            remove(target);

                        }
                    }
                };

                childNodes.forEach(function (node) {
                    remove(node);
                });

                //清除没有连线的节点
                for (var i = nodes.length - 1; i >= 0; i--) {
                    var haveFoundNode = false;
                    for (var j = 0, l = links.length; j < l; j++) {
                        ( links[j]['source'] == nodes[i] || links[j]['target'] == nodes[i] ) && (haveFoundNode = true)
                    }
                    !haveFoundNode && nodes.splice(i, 1);
                }
            };

            //查找节点
            $scope.Topology.prototype.findNode = function (id) {
                var nodes = this.nodes;
                for (var i in nodes) {
                    if (nodes[i]['id'] == id) return nodes[i];
                }
                return null;
            };

            //查找节点所在索引号
            $scope.Topology.prototype.findNodeIndex = function (id) {
                var nodes = this.nodes;
                for (var i in nodes) {
                    if (nodes[i]['id'] == id) return i;
                }
                return -1;
            };

            //节点点击事件
            $scope.Topology.prototype.setNodeClickFn = function (callback) {
                this.clickFn = callback;
            };

            //线上点击事件
            $scope.Topology.prototype.setLinkClickLn = function (callback) {
                this.clickLn = callback;
            };

            //更新拓扑图状态信息
            $scope.Topology.prototype.update = function () {
                var link = this.vis.selectAll("line.link")
                    .data(this.links, function (d) {
                        return d.source.id + "-" + d.target.id;
                    })
                    .attr("class", function (d) {
                        return d['source']['status'] && d['target']['status'] ? 'link' : 'link link_error';
                    });

                link.enter().insert("svg:line", "g.node")
                    .attr("class", function (d) {
                        return d['source']['status'] && d['target']['status'] ? 'link' : 'link link_error';
                    }).on('click', function (d) {
                    self.clickLn(d);
                });
                ;

                link.exit().remove();

                var node = this.vis.selectAll("g.node")
                    .data(this.nodes, function (d) {
                        return d.id;
                    });

                var nodeEnter = node.enter().append("svg:g")
                    .attr("class", "node")
                    .call(this.force.drag);

                //增加图片，可以根据需要来修改
                var self = this;
                nodeEnter.append("svg:image")
                    .attr("class", "circle")
                    .attr("xlink:href", function (d) {
                        //根据类型来使用图片
                        if ('net' == d.type) {
                            return "assets/pages/img/D3/net.png";
                        } else if ('router' == d.type) {
                            return "assets/pages/img/D3/router.png";
                        } else if ('server' == d.type) {
                            return "assets/pages/img/D3/server.png";
                        }
                    })
                    .attr("x", "-32px")
                    .attr("y", "-32px")
                    .attr("width", "64px")
                    .attr("height", "64px")
                    .on('click', function (d) {
                        self.clickFn(d);
                    });

                nodeEnter.append("svg:text")
                    .attr("class", "nodetext")
                    .attr("dx", 15)
                    .attr("dy", -35)
                    .text(function (d) {
                        return d.id
                    });

                node.exit().remove();

                this.force.start();
            };

            //实例化一个topology对象
            $scope.topology = new $scope.Topology('containerD3');

            //单机元素事件调用
            $scope.topology.setNodeClickFn(function (node) {
                console.log(node)
            });

            //线上单机事件
            $scope.topology.setLinkClickLn(function (link) {
                console.log(link)
            });

            // 数据源
            D3DemoService.getD3DemoData().$promise.then(function (result) {
                if ('success' == result.status) {
                    $scope.links = result.data.router;
                    $scope.nodes = result.data.task;
                    $scope.topology.addNodes($scope.nodes);
                    $scope.topology.addLinks($scope.links);
                    $scope.topology.update();//增删改查必须调用的函数，否则数据不会加载到页面
                }
            })
        }]);