package finance.entity;
// Generated Nov 29, 2015 12:39:27 PM by Hibernate Tools 4.3.1

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;




/**
 * Budget generated by hbm2java
 */
@XmlRootElement
public class Budget  implements java.io.Serializable {


     private Integer uid;
     private short year;
     private List<BudgetCategory> budgetCategory; //  = new ArrayList<>();

    public Budget() {
    }

    public Budget(short year) {
       this.year = year;
    }
   
    public Integer getUid() {
        return this.uid;
    }
    
    public void setUid(Integer uid) {
        this.uid = uid;
    }
    public short getYear() {
        return this.year;
    }
    
    public void setYear(short year) {
        this.year = year;
    }

    public List<BudgetCategory> getBudgetCategory() {
        return budgetCategory;
    }

    public void setBudgetCategory(List<BudgetCategory> budgetCategory) {
        this.budgetCategory = budgetCategory;
    }


}


