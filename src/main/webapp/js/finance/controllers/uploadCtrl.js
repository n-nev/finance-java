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

angular.module('app').controller('UploadController', ['$scope', 'ngToast', 'appSettings', 'transactionService', 
    function($scope, ngToast, appSettings, transactionService){
        
    var vm = this;
    
    vm.myFile = null;
    $scope.$watch('vm.myFile', function() {
        if (vm.myFile)
        {
            vm.uploadFile();
        }
    });
    vm.accounts = appSettings.accounts;
    vm.categories = appSettings.categories;
    for (var i = 0; i < vm.categories.length; i++) {
        if (vm.categories[i].extra === true) {
            vm.defaultCategory = vm.categories[i];
            break;
        }
    }
    vm.accountSettings = appSettings.accountSettings;
    
    vm.transactions = [];
    vm.parsed = false;
    
    vm.save = function(){
        transactionService.addTransaction(vm.transactions).then(function (result) {
            ngToast.success({
                content: 'Transactions saved'
            });
            vm.transactions = [];
            vm.parsed = false;
        }, function (result) {
            ngToast.danger({
                content: 'There was a problem saving the records: ' + result.data
            });
        });
    };
    
    vm.uploadFile = function(){
        var file = vm.myFile;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ",",
            comments: '<!--',
            complete: function(results) {
                vm.transactions = [];
                vm.selectedAccount = 0;
                // figure out what account this is
                var found = false;
                loop1:
                for (var j = 0; j < vm.accountSettings.length; j++) {
                    var fileHeader = vm.accountSettings[j].fileHeader.split(',');
                    loop2:
                    for (var k = 0; k < fileHeader.length; k++) {
                        if (fileHeader[k] !== results.meta.fields[k].trim()) {
                            found = false;
                            break loop2;
                        } else {
                            found = true;
                        }
                    }
                    if (found === true) {
                        loop3:
                        for (var m = 0; m < vm.accounts.length; m++) {
                            if (vm.accountSettings[j].accountId === vm.accounts[m].uid) {
                                vm.selectedAccount = vm.accounts[m];
                                break loop3;
                            }
                        }
                        break loop1;
                    }
                }
                
                switch(vm.selectedAccount.uid) {
                    case 1:
                        for (var i = 0; i < results.data.length; i++) {
                            var dateArray = results.data[i]['Posted Date'].split('/');
                            var dateMonth = dateArray[0];
                            var dateDay = dateArray[1];
                            var dateYear = dateArray[2];
                            if (dateYear.length < 4) {
                                dateYear = '20'+dateYear;
                            }
                            var transDate = new Date(parseInt(dateYear),parseInt(dateMonth)-1,parseInt(dateDay));

                            // determine credit or debit
                            var amount = parseFloat(results.data[i]['Amount']).toFixed(2);
                            if (results.data[i]['CR/DR'] === 'CR') {
                                amount *= -1;
                            }
                            vm.transactions.push({
                                effdate: transDate,
                                transdate: transDate,
                                // TODO: parse actual trans date from description
                                postdate: transDate,
                                amount: amount,
                                vendor: results.data[i]['Description'],
                                description: null,
                                account: vm.selectedAccount,
                                category: vm.defaultCategory,
                                deleted: false,
                                split: false
                            });
                        }
                        break;
                    case 2:
                        for (var i = 0; i < results.data.length; i++) {
                            var amt = parseFloat(results.data[i]['Amount']).toFixed(2);
                            var dateArray;
                            if (results.data[i]['Trans. Date']) {
                                dateArray = results.data[i]['Trans. Date'].split('/');
                            } else {
                                dateArray = results.data[i]['\tTrans. Date'].split('/');
                            }

                            var dateMonth = dateArray[0];
                            var dateDay = dateArray[1];
                            var dateYear = dateArray[2];
                            if (dateYear.length < 4) {
                                dateYear = '20'+dateYear;
                            }
                            var transDate = new Date(parseInt(dateYear),parseInt(dateMonth)-1,parseInt(dateDay));

                            dateArray = results.data[i]['Post Date'].split('/');
                            dateMonth = dateArray[0];
                            dateDay = dateArray[1];
                            dateYear = dateArray[2];
                            if (dateYear.length < 4) {
                                dateYear = '20'+dateYear;
                            }
                            var postDate = new Date(parseInt(dateYear),parseInt(dateMonth)-1,parseInt(dateDay));

                            vm.transactions.push({
                                effdate: transDate,
                                transdate: transDate,
                                postdate: postDate,
                                amount: amt,
                                vendor: results.data[i]['Description'],
                                description: null,
                                account: vm.selectedAccount,
                                category: vm.defaultCategory,
                                deleted: false,
                                split: false
                            });
                        }
                        break;
                    case 3:
                        for (var i = 0; i < results.data.length; i++) {
                            if (results.data[i]['Type'] !== 'Payment') { // ignore credits

                                var dateArray = results.data[i]['Trans Date'].split('/');
                                var dateMonth = dateArray[0];
                                var dateDay = dateArray[1];
                                var dateYear = dateArray[2];
                                if (dateYear.length < 4) {
                                    dateYear = '20'+dateYear;
                                }
                                var transDate = new Date(parseInt(dateYear),parseInt(dateMonth)-1,parseInt(dateDay));
                                
                                dateArray = results.data[i]['Post Date'].split('/');
                                dateMonth = dateArray[0];
                                dateDay = dateArray[1];
                                dateYear = dateArray[2];
                                if (dateYear.length < 4) {
                                    dateYear = '20'+dateYear;
                                }
                                var postDate = new Date(parseInt(dateYear),parseInt(dateMonth)-1,parseInt(dateDay));
                                
                                var amt = parseFloat(results.data[i]['Amount']);
                                amt *= -1;
                                
                                vm.transactions.push({
                                    effdate: transDate,
                                    transdate: transDate,
                                    postdate: postDate,
                                    amount: amt.toFixed(2),
                                    vendor: results.data[i]['Description'],
                                    description: null,
                                    account: vm.selectedAccount,
                                    category: vm.defaultCategory,
                                    deleted: false,
                                    split: false
                                });
                            }
                        }
                        break;
                }
                transactionService.checkTransactions(vm.transactions).then(function (result) {
                    vm.transactions = result.data;
                    if (vm.transactions.length) {
                        vm.parsed = true;
                        for (var i = 0; i < vm.transactions.length; i++)
                        {
                            vm.transactions[i].category = vm.defaultCategory;
                        }
                    }
                    ngToast.success({
                        content: 'Transactions checked'
                    });

                }, function (result) {
                    ngToast.danger({
                        content: 'There was a problem checking the transactions: ' + result.data
                    });
                });
            }
        });
    };
    
}]);
