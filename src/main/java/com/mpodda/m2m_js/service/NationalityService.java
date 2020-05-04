package com.mpodda.m2m_js.service;

import com.mpodda.m2m_js.domain.Nationality;
import com.mpodda.m2m_js.repository.AbstractJpaDao;
import com.mpodda.m2m_js.repository.NationalityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NationalityService extends IdentifiableEntityService<Nationality> {
    private NationalityRepository nationalityRepository;

    @Autowired
    public NationalityService(NationalityRepository nationalityRepository) {
        this.nationalityRepository = nationalityRepository;
    }

    @Override
    public AbstractJpaDao<Nationality> getRepository() {
        return this.nationalityRepository;
    }

}