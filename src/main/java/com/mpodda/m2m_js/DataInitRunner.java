package com.mpodda.m2m_js;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.mpodda.m2m_js.domain.Nationality;
import com.mpodda.m2m_js.domain.Person;
import com.mpodda.m2m_js.repository.NationalityRepository;
import com.mpodda.m2m_js.repository.PersonRepository;

@Component
public class DataInitRunner implements ApplicationRunner {
	private static final Logger logger = LoggerFactory.getLogger(DataInitRunner.class);
	
	private PersonRepository personRepository;
	private NationalityRepository nationalityRepository;
	
	
	@Autowired
	public DataInitRunner(PersonRepository personRepository, NationalityRepository nationalityRepository) {
		this.personRepository = personRepository;
		this.nationalityRepository = nationalityRepository;
	}
	
	@Override
	public void run(ApplicationArguments arguments) throws Exception {
        Nationality italian = new Nationality(1, "IT", "Italian");
        Nationality german = new Nationality(2, "DE", "German");
        Nationality greek = new Nationality(3, "GR", "Greek");
        Nationality british = new Nationality(4, "GB", "British");

        this.nationalityRepository.save(italian);
        this.nationalityRepository.save(german);
        this.nationalityRepository.save(greek);
        this.nationalityRepository.save(british);
        
        logger.info("{} Nationalities have been added", this.nationalityRepository.count());
        
        this.personRepository.save(new Person(1, "Marcello", "M", true, "", italian));
        this.personRepository.save(new Person(2, "Mary", "W", true, "Good Girld", greek));
//        this.personRepository.save(new Person(3, "Jon", "M", false, "Good Boy", british));
//        this.personRepository.save(new Person(4, "James", "M", true, "", british));
//        this.personRepository.save(new Person(5, "Johanna", "W", true, "", german));
//        this.personRepository.save(new Person(6, "George", "M", false, "", british));
        
        logger.info("{} Persons have been added", this.personRepository.count());
	}

}
