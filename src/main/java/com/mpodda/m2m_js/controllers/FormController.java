package com.mpodda.m2m_js.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FormController {

	@RequestMapping("/simpleFormWithValidation")
	public String simpleFormWithValidation() {
		return "/application/form/simpleFormWithValidation";
	}

	@RequestMapping("/viewPerson/{id}")
	public String viewPerson(@PathVariable Long id, Model model) {
		model.addAttribute("id", id);

		return "/application/form/simpleViewForm";
	}

	@RequestMapping("/editPerson/{id}")
	public String editPerson(@PathVariable Long id, Model model) {
		model.addAttribute("id", id);

		return "/application/form/simpleEditForm";
	}
}
