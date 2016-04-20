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

angular.module("app").controller('EditTransaction', ['$uibModal', '$modalInstance', 'transaction', 'categories', 'ngToast', 'transactionService', 
    function ($uibModal, $modalInstance, transaction, categories, ngToast, transactionService) {
        
    var vm = this;
    
    vm.transaction = transaction;
    vm.categories = categories;
    
    // calendar options
    vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 0
    };
    
    vm.popup1 = {
        opened: false
    };
    
    vm.open1 = function() {
        vm.popup1.opened = true;
    };
    
    vm.format = 'M/d/yyyy';
    
    // end calendar options
    
    vm.init = function() {
        angular.forEach(vm.categories, function (item){
            if (item.uid === vm.transaction.category.uid) {
                vm.transaction.category = item;
            }
        });
    }

    vm.save = function () {
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
    
    vm.split = function (transaction) {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modal-split-transaction.html',
            controller: 'SplitTransaction',
            controllerAs: 'vm',
            size: 'md',
            resolve: {
                transaction: function () {
                    return angular.copy(vm.transaction);
                },
                categories: function () {
                    return vm.categories;
                }
            }
        });
        modalInstance.result.then(function (transactions) {
            // modal closed
            $modalInstance.close(transactions);
            
        });
    };
    
    vm.cancel = function () {
        $modalInstance.dismiss();
    };
}]);
