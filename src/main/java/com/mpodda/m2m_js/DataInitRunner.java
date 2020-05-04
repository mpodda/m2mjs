package com.mpodda.m2m_js;

import com.mpodda.m2m_js.domain.Nationality;
import com.mpodda.m2m_js.domain.Person;
import com.mpodda.m2m_js.service.NationalityService;
import com.mpodda.m2m_js.service.PersonService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitRunner implements ApplicationRunner {
        private static final Logger logger = LoggerFactory.getLogger(DataInitRunner.class);

        private PersonService personService;
        private NationalityService nationalityService;

        @Autowired
        public DataInitRunner(PersonService personService, NationalityService nationalityService) {
                this.personService = personService;
                this.nationalityService = nationalityService;
        }

        @Override
        public void run(ApplicationArguments arguments) throws Exception {
                Nationality italian = new Nationality("IT", "Italian");
                Nationality german = new Nationality("DE", "German");
                Nationality greek = new Nationality("GR", "Greek");
                Nationality british = new Nationality("GB", "British");

                this.nationalityService.create(italian);
                this.nationalityService.create(german);
                this.nationalityService.create(greek);
                this.nationalityService.create(british);

                logger.info("{} Nationalities have been added", this.nationalityService.count());

                this.personService.create(new Person("Marcello", "M", true, "", italian));
                this.personService.create(new Person("Mary", "W", true, "Good Girld", greek));
                this.personService.create(new Person("Jon", "M", false, "Good Boy", british));
                this.personService.create(new Person("James", "M", true, "", british));
                this.personService.create(new Person("Johanna", "W", true, "", german));
                this.personService.create(new Person("George", "M", false, "", british));

                logger.info("{} Persons have been added", this.personService.count());
        }

}
