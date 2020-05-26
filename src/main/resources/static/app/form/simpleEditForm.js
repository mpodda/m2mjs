console.info("Simple Edit Form");

(async () => {
    let person = await getPerson(5); //await createNewPerson();
    console.info("Person=", person);
    const template = await loadFromCurrentPage("editFormTemplate");

    document.getElementById("formPlaceHolder").appendChild(template);

    let nationalitySelectComponent = new SelectComponent(document.getElementById("personNationality"));
    nationalitySelectComponent.renderChoices(await allNationalities(), "id", "description");
    nationalitySelectComponent.id = "nationality";

    let calendarParameters = new CalendarParameters();
    calendarParameters.dateFormat = 'dd/MM/yyyy HH:mm';
    calendarParameters.isDateAndTime = true;

    let birthDateCalendar = new Calendar("birthDate", document.getElementById("personBirthDate"), document.getElementById("btnPersonBirthDate"), calendarParameters);
    birthDateCalendar.onValueSet = (value) => {
        document.querySelector("#personBirthDate").value = value;
    };

    let editForm = new M2MJS_Form();

    editForm.addComponent(new M2MJS_Component("id", document.getElementById("personId")));
    editForm.addComponent(new M2MJS_Component("name", document.getElementById("personName")));
    editForm.addComponent(birthDateCalendar);
    editForm.addComponent(new RadioSet("gender", document.getElementsByName("personGender")));
    editForm.addComponent(nationalitySelectComponent);
    editForm.addComponent(new ActivationButton("active", document.getElementById("personActive")));
    editForm.addComponent(new M2MJS_Component("comments", document.getElementById("personComments")));
    editForm.modelObject = person;

    async function savePerson(person) {
        if (isCreateOperation(person.id)) {
            return await createPerson(person);
        }

        return await updatePerson(person);
    }

    M2MJS_XBrowser.addHandler(document.getElementById("btnSaveData"), "click", async (e) => {
        await savePerson(editForm.modelObject).then(
            async (p) => {
                editForm.modelObject = p;
                alert("Saved successfully");
            }
        );

    });
}
)();



