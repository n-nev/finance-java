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

angular.module("app").controller("BudgetController", ['$uibModal', 'ngToast', 'appSettings', 'budgetService', 
    function ($uibModal, ngToast, appSettings, budgetService) {
        
    var vm = this;

    vm.categories = appSettings.categories;
    vm.accountSettings = appSettings.accountSettings;
    var transStartDate = new Date(Date.parse(appSettings.transMinDate));
    var transStartYear = transStartDate.getFullYear();
    var transEndDate = new Date(Date.parse(appSettings.transMaxDate));
    var transEndYear = transEndDate.getFullYear();
    vm.transYears = [];
    while (transStartYear <= transEndYear) {
        vm.transYears.push(transStartYear);
        transStartYear += 1;
    }
    var currentDate = new Date();
    vm.selectedYear = currentDate.getFullYear();

    vm.loadBudget = function() {
        budgetService.getBudget(vm.selectedYear).then(function (result) {
            vm.budget = result.data;
            vm.model = [];
            var amount;
            angular.forEach(vm.categories, function(value) {
                if (!value.extra) {
                    amount = 0;
                    for(var i = 0; i < result.data.budgetCategory.length; i++) {
                        if (result.data.budgetCategory[i].categoryId === value.uid) {
                            amount = result.data.budgetCategory[i].amount;
                            break;
                        }
                    }
                    vm.model.push({
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
    
    vm.loadBudget();
    
    vm.save = function() {
        var found;
        angular.forEach(vm.model, function(value) {
            found = false;
            for(var i = 0; i < vm.budget.budgetCategory.length; i++) {
                if (vm.budget.budgetCategory[i].categoryId === value.uid) {
                    vm.budget.budgetCategory[i].amount = value.amount;
                    found = true;
                    break;
                }
            }
            if (!found) {
                vm.budget.budgetCategory.push({
                    "amount": value.amount,
                    "budgetId": vm.budget.uid,
                    "categoryId": value.uid
                });
            }
        });
        
        budgetService.saveBudget(vm.budget.budgetCategory).then(function (result) {
            ngToast.success({
                content: 'Budget saved'
            });
        }, function (result) {
            alert("There was a problem saving the budget: "+result.data);
        });
        
    };

}]);

