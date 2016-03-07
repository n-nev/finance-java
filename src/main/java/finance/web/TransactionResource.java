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
package finance.web;

import finance.entity.*;
import finance.repository.TransactionRepository;
import finance.util.ErrorMessage;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author Nathan Neville
 */
@Path("transactions")
public class TransactionResource {
        
    /**
     * Method handling HTTP GET requests. The returned object will be sent
     * to the client as "application/json" media type.
     *
     * @return String that will be returned as a application/json response.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTransactions(@QueryParam("startdate") String startdate,
            @QueryParam("enddate") String enddate) {
        List<Transaction> transactionList = new ArrayList<>();
        try {
            TransactionRepository accountRepository = new TransactionRepository();
            transactionList = accountRepository.getTransactions(startdate, enddate);
        }
        catch (Exception ex)
        {
            ErrorMessage myError = new ErrorMessage();
            myError.setMessage(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
        }
        GenericEntity<List<Transaction>> list = new GenericEntity<List<Transaction>>(transactionList) {};
        return Response.ok().entity(list).build();
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTransactions(List<Transaction> transactions) {
        
        if (transactions != null && transactions.size() > 0) {
            try {
                TransactionRepository transactionRepository = new TransactionRepository();
                transactionRepository.saveTransactions(transactions);
            }
            catch (Exception ex)
            {
                ErrorMessage myError = new ErrorMessage();
                myError.setMessage(ex.getMessage());
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
            }
        }
		
        return Response.ok().build();
    }
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTransaction(Transaction transaction) {
        
        if (transaction != null) {
            try {
                TransactionRepository transactionRepository = new TransactionRepository();
                transactionRepository.updateTransaction(transaction);
            }
            catch (Exception ex)
            {
                ErrorMessage myError = new ErrorMessage();
                myError.setMessage(ex.getMessage());
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
            }
        }
		
        return Response.ok(transaction).build();
    }
    
    @Path("extra")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getExtraTransactions(@QueryParam("startdate") String startdate,
            @QueryParam("enddate") String enddate) {
        try {
            TransactionRepository accountRepository = new TransactionRepository();
            List<Transaction> transactionList = accountRepository.getExtraTransactions(startdate, enddate);
            GenericEntity<List<Transaction>> list = new GenericEntity<List<Transaction>>(transactionList) {};
            return Response.ok().entity(list).build();
        }
        catch (Exception ex)
        {
            ErrorMessage myError = new ErrorMessage();
            myError.setMessage(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
        }
    }
    
    @Path("check")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkTransactions(List<Transaction> transactions) {
	List<Transaction> transactionList = new ArrayList<>();
        
        if (transactions != null && transactions.size() > 0) {
            try {
                TransactionRepository transactionRepository = new TransactionRepository();
                transactionList = transactionRepository.checkTransactions(transactions);
            }
            catch (Exception ex)
            {
                ErrorMessage myError = new ErrorMessage();
                myError.setMessage(ex.getMessage());
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
            }
        }
	GenericEntity<List<Transaction>> list = new GenericEntity<List<Transaction>>(transactionList) {};
        return Response.ok().entity(list).build();
    }
    
    @Path("split")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response splitTransactions(List<Transaction> transactions) {
        List<Transaction> transactionList = new ArrayList<>();
        if (transactions != null && transactions.size() > 0) {
            try {
                TransactionRepository transactionRepository = new TransactionRepository();
                transactionList = transactionRepository.splitTransactions(transactions);
            }
            catch (Exception ex)
            {
                ErrorMessage myError = new ErrorMessage();
                myError.setMessage(ex.getMessage());
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
            }
        }
        GenericEntity<List<Transaction>> list = new GenericEntity<List<Transaction>>(transactionList) {};
        return Response.ok().entity(list).build();
    }
    
}
