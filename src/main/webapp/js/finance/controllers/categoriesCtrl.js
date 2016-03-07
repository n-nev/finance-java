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

angular.module("app").controller("CategoriesController", ['$scope', '$uibModal', 'ngToast', 'appSettings', 'categoryService',
    function ($scope, $uibModal, ngToast, appSettings, categoryService) {
    
    $scope.categories = appSettings.categories;

    $scope.newCategory = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modal-new-edit-category.html',
            controller: 'NewEditCategory',
            size: 'sm',
            resolve: {
                category: function () {
                    return null;
                }
            }
        });
        modalInstance.result.then(function (category) {
            $scope.categories.push(category);
        });
    };
    
    $scope.editCategory = function (category) {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modal-new-edit-category.html',
            controller: 'NewEditCategory',
            size: 'sm',
            resolve: {
                category: function () {
                    return angular.copy(category);
                }
            }
        });
        modalInstance.result.then(function (category) {
            if ($scope.categories) {
                for (var i = 0; i < $scope.categories.length; i++) {
                    if ($scope.categories[i].uid === category.uid) {
                        $scope.categories[i] = category;
                        break;
                    }
                }
            }
        });
    };
    
    $scope.save = function() {
        // reorder the categories
        var catCount = $scope.categories.length;
        for (var i = 0; i < catCount; i++) {
            $scope.categories[i].sortId = i + 1;
        }
        categoryService.saveCategories($scope.categories).then(function (result) {
            ngToast.success({
                content: 'Categories saved'
            });
        }, function (result) {
            ngToast.danger({
                content: 'There was a problem saving the categories: ' + result.data
            });
        });
    };

}]);