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

import finance.entity.Account;
import org.hibernate.Session;
import finance.entity.Transaction;
import finance.util.HibernateUtil;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.Query;

/**
 * Repository that holds transactions.
 * 
 * @author Nathan Neville
 */
public class TransactionRepository {
    
    /**
     * Get list of transactions by date, ordered by effective date then sort ID.
     * 
     * @param startdate the date transactions start
     * @param enddate the date transactions end
     * @return a list of transactions
     */
    public List<Transaction> getTransactions(String startdate, String enddate) {
        List<Transaction> transactionList = null;
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction hbtransaction = session.beginTransaction();
            Query q = session.createQuery ("from finance.entity.Transaction trans WHERE (trans.effdate BETWEEN :startdate AND :enddate) AND trans.category.extra = false AND trans.deleted = false ORDER BY trans.effdate, trans.category.sortId");
            q.setParameter("startdate", java.sql.Date.valueOf(startdate));
            q.setParameter("enddate", java.sql.Date.valueOf(enddate));
            transactionList = (List<Transaction>) q.list();
            hbtransaction.commit();
        } catch (Exception e) {
            throw e;
        }
        return transactionList;
    }
    
    /**
     * Gets extra transactions. Extra transactions are transactions that are not
     * included in the yearly view. They are usually one-time expenses that
     * don't fit in any of the monthly categories.
     * 
     * @param startdate the date transactions start
     * @param enddate the date transactions end
     * @return a list of extra transactions
     */
    public List<Transaction> getExtraTransactions(String startdate, String enddate) {
        List<Transaction> transactionList = null;
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction hbtransaction = session.beginTransaction();
            Query q = session.createQuery ("from finance.entity.Transaction trans WHERE (trans.effdate BETWEEN :startdate AND :enddate) AND trans.category.extra = true AND trans.deleted = false ORDER BY trans.effdate, trans.category.sortId");
            q.setParameter("startdate", java.sql.Date.valueOf(startdate));
            q.setParameter("enddate", java.sql.Date.valueOf(enddate));
            transactionList = (List<Transaction>) q.list();
            hbtransaction.commit();
        } catch (Exception e) {
            throw e;
        }
        return transactionList;
    }
    
    /**
     * Saves a list of transactions. Does not save "duplicate" transactions ie.
     * transactions that are already in the system.
     * 
     * @param transactions a list of transactions to save
     */
    public void saveTransactions(List<Transaction> transactions) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction hbtransaction = session.beginTransaction();
            for(Transaction trans : transactions) {
                // don't save "duplicate" transactions
                Query q = session.createQuery ("from finance.entity.Transaction trans WHERE trans.transdate = :transdate AND trans.amount = :amount AND trans.vendor = :vendor AND trans.account.uid = :accountuid");
                q.setParameter("transdate", trans.getTransdate());
                q.setParameter("amount", trans.getAmount());
                q.setParameter("vendor", trans.getVendor());
                Account acct = trans.getAccount();
                q.setParameter("accountuid", acct.getUid());
                List<Transaction> transactionList = (List<Transaction>) q.list();
                if (transactionList.isEmpty()) {
                    session.save(trans);
                }
            }
            hbtransaction.commit();
        } catch (Exception e) {
            throw e;
        }
    }
    
    /**
     * Checks transactions for duplicates. A transaction is considered a 
     * duplicate if the transaction date, amount, vendor and account match a
     * transaction already in the system.
     * 
     * @param transactions a list of transactions to check for duplicates
     * @return a list of transactions with duplicates removed
     */
    public List<Transaction> checkTransactions(List<Transaction> transactions) {
        List<Transaction> transactionList = new ArrayList<Transaction>();
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction hbtransaction = session.beginTransaction();
            for(Transaction trans : transactions) {
                Query q = session.createQuery ("from finance.entity.Transaction trans WHERE trans.transdate = :transdate AND trans.amount = :amount AND trans.vendor = :vendor AND trans.account.uid = :accountuid");
                q.setParameter("transdate", trans.getTransdate());
                q.setParameter("amount", trans.getAmount());
                q.setParameter("vendor", trans.getVendor());
                Account acct = trans.getAccount();
                q.setParameter("accountuid", acct.getUid());
                List<Transaction> foundTransactions = (List<Transaction>) q.list();
                if (foundTransactions.isEmpty()) {
                    transactionList.add(trans);
                }
            }
            hbtransaction.commit();
        } catch (Exception e) {
            throw e;
        }
        return transactionList;
    }
    
    /**
     * Add a split transaction to the repository. This method expects a list of
     * transactions with at least one of the transactions having its deleted
     * property set to true (the original transaction).
     * 
     * @param transactions a list of transactions including the deleted one
     * @return the same list of transactions
     */
    public List<Transaction> splitTransactions(List<Transaction> transactions) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction hbtransaction = session.beginTransaction();
            for(Transaction trans : transactions) {
                session.saveOrUpdate(trans);
            }
            hbtransaction.commit();
        } catch (Exception e) {
            throw e;
        }
        return transactions;
    }
    
    /**
     * Save a single transaction. Does not save "duplicate" transactions ie.
     * transactions that are already in the system.
     * 
     * @param transaction the transaction to save
     */
    public void saveTransaction(Transaction transaction) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction hbtransaction = session.beginTransaction();
            // don't save "duplicate" transactions
            Query q = session.createQuery ("from finance.entity.Transaction trans WHERE trans.transdate = :transdate AND trans.amount = :amount AND trans.vendor = :vendor AND trans.account.uid = :accountuid");
            q.setParameter("transdate", transaction.getTransdate());
            q.setParameter("amount", transaction.getAmount());
            q.setParameter("vendor", transaction.getVendor());
            Account acct = transaction.getAccount();
            q.setParameter("accountuid", acct.getUid());
            List<Transaction> transactionList = (List<Transaction>) q.list();
            if (transactionList.isEmpty()) {
                session.save(transaction);
            }
            hbtransaction.commit();
        } catch (Exception e) {
            throw e;
        }
    }
    
    /**
     * Updates a transaction.
     * 
     * @param transaction the transaction to update.
     */
    public void updateTransaction(Transaction transaction) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        try {
            org.hibernate.Transaction hbtransaction = session.beginTransaction();
            session.update(transaction);
            hbtransaction.commit();
        } catch (Exception e) {
            throw e;
        }
    }
    
}