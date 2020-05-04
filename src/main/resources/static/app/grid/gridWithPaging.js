/*
	------------
	-- Events --
	------------
*/

M2MJS_XBrowser.addHandler(document.getElementById("btnShowGridData"), "click", (e) => {
	console.info(JSON.stringify(myGrid.gridModel));
	alert(JSON.stringify(myGrid.gridModel));
});

/*
	--------------
	-- / Events --
	--------------
*/

let myGrid = null;

async function renderGrid(template, dataList, nationalities) {
	return new Promise(async (resolve, reject) => {
		let paginator = new M2MJS_Paginator(dataList.length, 3,
			document.getElementById("btnfirstPage"),
			document.getElementById("btnPreviousPage"),
			document.getElementById("btnNextPage"),
			document.getElementById("btnLastPage"),
			document.getElementById("currentPageText"),
			document.getElementById("totalPagesText")
		);

		myGrid = new M2MJS_Grid(dataList,
			document.getElementById("personDataContainer"),
			template,
			paginator);

		myGrid.renderers = [{
			"name": "genderRenderer",
			"code": (element, modelObject) => {
				if (modelObject.gender === "M") {
					let image = new Image();
					image.src = manImage;
					image.title = "Men";

					element.appendChild(image);
				}

				if (modelObject.gender === "W") {
					let image = new Image();
					image.src = womanImage;
					image.title = "WomenMen";

					element.appendChild(image);
				}
			}
		},
		{
			"name": "active",
			"code": (element, modelObject) => {
				if (modelObject.active) {
					element.innerHTML = "Active";
				} else {
					element.innerHTML = "Not Active";
				}
			}
		}];

		myGrid.components = [
			{
				"id": "comments",
				"code": function (gr, id, element, objectValue) {
					gr.form.addComponent(new M2MJS_Component("comments", (element.querySelector(`#comments_${gr.model.id}`))));
					//gr.form.addComponent(new M2MJS_Component("comments", M2MJS_XBrowser.getElement(element, `comments_${gr.model.id}`)));
				}
			},

			{
				"id": "nationality",
				"code": function (gr, id, element, objectValue) {
					element.innerHTML = "";

					let nationalitySelectElement = document.createElement("select");
					let nationalitySelectPrototype = new SelectComponent(nationalitySelectElement);
					nationalitySelectPrototype.renderChoices(nationalities, "id", "description");

					let selectElement = nationalitySelectElement.cloneNode(true);
					let nationalitySelectComponent = new SelectComponent(selectElement);
					nationalitySelectComponent.id = id;
					nationalitySelectComponent.idProperty = "id";
					nationalitySelectComponent.dataList = nationalities;

					element.appendChild(selectElement);

					gr.form.addComponent(nationalitySelectComponent);
				}
			}
		];

		myGrid.renderGrid();
	});
}

async function loadData() {
	const template = await loadGridTemplate("gridWithEditableComponentsTemplate"); //M2MJS_TemplateLoader.loadTemplate(templatePath, "gridWithEditableComponentsTemplate");

	const nationalities = await allNationalities();
	const persons = await allPersons();

	await renderGrid(template, persons, nationalities);
}

async function init() {
	await loadData();
}

(async () => {
	await init();
}
)();