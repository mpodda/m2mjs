async function renderGrid(template, dataList) {
	return new Promise(async (resolve, reject) => {
		let myGrid = new M2MJS_Grid(dataList,
			document.getElementById("personDataContainer"),
			template);

		myGrid.renderers = [{
			"name": "genderRenderer",
			"code": function (element, modelObject) {
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
			"code": function (element, modelObject) {
				if (modelObject.active) {
					element.innerHTML = "Active";
				} else {
					element.innerHTML = "Not Active";
				}
			}
		}];

		myGrid.renderGrid();

		resolve(true);
	});
}

async function loadData() {
	let template = await loadGridTemplate("gridWithRenderersTemplate");
	let persons = await allPersons();
	await renderGrid(template, persons);
}

async function init() {
	await loadData();
}

(async () => {
	await init();
}
)();
