package com.mpodda.m2m_js.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MenuController {
	
	@RequestMapping("/")
	public String home() {
		return "application/home";
	}
	
	@RequestMapping("/about")
	public String about() {
		return "application/about";
	}

	@RequestMapping("/contact")
	public String contact() {
		return "application/contact";
	}
	
	@RequestMapping("/grid")
	public String grid() {
		return "application/grid/index";
	}
	
	@RequestMapping("/form")
	public String form() {
		return "application/form/index";
	}	
	
}
