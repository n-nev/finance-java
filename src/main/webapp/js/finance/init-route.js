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
angular.module('app', ['ngRoute', 'ui.bootstrap', 'ngToast', 'ngSanitize', 'dndLists', 'ng-currency'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/year', {
                templateUrl: 'templates/year.html',
                controller: 'YearController',
                controllerAs: 'vm'
            })
            .when('/month', {
                templateUrl: 'templates/month.jsp',
                controller: 'MonthController',
                controllerAs: 'vm'
            })
            .when('/upload', {
                templateUrl: 'templates/upload.html',
                controller: 'UploadController',
                controllerAs: 'vm'
            })
            .when('/budget', {
                templateUrl: 'templates/budget.html',
                controller: 'BudgetController',
                controllerAs: 'vm'
            })
            .when('/categories', {
                templateUrl: 'templates/categories.html',
                controller: 'CategoriesController',
                controllerAs: 'vm'
            })
            .when('/misc', {
                templateUrl: 'templates/misc.jsp',
                controller: 'MiscController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/year'
            });
    }]).config(['ngToastProvider', function(ngToast) {
        ngToast.configure({
            horizontalPosition: 'center'
        });
    }]);