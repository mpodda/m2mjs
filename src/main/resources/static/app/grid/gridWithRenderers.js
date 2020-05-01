new Promise((resolve, reject) => {
	let template;
	
	setTimeout(() => resolve (
		M2MJS.TemplateLoader.loadTemplate(templatePath, "gridWithRenderersTemplate").then((response) => {
			template = response;
		})
		.then(() => {
			M2MJS.Connection.get(loadPersonsUrl).then((response) => {
				let myGrid = new M2MJS.Grid(response.data,
				        document.getElementById("personDataContainer"),
				        template);
				
				myGrid.renderers = [{
				            "name": "genderRenderer",
				            "code": function (element, modelObject) {
				                if (modelObject["gender"] == "M") {
				                    var image = new Image();
				                    image.src = manImage;
				                    image.title = "Men";
				
				                    element.appendChild(image);
				                }
				
				                if (modelObject["gender"] == "W") {
				                    var image = new Image();
				                    image.src = womanImage;
				                    image.title = "WomenMen";
				
				                    element.appendChild(image);
				                }
				            }
				        },
				        {
				            "name": "active",
				            "code": function (element, modelObject) {
				                if (modelObject["active"] == true) {
				                    element.innerHTML = "Active";
				                } else {
				                    element.innerHTML = "Not Active";
				                }
				            }
				            }];					
				
				
				myGrid.renderGrid();
			})			
		})		
	), 125);
});
