package com.mpodda.m2m_js;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableAutoConfiguration
@EntityScan(basePackages = {"com.mpodda.m2m_js.domain"})
@EnableJpaRepositories(basePackages = {"com.mpodda.m2m_js.repository"})
public class RepositoryConfiguration {
	
}