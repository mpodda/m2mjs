package com.mpodda.m2m_js.service;

import java.util.List;

import com.mpodda.m2m_js.domain.Person;
import com.mpodda.m2m_js.repository.AbstractJpaDao;
import com.mpodda.m2m_js.repository.PersonRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonService extends IdentifiableEntityService<Person> {
    private PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<Person> updatePersons(List<Person> persons) {
        persons.forEach(person -> {
            person = this.personRepository.update(person);
        });
        return persons;
    }

    @Override
    public AbstractJpaDao<Person> getRepository() {
        return this.personRepository;
    }
}