<section>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <form class="form-inline" style="margin-bottom: 1em;">
                    <div class="form-group">
                        <select class="form-control" ng-model="vm.selectedMonth"
                            ng-options="month as month.key for month in vm.months"
                            ng-change="vm.loadTransactions()">
                        </select>
                    </div>
                    <div class="form-group">
                        <select class="form-control" ng-model="vm.selectedYear"
                            ng-options="year for year in vm.transYears"
                            ng-change="vm.loadTransactions()">
                        </select>
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-2">
                <strong>Date</strong>
            </div>
            <div class="col-sm-1">
                <strong>Amt</strong>
            </div>
            <div class="col-sm-5">
                <strong>Vendor</strong>
            </div>
            <div class="col-sm-2">
                <strong>For</strong>
            </div>
            <div class="col-sm-2">
                <strong>Account</strong>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12" ng-repeat="category in vm.categories | filter: {extra : false} : true">
                <div class="finance-category"><span ng-bind="category.name"></span></div>
                <div class="row" ng-repeat="transaction in vm.transactions | filter: {category: {uid: category.uid}} | filter: {deleted : false} : true | orderBy:'effdate'">
                    <div class="col-sm-2">
                        {{transaction.effdate | date:'MM/dd/yyyy'}}
                    </div>
                    <div class="col-sm-1 budget-amount">
                        <%
                            if (request.isUserInRole("financeadmin")) {
                        %>
                            <a href ng-click="vm.editTransaction(transaction)">{{transaction.amount | currency}}</a>
                        <% } else { %>
                            {{transaction.amount | currency}}
                        <% } %>
                    </div>
                    <div class="col-sm-5">
                        <span ng-class="transaction.splitId ? 'split' : ''">{{transaction.vendor | limitTo: 30}}</span>
                    </div>
                    <div class="col-sm-2">
                        <%
                            if (request.isUserInRole("financeadmin")) {
                        %>
                            <a href ng-click="vm.editTransaction(transaction)">{{transaction.description}}</a>
                        <% } else { %>
                            {{transaction.description}}
                        <% } %>
                    </div>
                    <div class="col-sm-2">
                        {{transaction.account.name}}
                    </div>
                </div>
                <div class="row budget-total">
                    <div class="col-sm-2">
                        Total
                    </div>
                    <div class="col-sm-1 budget-amount">
                        {{vm.getTotal(category.uid) | currency}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>