<%--
 Licensed to the Apache Software Foundation (ASF) under one or more
  contributor license agreements.  See the NOTICE file distributed with
  this work for additional information regarding copyright ownership.
  The ASF licenses this file to You under the Apache License, Version 2.0
  (the "License"); you may not use this file except in compliance with
  the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
--%>
<%@ taglib uri="http://jawr.net/tags" prefix="jwr" %>
<%
    if (request.getParameter("logoff") != null) {
        session.invalidate();
        response.sendRedirect(response.encodeURL("index.jsp"));
        return;
    }
%>
<html>
    <head>
        <title>Finance Login</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <jwr:style src="/bundles/all.css" />
    <body style="margin: 0; padding: 0;">
        <div class="container">
            <h1>Finance Login</h1>
            <form class="form-horizontal" method="POST" action='<%= response.encodeURL("j_security_check")%>' >
                <div class="form-group">
                    <label class="col-sm-3 control-label">Username</label>
                    <div class="col-sm-4">
                        <input type="text" class="form-control" name="j_username">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">Password</label>
                    <div class="col-sm-4">
                        <input type="password" class="form-control" name="j_password">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <input class="btn btn-primary" type="submit" value="Log In">
                        <input class="btn btn-default" type="reset">
                    </div>
                </div>
            </form>
        </div>
    </body>
</html>