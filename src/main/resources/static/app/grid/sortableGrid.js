
async function renderGrid(template, dataList) {
	return new Promise(async (resolve, reject) => {

		let myGrid = new M2MJS_Grid(dataList,
			document.getElementById("personDataContainer"),
			template);

		myGrid.enableSorting("sortasc", "sortdesc");

		myGrid.addSortColumn(new M2MJS_SortableColumn(
			document.getElementById("sortableId"),
			M2MJS_Sort.SortDataTypes.numeric,
			M2MJS_Sort.SortTypes.ascending,
			"id"
		));

		myGrid.addSortColumn(new M2MJS_SortableColumn(
			document.getElementById("sortableName"),
			M2MJS_Sort.SortDataTypes.alphanumeric,
			M2MJS_Sort.SortTypes.ascending,
			"name"
		));

		myGrid.addSortColumn(new M2MJS_SortableColumn(
			document.getElementById("sortableNationality"),
			M2MJS_Sort.SortDataTypes.alphanumeric,
			M2MJS_Sort.SortTypes.ascending,
			"nationality.description"
		));

		myGrid.renderGrid();

	});
}

async function loadData() {
	const template = await loadGridTemplate("sortableGridTemplate");
	const persons = await allPersons();

	await renderGrid(template, persons);
}

async function init() {
	await loadData();
}

(async () => {
	await init();
}
)();