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
angular.module("app").controller("YearController", ['$uibModal', 'appSettings', 'budgetService', 'yearService',
    function ($uibModal, appSettings, budgetService, yearService) {
        
    var vm = this;
    
    vm.transYears = [];
    vm.budget = {};
    vm.budgeted = [];
    vm.budgetDifference = [];
    vm.currentRemaining;
    vm.budgetTotal;
    
    vm.accounts = appSettings.accounts;
    vm.categories = appSettings.categories;
    vm.accountSettings = appSettings.accountSettings;
    var transStartDate = new Date(Date.parse(appSettings.transMinDate));
    var transStartYear = transStartDate.getFullYear();
    var transEndDate = new Date(Date.parse(appSettings.transMaxDate));
    var transEndYear = transEndDate.getFullYear();
    while (transStartYear <= transEndYear) {
        vm.transYears.push(transStartYear);
        transStartYear += 1;
    }
    var currentDate = new Date();
    vm.selectedYear = currentDate.getFullYear();
    
    vm.months = [
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
    vm.selectedYear = currentDate.getFullYear();
    
    for (var i = 0; i < vm.months.length; i++) {
        if (vm.months[i].val === (currentDate.getMonth() +1)) {
            vm.selectedMonth = vm.months[i];
            break;
        }
    }
    
    vm.budgetMonth = function() {
        vm.currentRemaining = 0;
        vm.budgetDifference = [];
        for (var i = 0; i < vm.budgeted.length; i++) {
            var difference = 0;
            for (var j = 0; j < vm.yearlyTransactions.length; j++){
                if (vm.yearlyTransactions[j].monthId === vm.selectedMonth.val) {
                    for (var k = 0; k < vm.yearlyTransactions[j].categories.length; k++){
                        if (vm.yearlyTransactions[j].categories[k].uid === vm.budgeted[i].catid) {
                            difference = vm.budgeted[i].budgeted - vm.yearlyTransactions[j].categories[k].amount;
                            break;
                        }
                    }
                    break;
                }
            }
            vm.budgetDifference.push({
                catid: vm.budgeted[i].catid,
                difference: difference
            });
            vm.currentRemaining += difference;
        }
    };
    
    vm.monthlyTotal = function(currentMonth) {
        var total = 0;
        if (vm.yearlyTransactions !== undefined) {
            for (var i = 0; i < vm.yearlyTransactions.length; i++){
                if (vm.yearlyTransactions[i].monthId === currentMonth) {
                    for (var j = 0; j < vm.yearlyTransactions[i].categories.length; j++){
                        if (vm.yearlyTransactions[i].categories[j].extra === false) {
                            total += vm.yearlyTransactions[i].categories[j].amount;
                        }
                    }
                    break;
                }
            }
        }
        return total;
    };
    
    vm.budgetTotalCalc = function() {
        var total = 0;
        if (vm.budget !== undefined && vm.categories !== undefined) {
            for (var i = 0; i < vm.budget.budgetCategory.length; i++){
                for (var j = 0; j < vm.categories.length; j++) {
                    if (vm.categories[j].uid === vm.budget.budgetCategory[i].categoryId) {
                        if (vm.categories[j].extra === false) {
                            total += vm.budget.budgetCategory[i].amount;
                        }
                        break;
                    }
                }
            }
        }
        vm.budgetTotal = total;
    };
    
    vm.loadYear = function() {
        yearService.getYear(vm.selectedYear).then(function (result) {
            vm.yearlyTransactions = result.data;
            vm.loadBudget();
        }, function (result) {
            alert("There was a problem getting the data: "+result.data);
        });
    };
    
    vm.loadBudget = function() {
        budgetService.getBudget(vm.selectedYear).then(function (result) {
            vm.budget = result.data;
            vm.budgeted = [];
            for (var i = 0; i < vm.budget.budgetCategory.length; i++){
                vm.budgeted.push({
                    catid: vm.budget.budgetCategory[i].categoryId,
                    budgeted: vm.budget.budgetCategory[i].amount
                });
            }
            vm.budgetMonth();
            vm.budgetTotalCalc();
        }, function (result) {
            alert("There was a problem getting transactions: "+result.data);
        });
    };
    
    vm.loadYear();

}]);