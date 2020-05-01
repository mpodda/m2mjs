package com.mpodda.m2m_js.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mpodda.m2m_js.domain.Nationality;
import com.mpodda.m2m_js.domain.Person;
import com.mpodda.m2m_js.repository.NationalityRepository;
import com.mpodda.m2m_js.repository.PersonRepository;

@Controller
public class FormController {
	private PersonRepository personRepository;
	private NationalityRepository nationalityRepository;
	
	@Autowired
	public FormController (PersonRepository personRepository, NationalityRepository nationalityRepository){
		this.personRepository = personRepository;
		this.nationalityRepository = nationalityRepository;
	}

	
	@RequestMapping("/simpleFormWithValidation")
	public String simpleFormWithValidation(){
		return "/application/form/simpleFormWithValidation";
	}
	
	@RequestMapping("/viewPerson/{id}")
	public String viewPerson(@PathVariable Integer id, Model model){
		model.addAttribute("id", id);
		
		return "/application/form/simpleViewForm";
	}
	
	@RequestMapping("/editPerson/{id}")
	public String editPerson(@PathVariable Integer id, Model model){
		model.addAttribute("id", id);
		
		return "/application/form/simpleEditForm";
	}
	
	@RequestMapping("/person/{id}")
	public @ResponseBody Person loadPerson(@PathVariable Integer id, Model model){
		return this.personRepository.findById(id).get();
	}
	
	@RequestMapping("/person/new")
	public @ResponseBody Person newPerson(){
		return new Person();
	}
	
	@RequestMapping("/nationalities")
	public @ResponseBody Iterable<Nationality> loadNationalities() {
		return this.nationalityRepository.findAll();
	}
	
	@RequestMapping(value="/savePerson", method = RequestMethod.POST)
	public @ResponseBody Person savePerson(@RequestBody Person person){
		return personRepository.save(person);
	}

	@RequestMapping(value="/savePersons", method = RequestMethod.POST)
	public @ResponseBody List<Person> savePersons(@RequestBody List<Person> persons){
		persons.forEach(person -> {
			person = personRepository.save(person);
		});
		
		return persons;
	}
	
}
