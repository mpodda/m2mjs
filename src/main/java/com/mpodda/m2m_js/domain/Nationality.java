package com.mpodda.m2m_js.domain;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Nationality {
	@Id
	private Integer id;
	private String code;
	private String description;
	
    @OneToMany (fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = false,  mappedBy = "nationality")
    @JsonIgnore
    private Set<Person> persons;
	
	public Nationality() {
		
	}

	public Nationality(Integer id, String code, String description) {
		this.id = id;
		this.code = code;
		this.description = description;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
