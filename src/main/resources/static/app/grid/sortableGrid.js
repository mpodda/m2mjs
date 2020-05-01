/*
var m2mjs = new M2MJS();
var grid = {};
var myGrid;

var templateLoader = new M2MJS_COMMON.TemplateLoader([[@{/templates/gridTemplates}]]);
var template = templateLoader.loadTemplate("sortableGridTemplate");

var c = {};

var cn = M2MJS_COMMON.Connection(c);
c.config({url: [[@{/grid/loadPersons}]],
    async: true
}).connect();

c.onResponse = function () {
    var results = c.getResponseJson();

    myGrid = new m2mjs.Grid(results,
        document.getElementById("personDataContainer"),
        template,
        grid, null);

    myGrid.renderGrid();

    myGrid.Sort.init({
        sortAscendingClass: "sortasc",
        sortDescendingClass: "sortdesc"
    });

    myGrid.Sort.addColumn({
        element: document.getElementById("sortableId"),
        sortDataType: myGrid.Sort.getSortDataTypes().numeric,
        sortType: myGrid.Sort.getSortTypes().ascending,
        dataProperty: "id"
    });

    myGrid.Sort.addColumn({
        element: document.getElementById("sortableName"),
        sortType: myGrid.Sort.getSortTypes().ascending,
        dataProperty: "name"
    });

    myGrid.Sort.addColumn({
        element: document.getElementById("sortableNationality"),
        sortType: myGrid.Sort.getSortTypes().ascending,
        dataProperty: "nationality.description"
    });
}
*/



new Promise((resolve, reject) => {
	let template;
	
	setTimeout(() => resolve (
		M2MJS.TemplateLoader.loadTemplate(templatePath, "sortableGridTemplate").then((response) => {
			template = response;
		})
		.then(() => {
			M2MJS.Connection.get(loadPersonsUrl).then((response) => {
				persons = response.data;
				myGrid = new M2MJS.Grid(persons,
				        document.getElementById("personDataContainer"),
				        template);
				
				
				myGrid.renderGrid();
				
				myGrid.enableSorting("sortasc", "sortdesc");
				
				myGrid.addSortColumn(new M2MJS.Grid.Sort.SortableColumn (
					document.getElementById("sortableId"),
					M2MJS.Grid.Sort.SortDataTypes.numeric,
					M2MJS.Grid.Sort.SortTypes.ascending,
					"id"
				));
				
				myGrid.addSortColumn(new M2MJS.Grid.Sort.SortableColumn (
						document.getElementById("sortableName"),
						M2MJS.Grid.Sort.SortDataTypes.alphanumeric,
						M2MJS.Grid.Sort.SortTypes.ascending,
						"name"
					));

				myGrid.addSortColumn(new M2MJS.Grid.Sort.SortableColumn (
						document.getElementById("sortableNationality"),
						M2MJS.Grid.Sort.SortDataTypes.alphanumeric,
						M2MJS.Grid.Sort.SortTypes.ascending,
						"nationality.description"
					));
				
			})			
		})		
	), 125);
});