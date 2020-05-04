package com.mpodda.m2m_js.rest;

import com.mpodda.m2m_js.service.NationalityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NationalityRestController {
    private NationalityService nationalityService;

    @Autowired
    public NationalityRestController(NationalityService nationalityService) {
        this.nationalityService = nationalityService;
    }

    @GetMapping("/nationalities")
    public ResponseEntity<?> allNationalities() {
        try {
            return new ResponseEntity<>(this.nationalityService.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}