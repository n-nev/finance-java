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
package finance.repository;

import org.hibernate.Session;
import finance.entity.Category;
import finance.util.HibernateUtil;
import java.util.List;
import org.hibernate.Query;

public class CategoryRepository {
    
    /**
     * Add category to repository.
     * 
     * @param category the category to add 
     */
    public Category addCategory(Category category) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction transaction = session.beginTransaction();
            // since this is a new category, get the max sort_id and add 1
            int max = (int) session.createSQLQuery("SELECT MAX(`sort_id`) AS max FROM category").addScalar("max").uniqueResult();
            category.setSortId(max + 1);
            session.save(category);
            transaction.commit();
        } catch (Exception e) {
            throw e;
        }
        return category;
    }
    
    /**
     * Update a category in the repository.
     * 
     * @param category the category to update
     */
    public void updateCategory(Category category) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction transaction = session.beginTransaction();
            session.update(category);
            transaction.commit();
        } catch (Exception e) {
            throw e;
        }
    }
    
    /**
     * Gets list of categories ordered by sort ID.
     * 
     * @return the list of categories
     */
    public List<Category> getCategories() {
        List<Category> categoryList = null;
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction transaction = session.beginTransaction();
            Query q = session.createQuery ("from finance.entity.Category cat ORDER BY cat.sortId");
            categoryList = (List<Category>) q.list();
            transaction.commit();
        } catch (Exception e) {
            throw e;
        }
        return categoryList;
    }
    
    /**
     * Update categories in repository.
     * 
     * @param categories a list of categories to update
     */
    public void updateCategories(List<Category> categories) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction transaction = session.beginTransaction();
            for(Category cat : categories) {
                session.update(cat);
            }
            transaction.commit();
        } catch (Exception e) {
            throw e;
        }
    }
    
}