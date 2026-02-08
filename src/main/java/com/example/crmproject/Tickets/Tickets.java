package com.example.crmproject.TicketsType;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "TicketsType")
public class TicketsType {
        @Id
        @GeneratedValue(strategy =
                GenerationType.IDENTITY)
        private Long id;

        @Column(name =
                "ticket_no",
                nullable = false,
                unique = true)
        private Long ticketNo;

        @Column(name =
                "description",
                nullable = false)
        private String description;

        @Column(name =
                "company_Name",
                nullable = false)
        private String companyName;

        @Column(name =
                "email",
                nullable = false)
        private String email;

        @Column(name =
                "phone",
                nullable = false)
        private String phone;

        @Column(name =
                "updated_last")
        private Date updatedLast;

        @Column(name =
                "created",
                nullable = false)
        private Date created;

        public enum TicketStatus {
                OPEN, IN_PROGRESS, WAITING, CLOSED
        }

        @Enumerated(EnumType.STRING)
        @Column(name = "status", nullable = false)
        private TicketStatus status = TicketStatus.OPEN;

        protected TicketsType(){
        }

        public TicketsType(
                Long ticketNo,
                String description,
                String companyName,
                String email,
                String phone,
                Date updatedLast,
                Date created,
                String status ){
            this.ticketNo = ticketNo;
            this.description = description;
            this.companyName = companyName;
            this.email = email;
            this.phone = phone;
            this.updatedLast = updatedLast;
            this.created = created;
            this.setStatus(status);
        }

        public Long getId() { return id; }

        public Long getTicketNo() {return ticketNo;}
        public void setTicketNo(Long ticketNo)
        {this.ticketNo = ticketNo;}

        public String getDescription() {return description;}
        public void setDescription(String description)
        {this.description = description;}

        public String getCompanyName() {return companyName;}
        public void setCompanyName(String company_Name)
        {this.companyName = company_Name;}

        public String getEmail() {return email;}
        public void setEmail(String email)
        {this.email = email;}

        public String getPhone() {return phone;}
        public void setPhone(String phone)
        {this.phone = phone;}

        public Date getUpdatedLast() {return updatedLast;}
        public void setUpdatedLast(Date updatedLast)
        {this.updatedLast = updatedLast;}

        public Date getCreated() {return created;}
        public void setCreated(Date created)
        {this.created = created;}

        public TicketStatus getStatus() {return status;}
        public void setStatus(String status) {
                if (status == null || status.isBlank()) {
                        this.status = TicketStatus.OPEN;
                        return;
                }
                this.status = TicketStatus.valueOf(status.trim().toUpperCase());
        }




}

