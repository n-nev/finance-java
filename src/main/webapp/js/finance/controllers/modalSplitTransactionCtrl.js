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
    
    $scope.transaction = transaction;
    $scope.transaction.deleted = true;
    $scope.categories = categories;
    $scope.model = {};
    $scope.model.taxes = false;
    $scope.model.taxAmount = 0;
    $scope.model.taxSplitAmount = 0;
    $scope.model.taxRates = [
        {
            label: '6.85%',
            rate: .0685
        }, {
            label: '3.00%',
            rate: .03
        }
    ];
    $scope.model.selectedTaxRate = $scope.model.taxRates[0];
    
    $scope.calculateTax = function() {
        if ($scope.model.taxAmount) {
            $scope.model.taxSplitAmount = ($scope.model.taxAmount / $scope.model.selectedTaxRate.rate) + $scope.model.taxAmount;
            $scope.splitTransactions[0].amount = $scope.model.taxSplitAmount;
            $scope.splitTransactions[1].amount = $scope.transaction.amount - $scope.model.taxSplitAmount;
        }
    }
    
    $scope.$watch('model.taxAmount', $scope.calculateTax);
    
    $scope.splitTransactions = [
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
    
    angular.forEach($scope.splitTransactions, function (item){
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].uid === item.category.uid) {
                item.category = $scope.categories[i];
                break;
            }
        }
    });

    $scope.ok = function () {
        var transactions = angular.copy($scope.splitTransactions);
        transactions.push($scope.transaction);
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
    
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);