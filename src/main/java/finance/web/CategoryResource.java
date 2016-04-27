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

import finance.entity.Category;
import finance.repository.CategoryRepository;
import finance.util.ErrorMessage;
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
@Path("categories")
public class CategoryResource {
        
    /**
     * Method handling HTTP GET requests. The returned object will be sent
     * to the client as "application/json" media type.
     *
     * @param categories categories to save or update
     * @return String that will be returned as a application/json response.
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCategories(List<Category> categories) {
		
        ErrorMessage myError = new ErrorMessage();
        
        if (categories != null && categories.size() > 0) {
            try {
                CategoryRepository categoryRepository = new CategoryRepository();
                categoryRepository.updateCategories(categories);
            }
            catch (Exception ex)
            {
                myError.setMessage(ex.getMessage());
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
            }
        }
        return Response.ok().build();
    }
    
    @Path("category")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addCategory(Category category) {
		
        ErrorMessage myError = new ErrorMessage();
        Category returnCategory = null;
        try {
            CategoryRepository categoryRepository = new CategoryRepository();
            returnCategory = categoryRepository.addCategory(category);
        }
        catch (Exception ex)
        {
            myError.setMessage(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
        }
		
        return Response.ok(returnCategory).build();
    }
    
    @Path("category")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCategory(Category category) {
		
        ErrorMessage myError = new ErrorMessage();
        try {
            CategoryRepository categoryRepository = new CategoryRepository();
            categoryRepository.updateCategory(category);
        }
        catch (Exception ex)
        {
            myError.setMessage(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(myError).build();
        }
		
        return Response.ok().build();
    }
}
