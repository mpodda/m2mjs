/* 
	---------------------
	-- REST End points --
	---------------------
*/

const templatePath = `${contextPath}templates/gridTemplates`;
const formTemplatePath = `${contextPath}templates/formTemplates`;

const loadPersonsUrl = `${contextPath}persons`;
const loadPersonUrl = `${contextPath}person`;
const savePersonsUrl = `${contextPath}persons/save`;
const createNewPersonUrl = `${contextPath}person/create`;
const createPersonUrl = `${contextPath}person/save`;
const updatePersonUrl = `${contextPath}person/save`;
const updatePersonsUrl = `${contextPath}persons/save`;

const loadNationalitiesUrl = `${contextPath}nationalities`;

const manImage = `${contextPath}images/man_2.png`;
const womanImage = `${contextPath}images/woman.png`;

/* 
	-----------------------
	-- / REST End points --
	-----------------------
*/




/* 
	------------------------
	-- General Operations --
	------------------------
*/
async function loadGridTemplate(templateId) {
	return await M2MJS_TemplateLoader.loadTemplate(templatePath, templateId);
}

async function loadFormTemplate(templateId) {
	return await M2MJS_TemplateLoader.loadTemplate(formTemplatePath, templateId);
}



async function load(url) {
	return new Promise((resolve, reject) => {
		M2MJS_Connection.get(url).then((response) => {
			resolve(response.data);
		});
	});
}

async function loadById(url, id) {
	return new Promise((resolve, reject) => {
		M2MJS_Connection.get(`${url}/${id}`).then((response) => {
			resolve(response.data);
		});
	});
}


async function createNew(url) {
	return new Promise((resolve, reject) => {
		M2MJS_Connection.get(url).then((response) => {
			resolve(response.data);
		});
	});
}

async function create(url, object) {
	return new Promise((resolve, reject) => {
		M2MJS_Connection.post(url, object).then((response) => {
			resolve(response.data);
		});
	});
}

async function update(url, object) {
	return new Promise((resolve, reject) => {
		M2MJS_Connection.put(url, object).then((response) => {
			resolve(response.data);
		});
	});
}

function isCreateOperation(id) {
	if (id === '') {
		return true;
	}

	return false;
}
/*
	------------------------
	-- General Operations --
	------------------------
*/


/*
	-----------------------
	-- Person Operations --
	----------------- -----
*/

async function createNewPerson() {
	return await createNew(createNewPersonUrl);
}

async function allPersons() {
	return await load(loadPersonsUrl);
}

async function getPerson(id) {
	return await loadById(loadPersonUrl, id);
}

async function createPerson(person) {
	return await create(createPersonUrl, person);
}

async function updatePerson(person) {
	return await update(updatePersonUrl, person);
}

async function updatePersons(persons) {
	return await update(updatePersonsUrl, persons);
}


/*
	-------------------------
	-- / Person Operations --
	------------------- -----
*/


/*
	----------------------------
	-- Nationality Operations --
	----------------- ----------
*/

async function allNationalities() {
	return await load(loadNationalitiesUrl);
}

/*
	------------------------------
	-- / Nationality Operations --
	------------------- ----------
*/