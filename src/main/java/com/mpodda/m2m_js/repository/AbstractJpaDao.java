package com.mpodda.m2m_js.repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import com.mpodda.m2m_js.domain.IdentifiableEntity;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Repository;

@Repository
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
@Transactional
public abstract class AbstractJpaDao<T extends IdentifiableEntity> {
	@PersistenceContext
	protected EntityManager entityManager;

	protected abstract Class<T> getEntityBean();

	public T createEntity() {
		try {
			return this.getEntityBean().newInstance();
		} catch (InstantiationException | IllegalAccessException e) {
			return null;
		}
	}

	public T findOne(Long id) {
		return entityManager.find(this.getEntityBean(), id);
	}

	@SuppressWarnings("unchecked")
	public List<T> findAll() {
		return entityManager.createQuery("from " + this.getEntityBean().getName()).getResultList();
	}

	public T save(T entity) {
		entityManager.persist(entity);
		entityManager.flush();
		return this.findOne(entity.getId());
	}

	public T update(T entity) {
		return entityManager.merge(entity);
	}

	public T merge(T entity) {
		return entityManager.merge(entity);
	}

	public void delete(T entity) {
		entityManager.remove(entity);
	}

	public void deleteById(Long entityId) {
		T entity = findOne(entityId);
		delete(entity);
	}

	public int count() {
		return ((Number) entityManager
				.createQuery("select count(entity) from " + this.getEntityBean().getName() + " entity")
				.getSingleResult()).intValue();
	}
}