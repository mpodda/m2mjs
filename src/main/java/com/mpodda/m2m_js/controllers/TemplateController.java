package com.mpodda.m2m_js.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TemplateController {
	
	@RequestMapping("/templates/gridTemplates")
	public String gridTemplates() {
		return "application/templates/gridTemplates";
	}

	@RequestMapping("/templates/formTemplates")
	public String formTemplates() {
		return "application/templates/formTemplates";
	}
	
}
