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
import finance.entity.*;
import finance.model.*;
import finance.util.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.Query;

/**
 * Repository for year information
 * 
 * @author Nathan Neville
 */
public class YearRepository {
    
    /**
     * Gets monthly transaction information for a year. The monthly information
     * includes the amount spent for each category and a total for that month.
     * 
     * @param year the year to get information for
     * @return list of monthly transaction information
     */
    public List<Month> getMonthlyAmounts(int year) {
        List<Month> months = new ArrayList<>();
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction transaction = session.beginTransaction();
            Query q = session.createQuery ("from finance.entity.Category cat WHERE extra = false ORDER BY cat.sortId");
            List<Category> categories = (List<Category>) q.list();
            Query sqlQuery = session.createSQLQuery("SELECT MONTH(`effdate`) AS mon, category_id as categoryid, SUM(amount) AS total FROM `transaction` WHERE "+
                "YEAR(`effdate`) = :year AND deleted = 0 GROUP BY mon, category_id").addScalar("MON").addScalar("CATEGORYID").addScalar("TOTAL");
            sqlQuery.setParameter("year", year);
            List<Object[]> rows = sqlQuery.list();
            
            // for each month in the year
            for (int i = 1; i <= 12; i++)
            {
                Month month = new Month();
                month.setMonthId(i);
                List<CategoryTotal> catTotals = new ArrayList<>();
                for(Category category : categories)
                {
                    CategoryTotal catTotal = new CategoryTotal();
                    catTotal.setUid(category.getUid());
                    catTotal.setName(category.getName());
                    catTotal.setExtra(category.getExtra());
                    catTotal.setAmount(BigDecimal.ZERO);
                    for(Object[] row : rows)
                    {
                        if ((int)row[0] == i)
                        {
                            if ((int) row[1] == category.getUid())
                            {
                                catTotal.setAmount((BigDecimal) row[2]);
                            }
                        }
                    }
                    catTotals.add(catTotal);
                }
                month.setCategories(catTotals);
                months.add(month);
            }
            
            transaction.commit();
        } catch (Exception e) {
            throw e;
        }
        return months;
    }
}
