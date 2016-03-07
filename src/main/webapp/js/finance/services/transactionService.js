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

angular.module('app').service('transactionService', ['$http', function($http) {
    
    this.getTransactions = function(startDate, endDate) {
        return $http.get('webapi/transactions?startdate='+startDate+'&enddate='+endDate)
    };
    
    this.getExtraTransactions = function(startDate, endDate) {
        return $http.get('webapi/transactions/extra?startdate='+startDate+'&enddate='+endDate)
    };
    
    this.addTransaction = function(transaction) {
        return $http.post('webapi/transactions', transaction)
    };
    
    this.saveTransaction = function(transaction) {
        return $http.put('webapi/transactions', transaction);
    };
    
    this.splitTransaction = function(transactions) {
        return $http.put('webapi/transactions/split', transactions);
    };
    
    
}]);