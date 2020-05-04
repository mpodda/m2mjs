package com.mpodda.m2m_js.rest;

import java.util.List;

import com.mpodda.m2m_js.domain.Person;
import com.mpodda.m2m_js.service.PersonService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PersonRestController {
    private PersonService personService;

    @Autowired
    public PersonRestController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping("/persons")
    public ResponseEntity<?> allPersons() {
        try {
            return new ResponseEntity<>(this.personService.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/person/{id}")
    public ResponseEntity<?> getPerson(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(this.personService.findOne(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/person/create")
    public ResponseEntity<?> createNewPerson() {
        try {
            return new ResponseEntity<>(this.personService.createNew(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/person/save")
    public ResponseEntity<?> createPerson(@RequestBody Person person) {
        try {
            return new ResponseEntity<>(this.personService.create(person), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/person/save")
    public ResponseEntity<?> updatePerson(@RequestBody Person person) {
        try {
            return new ResponseEntity<>(this.personService.update(person), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/persons/save")
    public ResponseEntity<?> updatePersons(@RequestBody List<Person> persons) {
        try {
            return new ResponseEntity<>(this.personService.updatePersons(persons), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
