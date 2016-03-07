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

angular.module("app").controller('EditTransaction', ['$scope', '$uibModal', '$modalInstance', 'transaction', 'categories', 'ngToast', 'transactionService', 
    function ($scope, $uibModal, $modalInstance, transaction, categories, ngToast, transactionService) {
    
    $scope.transaction = transaction;
    $scope.categories = categories;
    
    // calendar options
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    
    $scope.popup1 = {
        opened: false
    };
    
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };
    
    $scope.format = 'M/d/yyyy';
    
    // end calendar options
    
    $scope.init = function() {
        angular.forEach($scope.categories, function (item){
            if (item.uid === $scope.transaction.category.uid) {
                $scope.transaction.category = item;
            }
        });
    }

    $scope.save = function () {
        transactionService.saveTransaction(transaction).then(
            function (response) {
                ngToast.success({
                    content: 'Transaction saved'
                });
                $modalInstance.close(response.data);
            }, (function (response) {
                ngToast.danger({
                    content: 'There was a problem saving the transaction: ' + response.data
                });
            }
        ));
    };
    
    $scope.split = function (transaction) {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modal-split-transaction.html',
            controller: 'SplitTransaction',
            size: 'md',
            resolve: {
                transaction: function () {
                    return angular.copy($scope.transaction);
                },
                categories: function () {
                    return $scope.categories;
                }
            }
        });
        modalInstance.result.then(function (transactions) {
            // modal closed
            $modalInstance.close(transactions);
            
        });
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);
