package finance.model;

import finance.entity.Account;
import finance.entity.AccountSetting;
import finance.entity.Category;
import java.util.List;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import java.util.Date;

/**
 *
 * @author Nathan Neville
 */
@XmlRootElement
public class Settings {
    
    private List<Account> accounts;
    private List<AccountSetting> accountSettings;
    private List<Category> categories;
    private Date transMaxDate;
    private Date transMinDate;

    /**
     * @return the accounts
     */
    public List<Account> getAccounts() {
        return accounts;
    }

    /**
     * @param accounts the accounts to set
     */
    public void setAccounts(List<Account> accounts) {
        this.accounts = accounts;
    }

    /**
     * @return the categories
     */
    public List<Category> getCategories() {
        return categories;
    }

    /**
     * @param categories the categories to set
     */
    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    /**
     * @return the accountSettings
     */
    public List<AccountSetting> getAccountSettings() {
        return accountSettings;
    }

    /**
     * @param accountSettings the accountSettings to set
     */
    public void setAccountSettings(List<AccountSetting> accountSettings) {
        this.accountSettings = accountSettings;
    }

    /**
     * @return the transMaxDate
     */
    public Date getTransMaxDate() {
        return transMaxDate;
    }

    /**
     * @param transMaxDate the transMaxDate to set
     */
    public void setTransMaxDate(Date transMaxDate) {
        this.transMaxDate = transMaxDate;
    }

    /**
     * @return the transMinDate
     */
    public Date getTransMinDate() {
        return transMinDate;
    }

    /**
     * @param transMinDate the transMinDate to set
     */
    public void setTransMinDate(Date transMinDate) {
        this.transMinDate = transMinDate;
    }

}
