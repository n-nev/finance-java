/* 
 * The MIT License
 *
 * Copyright 2015 Nathan Neville.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

angular.module("app").controller("MiscController", ['$scope', '$http', '$uibModal', 'appSettings', 'transactionService', 
    function ($scope, $http, $uibModal, appSettings, transactionService) {
    
    $scope.accounts = appSettings.accounts;
    $scope.categories = appSettings.categories;
    $scope.accountSettings = appSettings.accountSettings;
    var transStartDate = new Date(Date.parse(appSettings.transMinDate));
    var transStartYear = transStartDate.getFullYear();
    var transEndDate = new Date(Date.parse(appSettings.transMaxDate));
    var transEndYear = transEndDate.getFullYear();
    $scope.transYears = [];
    while (transStartYear <= transEndYear) {
        $scope.transYears.push(transStartYear);
        transStartYear += 1;
    }
    var currentDate = new Date();
    $scope.selectedYear = currentDate.getFullYear();

    $scope.loadTransactions = function() {
        var startDate = new Date($scope.selectedYear, 0, 1).toISOString().slice(0,10);
        var endDate = new Date($scope.selectedYear, 11, 31).toISOString().slice(0,10);
        transactionService.getExtraTransactions(startDate, endDate).then(function (result) {
            $scope.transactions = result.data;
        }, function (result) {
            alert("There was a problem getting transactions: "+result.data);
        });
    };
    
    $scope.loadTransactions();
    
    $scope.getTotal = function(categoryid) {
        var sum = 0;
        angular.forEach($scope.transactions, function(value) {
            if (value.category.uid === categoryid) {
                sum += value.amount;
            }
        });
        return sum;
    };
    
    $scope.editTransaction = function (transaction) {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modal-edit-transaction.html',
            controller: 'EditTransaction',
            size: 'md',
            resolve: {
                transaction: function () {
                    return angular.copy(transaction);
                },
                categories: function () {
                    return $scope.categories;
                }
            }
        });
        modalInstance.result.then(function (transactions) {
            if (angular.isArray(transactions)) {
                // array is result from split
                if ($scope.transactions) {
                    var found;
                    for(var i = 0; i < transactions.length; i++) {
                        found = false;
                        for (var j = 0; j < $scope.transactions.length; j++) {
                            if ($scope.transactions[j].uid === transactions[i].uid) {
                                $scope.transactions[j] = transactions[i];
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            $scope.transactions.push(transactions[i]);
                        }
                    }
                }
            } else {
                // non-array is result from edit
                if ($scope.transactions) {
                    for (var j = 0; j < $scope.transactions.length; j++) {
                        if ($scope.transactions[j].uid === transactions.uid) {
                            $scope.transactions[j] = transactions;
                            break;
                        }
                    }
                }
            }
        });
    };

}]);