async function loadPerson(person) {
	return new Promise((resolve, reject) => {
		M2MJS.Connection.get(loadPersonUrl + "/" + person["id"]).then((response) => {
			resolve (response.data);
		})
	});
}

async function loadPersons() {
	return new Promise((resolve, reject) => {
		M2MJS.Connection.get(loadPersonsUrl).then((response) => {
			resolve (response.data);
		})
	});
}
