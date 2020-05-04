package com.mpodda.m2m_js.repository;

import javax.transaction.Transactional;

import com.mpodda.m2m_js.domain.Nationality;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
@Transactional
public class NationalityRepository extends AbstractJpaDao<Nationality> {
    @Override
    protected Class<Nationality> getEntityBean() {
        return Nationality.class;
    }
}