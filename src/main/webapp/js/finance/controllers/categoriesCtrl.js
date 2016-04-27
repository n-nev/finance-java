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

angular.module("app").controller("CategoriesController", ['$uibModal', 'ngToast', 'appSettings', 'categoryService',
    function ($uibModal, ngToast, appSettings, categoryService) {
        
    var vm = this;
    
    vm.categories = appSettings.categories;

    vm.newCategory = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modal-new-category.html',
            controller: 'NewCategory',
            controllerAs: 'vm',
            size: 'sm'
        });
        modalInstance.result.then(function (category) {
            console.log(category);
            vm.categories.push(category);
            appSettings.categories = vm.categories;
        });
    };
    
    vm.editCategory = function (category) {
        var modalInstance = $uibModal.open({
            templateUrl: 'templates/modal-edit-category.html',
            controller: 'EditCategory',
            controllerAs: 'vm',
            size: 'sm',
            resolve: {
                category: function () {
                    return angular.copy(category);
                }
            }
        });
        modalInstance.result.then(function (category) {
            if (vm.categories) {
                for (var i = 0; i < vm.categories.length; i++) {
                    if (vm.categories[i].uid === category.uid) {
                        vm.categories[i] = category;
                        break;
                    }
                }
                appSettings.categories = vm.categories;
            }
        });
    };
    
    vm.save = function() {
        // reorder the categories
        var catCount = vm.categories.length;
        for (var i = 0; i < catCount; i++) {
            vm.categories[i].sortId = i + 1;
        }
        categoryService.saveCategories(vm.categories).then(function (result) {
            // save categories back to service
            appSettings.categories = vm.categories;
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