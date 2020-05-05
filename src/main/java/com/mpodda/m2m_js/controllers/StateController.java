package com.mpodda.m2m_js.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class StateController {
    @RequestMapping("/updateOnStateChange")
    public String updateOnStateChange() {
        return "application/state/updateOnStateChange";
    }

}