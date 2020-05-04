package com.mpodda.m2m_js.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mpodda.m2m_js.domain.Person;
import com.mpodda.m2m_js.repository.PersonRepository;

@Controller
public class GridController {
	private PersonRepository personRepository;

	@Autowired
	public GridController(PersonRepository personRepository) {
		this.personRepository = personRepository;
	}

	@RequestMapping("/simpleGrid")
	public String simpleGrid() {
		return "application/grid/simpleGrid";
	}

	@RequestMapping("/gridWithRenderers")
	public String gridWithRenderers() {
		return "application/grid/gridWithRenderers";
	}

	@RequestMapping("/gridWithEditableComponents")
	public String gridWithEditableComponents() {
		return "application/grid/gridWithEditableComponents";
	}

	@RequestMapping("/gridWithPaging")
	public String gridWithPaging() {
		return "application/grid/gridWithPaging";
	}

	@RequestMapping("/sortableGrid")
	public String sortableGrid() {
		return "application/grid/sortableGrid";
	}
}