package com.example.crmproject.Customer;

import jakarta.persistence.*;

@Entity
@Table (name = "Customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_no", nullable = false, unique = true)
    public long customerNo;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone", nullable = false, unique = true)
    private Long phone;

    protected Customer() {

    }

    public Customer(Long customerNo, String companyName, String firstName, String lastName, String email, Long phone) {
        this.customerNo = customerNo;
        this.companyName = companyName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }

    public Long getId() {return id;}
    public long getCustomerNo() {return customerNo;}
    public void setCustomerNo(Long customerNo) {this.customerNo = customerNo;}

    public String getCompanyName() {return companyName;}
    public void setCompanyName(String companyName) {this.companyName = companyName;}

    public String getFirstName() {return firstName;}
    public void setFirstName(String firstName) {this.firstName = firstName;}

    public String getLastName() {return lastName;}
    public void setLastName(String lastName) {this.lastName = lastName;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public Long getPhone() {return phone;}
    public void setPhone(Long phone) {this.phone = phone;}

}

