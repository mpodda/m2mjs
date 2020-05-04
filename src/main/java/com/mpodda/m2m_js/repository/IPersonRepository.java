package com.mpodda.m2m_js.repository;

import org.springframework.data.repository.CrudRepository;

import com.mpodda.m2m_js.domain.Person;

public interface IPersonRepository extends CrudRepository<Person, Integer> {

}
