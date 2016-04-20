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
angular.module("app").controller('NewTransaction', ['$modalInstance', 'ngToast', 'appSettings', 'transactionService', 
    function ($modalInstance, ngToast, appSettings, transactionService) {
        
    var vm = this;
    
    vm.transaction = {
        effdate: new Date()
    };

    vm.accounts = appSettings.accounts;
    vm.categories = appSettings.categories;
    vm.accountSettings = appSettings.accountSettings;
    vm.transaction.category = vm.categories[0];
    vm.transaction.account = vm.accounts[0];
    
    vm.save = function(){
        vm.transaction.transdate = vm.transaction.effdate;
        vm.transaction.postdate = vm.transaction.effdate;
        vm.transaction.deleted = false;
        vm.transaction.split = false;
        var transactions = [vm.transaction];
        transactionService.addTransaction(transactions
            ).then(function (result) {
                ngToast.success({
                    content: 'Transaction saved'
                });
                $modalInstance.close(vm.transaction);
            }, function (result) {
                ngToast.danger({
                    content: 'Error saving transaction: ' + result.data
                });
            });
    };
    
    vm.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    // calendar options
    vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 0
    };
    
    vm.format = 'M/d/yyyy';
    
    vm.popup1 = {
        opened: false
    };
    
    vm.open1 = function() {
        vm.popup1.opened = true;
    };
    // end calendar options
}]);

