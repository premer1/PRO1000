package com.example.crmproject;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CrmProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmProjectApplication.class, args);
    }
    //kommenterer ut koden under da vi kan legge til kunder fra frontend
    /*
    @Bean
    CommandLineRunner commandLineRunner(CustomerRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Customer ola = new Customer("1001", "Ola Nordmann AS", "Henrik", "Premer", "ola@nordmann.no", "88888888");
                Customer erik = new Customer("1002", "USN IT-tjenester", "Erik", "Svendsen", "it-tjenester@usn.no", "12345678");
                Customer lise = new Customer("1003", "Lise Design AS", "Lise", "Berg", "lise@design.no", "11111111");
                Customer jonas = new Customer("1004", "Jonas Vaktmesterservice", "Jonas", "Hansen", "post@jonasvakt.no", "87654321");
                Customer mette = new Customer("1005", "Mettes Blomster", "Mette", "Larsen", "mette@blomster.no", "22222222");

                repository.saveAll(List.of(ola, erik, lise, jonas, mette));
                System.out.println("Testdata er lagt inn!");
            }
        };
    } */
}