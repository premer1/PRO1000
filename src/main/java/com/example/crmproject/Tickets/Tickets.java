package com.example.crmproject.Tickets;

import jakarta.persistence.*;

@Entity
@Table(name = "tickets")
public class Tickets {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name = "ticket_no", nullable = false, unique = true)
        private Long ticketNo;

        @Column(name = "description", nullable = false)
        private String description;

        @Column(name = "company_Name", nullable = false)
        private String companyName;

        @Column(name = "contact", nullable = false)
        private String contact;

        @Column(name = "email", nullable = false)
        private String email;

        @Column(name = "phone", nullable = false)
        private String phone;

        protected Tickets() {}

        public Tickets(Long ticketNo, String description, String companyName, String contact, String email, String phone) {
            this.ticketNo = ticketNo;
            this.description = description;
            this.companyName = companyName;
            this.contact = contact;
            this.email = email;
            this.phone = phone;
        }

        public Long getId() { return id; }

        public Long getTicketNo() {return ticketNo;}
        public void setTicketNo(Long ticketNo) {this.ticketNo = ticketNo;}

        public String getDescription() {return description;}
        public void setDescription(String description) {this.description = description;}

        public String getCompanyName() {return companyName;}
        public void setCompanyName(String company_Name) {this.companyName = company_Name;}

        public String getContact() {return contact;}
        public void setContact(String contact) {this.contact = contact;}

        public String getEmail() {return email;}
        public void setEmail(String email) {this.email = email;}

        public String getPhone() {return phone;}
        public void setPhone(String phone) {this.phone = phone;}

}

