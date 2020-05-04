/* 
 ----------
 -- Grid --
 ----------  
 */

let persons;
let personForm;
let personViewForm;
let myGrid;
let personValidator = new M2MJS_Validator();

async function initGrid() {
	let template = await loadGridTemplate("simpleGridTemplate"); //M2MJS_TemplateLoader.loadTemplate(templatePath, "simpleGridTemplate");
	persons = await allPersons();
	return await renderGrid(template, persons);
}

async function renderGrid(template, dataList) {
	return new Promise((resolve, reject) => {
		myGrid = new M2MJS_Grid(dataList, document.getElementById("personDataContainer"), template);

		myGrid.renderers = [
			{
				"name": "showPersonInfo",
				"code": async (element, objectValue, gr) => {
					M2MJS_XBrowser.addHandler(element, "click", async (e) => {
						await renderViewForm(objectValue);
					});

				}
			},
			{
				"name": "editPerson",
				"code": async (element, objectValue, gr) => {
					M2MJS_XBrowser.addHandler(element, "click", async (e) => {
						await renderEditForm(objectValue);
					});

				}
			}
		];

		myGrid.renderGrid();

		resolve(true);
	});
}

/* 
 ----------
 -- Form --
 ----------  
 */

async function loadEditFormTemplate() {
	return await loadFormTemplate("editPersonTemplate");
}

async function loadViewFormTemplate() {
	return await loadFormTemplate("viewPersonTemplate");
}

async function renderEditForm(person) {
	await personValidator.clearErrors().then(personForm.modelObject = await getPerson(person.id));
}

async function renderCreateForm(person) {
	await personValidator.clearErrors().then(personForm.modelObject = person);
}

async function renderViewForm(person) {
	personViewForm.modelObject = await getPerson(person.id);
}


async function initEditForm() {
	return new Promise(async (resolve, reject) => {
		let formTemplate = await loadEditFormTemplate();
		let nationalities = await allNationalities();

		document.getElementById("formPlaceHolder").appendChild(formTemplate);

		personForm = new M2MJS_Form();

		personForm.addComponent(new M2MJS_Component("id", document.getElementById("personId")));
		personForm.addComponent(new M2MJS_Component("name", document.getElementById("personName")));
		personForm.addComponent(new RadioSet("gender", document.getElementsByName("personGender")));

		let nationalitySelectComponent = new SelectComponent(document.getElementById("personNationality"));
		nationalitySelectComponent.renderChoices(nationalities, "id", "description");
		nationalitySelectComponent.id = "nationality";
		personForm.addComponent(nationalitySelectComponent);

		personForm.addComponent(new ActivationButton("active", document.getElementById("personActive")));
		personForm.addComponent(new M2MJS_Component("comments", document.getElementById("personComments")));

		defineValidations();

		resolve(true);
	});
}

async function initViewForm() {
	return new Promise(async (resolve, reject) => {
		let viewFormTemplate = await loadViewFormTemplate();

		document.getElementById("viewFormPlaceHolder").appendChild(viewFormTemplate);

		personViewForm = new M2MJS_Form();

		personViewForm.addComponent(new M2MJS_Component("id", document.getElementById("personIdView")));
		personViewForm.addComponent(new M2MJS_Component("name", document.getElementById("personNameView")));
		personViewForm.addComponent(new GenderView("gender", document.getElementById("personGenderView")));
		personViewForm.addComponent(new NationalityView("nationality", document.getElementById("personNationalityView")));
		personViewForm.addComponent(new ActiveStatusView("active", document.getElementById("personActiveView")));
		personViewForm.addComponent(new M2MJS_Component("comments", document.getElementById("personCommentsView")));

		resolve(true);
	});
}

async function initEvents() {
	M2MJS_XBrowser.addHandler(document.getElementById("btnAddPerson"), "click", async (e) => {
		let person = await createNewPerson();
		await renderCreateForm(person);
	});
}

function defineValidations() {
	/* Display all errors*/
	personValidator.shortCircuitErrors = false;

	/* Name */
	let pNameField = new M2MJS_Field();
	pNameField.addElement(document.getElementById("personName"));
	pNameField.affectElement = document.getElementById("personNameErrorLabel");
	pNameField.mandatoryViolationErrorMessage = "'Name' should not be empty";

	personValidator.addField(pNameField);

	/* Gender */
	let pGenderField = new M2MJS_Field();
	pGenderField.addElement(document.getElementById("personGenderManRadio"));
	pGenderField.addElement(document.getElementById("personGenderWomanRadio"));
	pGenderField.affectElement = document.getElementById("personGenderErrorLabel");
	pGenderField.mandatoryViolationErrorMessage = "'Gender' should not be empty";

	personValidator.addField(pGenderField);


	/* Nationality */
	let pNationalityField = new M2MJS_Field();
	pNationalityField.addElement(document.getElementById("personNationality"));
	pNationalityField.emptyValueForSelect = "";
	pNationalityField.affectElement = document.getElementById("personNationalityErrorLabel");
	pNationalityField.mandatoryViolationErrorMessage = "'Nationality' should not be empty";

	personValidator.addField(pNationalityField);

	/* Active */
	let pActiveField = new M2MJS_Field();
	pActiveField.component = personForm.getComponent("active");
	pActiveField.affectElement = document.getElementById("personActiveStatusErrorLabel");
	pActiveField.mandatoryViolationErrorMessage = "'Active Status' should not be empty";

	personValidator.addField(pActiveField);

    /*
     ------------
     -- Events --
     ------------
    */

	personValidator.onError = async (field, index) => {
		if (personValidator.shortCircuitErrors && index == 1) {
			field.affectElement.innerHTML = field.currentErrorMessage;
		} else {
			if (!personValidator.shortCircuitErrors) {
				field.affectElement.innerHTML = field.currentErrorMessage;
			}
		}

	};

	personValidator.onValidationOk = async (field) => {
		field.affectElement.innerHTML = '';
	};

}

async function savePerson(person) {
	let isValid = await personValidator.validate();

	if (isValid) {
		if (isCreateOperation(person.id)) {
			return await createPerson(person);
		}

		return await updatePerson(person);
	} else {
		return new Promise((resolve, reject) => {
			reject("Not Valid");
		});
	}
}

M2MJS_XBrowser.addHandler(document.getElementById("btnSave"), "click", (e) => savePersonEvent());

async function savePersonEvent(e) {
	await savePerson(personForm.modelObject).then(
		async (person) => {
			myGrid.dataList = await allPersons();
		}
	);

	$("#myModal").modal('hide');
}


/*
  ---------- 
  -- Init --
  ----------
 */

async function init() {
	await initEditForm();
	await initViewForm();
	await initGrid();
	await initEvents();
}

(async () => {
	await init();
}
)();