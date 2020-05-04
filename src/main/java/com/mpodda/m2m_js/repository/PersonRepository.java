package com.mpodda.m2m_js.repository;

import javax.transaction.Transactional;

import com.mpodda.m2m_js.domain.Person;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
@Transactional
public class PersonRepository extends AbstractJpaDao<Person> {

    @Override
    protected Class<Person> getEntityBean() {
        return Person.class;
    }

}