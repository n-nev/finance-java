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
angular.module("app").controller("YearController", ['$scope', '$uibModal', 'appSettings', 'budgetService', 'yearService',
    function ($scope, $uibModal, appSettings, budgetService, yearService) {
    
    $scope.transYears = [];
    $scope.budget = {};
    $scope.budgeted = [];
    $scope.budgetDifference = [];
    $scope.currentRemaining;
    $scope.budgetTotal;
    
    $scope.accounts = appSettings.accounts;
    $scope.categories = appSettings.categories;
    $scope.accountSettings = appSettings.accountSettings;
    var transStartDate = new Date(Date.parse(appSettings.transMinDate));
    var transStartYear = transStartDate.getFullYear();
    var transEndDate = new Date(Date.parse(appSettings.transMaxDate));
    var transEndYear = transEndDate.getFullYear();
    while (transStartYear <= transEndYear) {
        $scope.transYears.push(transStartYear);
        transStartYear += 1;
    }
    var currentDate = new Date();
    $scope.selectedYear = currentDate.getFullYear();
    
    $scope.months = [
        {key: "Jan", val: 1},
        {key: "Feb", val: 2},
        {key: "Mar", val: 3},
        {key: "Apr", val: 4},
        {key: "May", val: 5},
        {key: "Jun", val: 6},
        {key: "Jul", val: 7},
        {key: "Aug", val: 8},
        {key: "Sep", val: 9},
        {key: "Oct", val: 10},
        {key: "Nov", val: 11},
        {key: "Dec", val: 12}
    ];
    
    var currentDate = new Date();
    $scope.selectedYear = currentDate.getFullYear();
    
    for (var i = 0; i < $scope.months.length; i++) {
        if ($scope.months[i].val === (currentDate.getMonth() +1)) {
            $scope.selectedMonth = $scope.months[i];
            break;
        }
    }
    
    $scope.budgetMonth = function() {
        $scope.currentRemaining = 0;
        $scope.budgetDifference = [];
        for (var i = 0; i < $scope.budgeted.length; i++) {
            var difference = 0;
            for (var j = 0; j < $scope.yearlyTransactions.length; j++){
                if ($scope.yearlyTransactions[j].monthId === $scope.selectedMonth.val) {
                    for (var k = 0; k < $scope.yearlyTransactions[j].categories.length; k++){
                        if ($scope.yearlyTransactions[j].categories[k].uid === $scope.budgeted[i].catid) {
                            difference = $scope.budgeted[i].budgeted - $scope.yearlyTransactions[j].categories[k].amount;
                            break;
                        }
                    }
                    break;
                }
            }
            $scope.budgetDifference.push({
                catid: $scope.budgeted[i].catid,
                difference: difference
            });
            $scope.currentRemaining += difference;
        }
    };
    
    $scope.monthlyTotal = function(currentMonth) {
        var total = 0;
        if ($scope.yearlyTransactions !== undefined) {
            for (var i = 0; i < $scope.yearlyTransactions.length; i++){
                if ($scope.yearlyTransactions[i].monthId === currentMonth) {
                    for (var j = 0; j < $scope.yearlyTransactions[i].categories.length; j++){
                        if ($scope.yearlyTransactions[i].categories[j].extra === false) {
                            total += $scope.yearlyTransactions[i].categories[j].amount;
                        }
                    }
                    break;
                }
            }
        }
        return total;
    };
    
    $scope.budgetTotalCalc = function() {
        var total = 0;
        if ($scope.budget !== undefined && $scope.categories !== undefined) {
            for (var i = 0; i < $scope.budget.budgetCategory.length; i++){
                for (var j = 0; j < $scope.categories.length; j++) {
                    if ($scope.categories[j].uid === $scope.budget.budgetCategory[i].categoryId) {
                        if ($scope.categories[j].extra === false) {
                            total += $scope.budget.budgetCategory[i].amount;
                        }
                        break;
                    }
                }
            }
        }
        $scope.budgetTotal = total;
    };
    
    $scope.loadYear = function() {
        yearService.getYear($scope.selectedYear).then(function (result) {
            $scope.yearlyTransactions = result.data;
            $scope.loadBudget();
        }, function (result) {
            alert("There was a problem getting the data: "+result.data);
        });
    };
    
    $scope.loadBudget = function() {
        budgetService.getBudget($scope.selectedYear).then(function (result) {
            $scope.budget = result.data;
            $scope.budgeted = [];
            for (var i = 0; i < $scope.budget.budgetCategory.length; i++){
                $scope.budgeted.push({
                    catid: $scope.budget.budgetCategory[i].categoryId,
                    budgeted: $scope.budget.budgetCategory[i].amount
                });
            }
            $scope.budgetMonth();
            $scope.budgetTotalCalc();
        }, function (result) {
            alert("There was a problem getting transactions: "+result.data);
        });
    };
    
    $scope.loadYear();

}]);