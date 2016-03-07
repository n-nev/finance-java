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
import finance.entity.Budget;
import finance.entity.BudgetCategory;
import finance.util.HibernateUtil;
import java.util.List;
import org.hibernate.Query;

/**
 *
 * @author Nathan Neville
 */
public class BudgetRepository {
    
    /**
     * Gets the budget for the given year.
     * 
     * @param year the year of the budget
     * @return the budget for given year
     */
    public Budget getBudget(int year) {
        Budget budget = null;
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction transaction = session.beginTransaction();
            Query q = session.createQuery ("from finance.entity.Budget as budget where budget.year = :year").setInteger("year", year);
            budget = (Budget) q.uniqueResult();
            transaction.commit();
        } catch (Exception e) {
            throw e;
        }
        return budget;
    }
    
    /**
     * Saves or updates the given budget.
     * 
     * @param budget the budget to save
     */
    public void saveOrUpdateBudget(List<BudgetCategory> budget) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction transaction = session.beginTransaction();
            for(BudgetCategory budgetCategory : budget) {
                session.saveOrUpdate(budgetCategory);
            }
            transaction.commit();
        } catch (Exception e) {
            throw e;
        }
    }
    
}
