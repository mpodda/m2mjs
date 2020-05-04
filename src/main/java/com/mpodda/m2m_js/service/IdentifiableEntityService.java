package com.mpodda.m2m_js.service;

import java.util.List;

import com.mpodda.m2m_js.domain.IdentifiableEntity;
import com.mpodda.m2m_js.repository.AbstractJpaDao;

public abstract class IdentifiableEntityService<E extends IdentifiableEntity> {
	public abstract AbstractJpaDao<E> getRepository();

	public E createNew() {
		return this.getRepository().createEntity();
	}

	public E create(E entity) {
		return this.getRepository().save(entity);
	}

	public E update(E entity) {
		return this.getRepository().merge(entity);
	}

	public void delete(E entity) {
		this.getRepository().delete(this.getRepository().findOne(entity.getId()));
	}

	public List<E> findAll() {
		return this.getRepository().findAll();
	}

	public E get(E entity) {
		return this.getRepository().findOne(entity.getId());
	}

	public E findOne(Long id) {
		return this.getRepository().findOne(id);
	}

	public int count() {
		return this.getRepository().count();
	}
}