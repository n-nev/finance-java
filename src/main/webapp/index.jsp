<%@page import="finance.util.ApplicationSettings"%>
<%@ taglib uri="http://jawr.net/tags" prefix="jwr" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Finance</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <jwr:style src="/bundles/all.css" />
        <jwr:script src="/bundles/lib.js"/>
        <jwr:script src="/bundles/finance.js"/>
        <script>
            var data = JSON.parse('<% 
                ApplicationSettings settings = new ApplicationSettings();
                out.print(settings.GetSettings());
            %>');
            angular.module("app").value("appSettings", data);
        </script>
    </head>
    <body ng-app="app">
        <toast></toast>
        <nav class="navbar navbar-default navbar-fixed-top" data-ng-controller="NavController">
            <div class="container">
                <div class="navbar-header">
                    <span class="navbar-brand">Finance</span>
                </div>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li ng-class="$location.path() === '/year' ? 'active' : ''"><a href="#/year">Yearly</a></li>
                        <li ng-class="$location.path() === '/month' ? 'active' : ''"><a href="#/month">Monthly</a></li>
                        <%
                            if (request.isUserInRole("financeadmin")) {
                        %>
                        <li ng-class="$location.path() === '/upload' ? 'active' : ''" class="dropdown">
                            <a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Transactions <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                              <li><a href="#/upload">Upload CSV</a></li>
                              <li><a href="javascript:void(0)" ng-click="newTransaction()">Enter single transaction</a></li>
                            </ul>
                        </li>
                        <li ng-class="$location.path() === '/budget' ? 'active' : ''"><a href="#/budget">Budget</a></li>
                        <li ng-class="$location.path() === '/categories' ? 'active' : ''"><a href="#/categories">Categories</a></li>
                        <%
                            }
                        %>
                        <li ng-class="$location.path() === '/misc' ? 'active' : ''"><a href="#/misc">Misc</a></li>
                        <li><a href='<%= response.encodeURL("login.jsp?logoff=true") %>'>Logout</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div ng-view></div>
        <footer>&nbsp;</footer>
    </body>
</html>