define([
	'angular',
	'controllers',
	'translate',
	'formatterService',
	'messageService'
], function(angular, controllers) {
    controllers.controller("subscriberSubscriptionsCtrl", ["$scope", "$filter", "$translate", "$state", 
                           "$subscriber", "ngTableParams", "$formatter", "$confirm", "$message", "$securitySession",
	    function ($scope, $filter, $translate, $state, $subscriber, ngTableParams, 
	    		$formatter, $confirm, $message, $securitySession) {

            var tableData;
            
            $scope.adminWriter = $securitySession.permissions.adminWriter();

            $scope.data = {
                list: [],
                selected: "",
                loading: true
            };

            $scope.filter = {
                searchQuery: "",
                fields: ["name", "subscriptionDate"]
            };

            $scope.getSubscriberSubscriptions = function(){
                $subscriber.subscriberSubscriptions(function(data){
                    renderGrid(data);
                });
            };

            var renderGrid = function(data){
                tableData = data;
                if ($scope.tableParams) {
                    $scope.tableParams.reload();
                } else {
                    $scope.tableParams = new ngTableParams({
                        page: 1,
                        count: 10,
                        sorting: {
                            name: "asc"
                        }
                    }, {
                        total: tableData.length,
                        getData: function($defer, params) {
                            var sliceStart = (params.page() - 1) * params.count();
                            var sliceEnd = params.page() * params.count();
                            var filteredData = params.filter() ? $filter('filterByFields')(tableData, $scope.filter.fields, $scope.filter.searchQuery) : tableData;
                            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                            params.total(tableData.length);
                            $defer.resolve(orderedData.slice(sliceStart, sliceEnd));
                        }
                    });
                }
            };

            $scope.deleteSubscription = function(item){
                $translate([
                    'confirms.deleteSubscription',
                    'messages.success.itemDeleted'
                ], {
                    name: item.login,
                }).then(function (str) {
                    $confirm(str['confirms.deleteSubscription'], function(){
                        $subscriber.deleteSubscription({
                            id: item.id
                        }, function(){
                            $message("success", str["messages.success.itemDeleted"]);
                            $scope.getSubscriberSubscriptions();
                        }, function (error) {
                            $message("error", $formatter.error(error.data));
                        });
                    });
                });
            };

            $scope.$on('refreshTab', function() {
                $scope.getSubscriberSubscriptions();
            });

            $translate(
                [
                    'table.headers.subscriber',
                    'table.headers.subscriptionDate'
                ]
            ).then(function (data) {
                $scope.tableHeaders = {
                    subscriber: data["table.headers.subscriber"],
                    date: data["table.headers.subscriptionDate"]
                };
                $scope.getSubscriberSubscriptions();
            });

	    }
	])
});