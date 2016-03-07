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

import finance.model.Settings;
import org.hibernate.Session;
import finance.entity.*;
import finance.util.*;
import java.util.Date;
import java.util.List;
import org.hibernate.Query;

/**
 * Repository for program settings.
 * 
 * @author Nathan Neville
 */
public class SettingsRepository {
    
    /**
     * Gets the application settings. The settings include all of the categories,
     * accounts and account settings (account file headers) in the system, as
     * well as the maximum and minimum dates of all transactions stored.
     * 
     * @return the settings
     */
    public Settings getSettings() {
        Settings settings = new Settings();
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction transaction = session.beginTransaction();
            Query q = session.createQuery ("from finance.entity.Category cat ORDER BY cat.sortId");
            List<Category> categories = (List<Category>) q.list();
            settings.setCategories(categories);
            Query q2 = session.createQuery ("from finance.entity.Account");
            List<Account> accounts = (List<Account>) q2.list();
            settings.setAccounts(accounts);
            Query q3 = session.createQuery ("from finance.entity.AccountSetting");
            List<AccountSetting> accountSettings = (List<AccountSetting>) q3.list();
            settings.setAccountSettings(accountSettings);
            Query sqlQuery = session.createSQLQuery("SELECT MIN(transdate) as transmindate, MAX(transdate) as transmaxdate FROM transaction").addScalar("TRANSMINDATE").addScalar("TRANSMAXDATE");
            List<Object[]> rows = sqlQuery.list();
            for(Object[] row : rows)
            {
                if (row[0] != null && row[1] != null)
                {
                    settings.setTransMinDate((Date)row[0]);
                    settings.setTransMaxDate((Date)row[1]);
                }
            }
            transaction.commit();
        } catch (Exception e) {
            throw e;
        } finally {
            if (session.isOpen())
            {
                session.close();
            }
        }
        return settings;
    }
    
}
