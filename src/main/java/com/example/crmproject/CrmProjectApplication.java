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

    @Bean
    CommandLineRunner commandLineRunner(CustomerRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // Merk: Vi fjerner fnutter rundt tallene og bruker Long-format
                Customer ola = new Customer(1001L, "Ola Nordmann AS", "Henrik", "Premer", "ola@nordmann.no", 88888888L);
                Customer erik = new Customer(1002L, "USN IT-tjenester", "Erik", "Svendsen", "it-tjenester@usn.no", 12345678L);
                Customer lise = new Customer(1003L, "Lise Design AS", "Lise", "Berg", "lise@design.no", 11111111L);
                Customer jonas = new Customer(1004L, "Jonas Vaktmesterservice", "Jonas", "Hansen", "post@jonasvakt.no", 87654321L);
                Customer mette = new Customer(1005L, "Mettes Blomster", "Mette", "Larsen", "mette@blomster.no", 22222222L);

                repository.saveAll(List.of(ola, erik, lise, jonas, mette));
                System.out.println("Testdata er lagt inn!");
            }
        };
    }
}