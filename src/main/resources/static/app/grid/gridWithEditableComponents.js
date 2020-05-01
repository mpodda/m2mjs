new Promise((resolve, reject) => {
	let template;
	let nationalities;
	let myGrid;
	
	setTimeout(() => resolve (
		M2MJS.TemplateLoader.loadTemplate(templatePath, "gridWithEditableComponentsTemplate").then((response) => {
			template = response;
		})
		.then(setTimeout(() => {
			M2MJS.Connection.get(loadNationalitiesUrl).then((response) => {
				nationalities = response.data;
			})
		}), 125)
		.then(() => {
			M2MJS.Connection.get(loadPersonsUrl).then((response) => {
				myGrid = new M2MJS.Grid(response.data,
				        document.getElementById("personDataContainer"),
				        template);
				
				myGrid.renderers = [{
				            "name": "genderRenderer",
				            "code": (element, modelObject) => {
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
				            "code": (element, modelObject) => {
				                if (modelObject["active"] == true) {
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
		                    gr.form.addComponent(new M2MJS.Component(id, element));
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
			})			
		})		
	), 250);
	
	M2MJS.XBrowser.addHandler(document.getElementById("btnShowGridData"), "click", (e) => {
		console.info(JSON.stringify(myGrid.gridModel));
	    alert(JSON.stringify(myGrid.gridModel));
	});
	
	M2MJS.XBrowser.addHandler(document.getElementById("btnSaveData"), "click", (e) => {
		setTimeout(() => {
			M2MJS.Connection.post(savePersonsUrl, myGrid.gridModel).then((response) => {
				alert("Saved successfully");
			}).catch (
				(error) => {
					alert("Error saving persons: " + JSON.stringify (error));
				}
			) 
		});
	});
	
});