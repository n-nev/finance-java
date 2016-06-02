/* 
 * The MIT License
 *
 * Copyright 2016 Nathan Neville.
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

angular.module("app").controller('SplitTransaction', ['$scope', '$modalInstance', 'transaction', 'categories', 'ngToast', 'transactionService',
    function ($scope, $modalInstance, transaction, categories, ngToast, transactionService) {
        
    var vm = this;
    
    vm.transaction = transaction;
    vm.transaction.deleted = true;
    vm.categories = categories;
    vm.model = {};
    
    vm.calculateDifference = function() {
        if (isNaN(vm.splitTransactions[0].amount)) {
            vm.splitTransactions[1].amount = vm.transaction.amount;
        } else {
            vm.splitTransactions[1].amount = (vm.transaction.amount - vm.splitTransactions[0].amount);
        }
    };
    
    vm.splitTransactions = [
        {
            "account": transaction.account,
            "amount": transaction.amount,
            "category": transaction.category,
            "deleted": false,
            "description": transaction.description,
            "effdate": transaction.effdate,
            "postdate": transaction.postdate,
            "splitId": transaction.uid,
            "transdate": transaction.transdate,
            "vendor": transaction.vendor
        },
        {
            "account": transaction.account,
            "amount": 0,
            "category": transaction.category,
            "deleted": false,
            "description": transaction.description,
            "effdate": transaction.effdate,
            "postdate": transaction.postdate,
            "splitId": transaction.uid,
            "transdate": transaction.transdate,
            "vendor": transaction.vendor
        }
    ];
    
    angular.forEach(vm.splitTransactions, function (item){
        for (var i = 0; i < vm.categories.length; i++) {
            if (vm.categories[i].uid === item.category.uid) {
                item.category = vm.categories[i];
                break;
            }
        }
    });
    
    $scope.$watch('vm.splitTransactions[0].amount', vm.calculateDifference);

    vm.save = function () {
        var transactions = angular.copy(vm.splitTransactions);
        transactions.push(vm.transaction);
        transactionService.splitTransaction(transactions).then(function (response) {
                ngToast.success({
                    content: 'Transaction saved'
                });
                $modalInstance.close(response.data);
            }, function (response) {
                ngToast.danger({
                    content: 'There was a problem saving the transactions: ' + response.data
                });
            });
    };
    
    vm.cancel = function () {
        $modalInstance.dismiss();
    };
}]);