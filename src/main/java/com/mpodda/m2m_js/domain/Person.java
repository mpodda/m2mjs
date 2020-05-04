package com.mpodda.m2m_js.domain;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

@Entity
public class Person extends IdentifiableEntity {
	private static final long serialVersionUID = -7402513628088030502L;

	private String name;
	private String gender;
	private Boolean active;
	private String comments;

	@ManyToOne(fetch = FetchType.EAGER)
	private Nationality nationality;

	public Person() {

	}

	public Person(String name, String gender, Boolean active, String comments) {
		this.name = name;
		this.gender = gender;
		this.active = active;
		this.comments = comments;
	}

	public Person(String name, String gender, Boolean active, String comments, Nationality nationality) {
		this.name = name;
		this.gender = gender;
		this.active = active;
		this.comments = comments;
		this.nationality = nationality;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Nationality getNationality() {
		return nationality;
	}

	public void setNationality(Nationality nationality) {
		this.nationality = nationality;
	}

	@Override
	public String toString() {
		return String.format("id=%s  name=%s  gender=%s  active=%s  comments=%s  [nationality=%s]", id, name, gender,
				active, comments, nationality);
	}
}
