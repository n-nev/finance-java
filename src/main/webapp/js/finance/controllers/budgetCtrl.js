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

angular.module("app").controller("BudgetController", ['$scope', '$uibModal', 'ngToast', 'appSettings', 'budgetService', 
    function ($scope, $uibModal, ngToast, appSettings, budgetService) {

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

    $scope.loadBudget = function() {
        budgetService.getBudget($scope.selectedYear).then(function (result) {
            $scope.budget = result.data;
            $scope.model = [];
            var amount;
            angular.forEach($scope.categories, function(value) {
                if (!value.extra) {
                    amount = 0;
                    for(var i = 0; i < result.data.budgetCategory.length; i++) {
                        if (result.data.budgetCategory[i].categoryId === value.uid) {
                            amount = result.data.budgetCategory[i].amount;
                            break;
                        }
                    }
                    $scope.model.push({
                        name: value.name,
                        uid: value.uid,
                        amount: amount
                    });
                }
            });
        }, function (result) {
            alert("There was a problem getting transactions: "+result.data);
        });
    };
    
    $scope.loadBudget();
    
    $scope.save = function() {
        var found;
        angular.forEach($scope.model, function(value) {
            found = false;
            for(var i = 0; i < $scope.budget.budgetCategory.length; i++) {
                if ($scope.budget.budgetCategory[i].categoryId === value.uid) {
                    $scope.budget.budgetCategory[i].amount = value.amount;
                    found = true;
                    break;
                }
            }
            if (!found) {
                $scope.budget.budgetCategory.push({
                    "amount": value.amount,
                    "budgetId": $scope.budget.uid,
                    "categoryId": value.uid
                });
            }
        });
        
        budgetService.saveBudget($scope.budget.budgetCategory).then(function (result) {
            ngToast.success({
                content: 'Budget saved'
            });
        }, function (result) {
            alert("There was a problem saving the budget: "+result.data);
        });
        
    };

}]);

