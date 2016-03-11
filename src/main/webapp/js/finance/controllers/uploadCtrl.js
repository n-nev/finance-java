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

angular.module('app').controller('UploadController', ['$scope', '$http', 'ngToast', 'appSettings',
    function($scope, $http, ngToast, appSettings){
    
    $scope.accounts = appSettings.accounts;
    $scope.categories = appSettings.categories;
    for (var i = 0; i < $scope.categories.length; i++) {
        if ($scope.categories[i].extra === true) {
            $scope.defaultCategory = $scope.categories[i];
            break;
        }
    }
    $scope.accountSettings = appSettings.accountSettings;
    
    $scope.transactions = [];
    $scope.parsed = false;
    
    $scope.save = function(){
        $http.post('webapi/transactions', $scope.transactions
            ).then(function (result) {
                ngToast.success({
                    content: 'Transactions saved'
                });
                $scope.transactions = [];
                $scope.parsed = false;
            }, function (result) {
                ngToast.danger({
                    content: 'There was a problem saving the records: ' + result.data
                });
            });
    };
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ",",
            comments: '<!--',
            complete: function(results) {
                $scope.transactions = [];
                $scope.selectedAccount = 0;
                // figure out what account this is
                var found = false;
                loop1:
                for (var j = 0; j < $scope.accountSettings.length; j++) {
                    var fileHeader = $scope.accountSettings[j].fileHeader.split(',');
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
                        for (var m = 0; m < $scope.accounts.length; m++) {
                            if ($scope.accountSettings[j].accountId === $scope.accounts[m].uid) {
                                $scope.selectedAccount = $scope.accounts[m];
                                break loop3;
                            }
                        }
                        break loop1;
                    }
                }
                
                switch($scope.selectedAccount.uid) {
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
                            $scope.transactions.push({
                                effdate: transDate,
                                transdate: transDate,
                                // TODO: parse actual trans date from description
                                postdate: transDate,
                                amount: amount,
                                vendor: results.data[i]['Description'],
                                description: null,
                                account: $scope.selectedAccount,
                                category: $scope.defaultCategory,
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

                            $scope.transactions.push({
                                effdate: transDate,
                                transdate: transDate,
                                postdate: postDate,
                                amount: amt,
                                vendor: results.data[i]['Description'],
                                description: null,
                                account: $scope.selectedAccount,
                                category: $scope.defaultCategory,
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
                                
                                $scope.transactions.push({
                                    effdate: transDate,
                                    transdate: transDate,
                                    postdate: postDate,
                                    amount: amt.toFixed(2),
                                    vendor: results.data[i]['Description'],
                                    description: null,
                                    account: $scope.selectedAccount,
                                    category: $scope.defaultCategory,
                                    deleted: false,
                                    split: false
                                });
                            }
                        }
                        break;
                }
                $http.post('webapi/transactions/check', $scope.transactions
                    ).then(function (result) {
                        $scope.transactions = result.data;
                        if ($scope.transactions.length) {
                            $scope.parsed = true;
                            for (var i = 0; i < $scope.transactions.length; i++)
                            {
                                $scope.transactions[i].category = $scope.defaultCategory;
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
