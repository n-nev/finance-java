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
angular.module("app").controller('NewTransaction', ['$scope', '$modalInstance', 'ngToast', 'appSettings', 'transactionService', 
    function ($scope, $modalInstance, ngToast, appSettings, transactionService) {
    
    $scope.transaction = {
        effdate: new Date()
    };

    $scope.accounts = appSettings.accounts;
    $scope.categories = appSettings.categories;
    $scope.accountSettings = appSettings.accountSettings;
    $scope.transaction.category = $scope.categories[0];
    $scope.transaction.account = $scope.accounts[0];
    
    $scope.save = function(){
        $scope.transaction.transdate = $scope.transaction.effdate;
        $scope.transaction.postdate = $scope.transaction.effdate;
        $scope.transaction.deleted = false;
        $scope.transaction.split = false;
        var transactions = [$scope.transaction];
        transactionService.addTransaction(transactions
            ).then(function (result) {
                ngToast.success({
                    content: 'Transaction saved'
                });
                $modalInstance.close($scope.transaction);
            }, function (result) {
                ngToast.danger({
                    content: 'Error saving transaction: ' + result.data
                });
            });
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    // calendar options
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    
    $scope.format = 'M/d/yyyy';
    
    $scope.popup1 = {
        opened: false
    };
    
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };
    // end calendar options
}]);

