keyCodes = Object.freeze({
    ENTER: 13
});

class Person {
    constructor(name = null) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}

let myGrid = null;

async function renderGrid(template, dataList) {
    return new Promise(async (resolve, reject) => {
        myGrid = new M2MJS_Grid(dataList,
            document.getElementById("namesPlaceHolder"),
            template);

        myGrid.renderers = [
            {
                "name": "deleteName",
                "code": function (element, modelObject, gridRow) {
                    M2MJS_XBrowser.addHandler(element.querySelector("#btnDelete"), "click", (e) => {
                        const index = dataList.indexOf(modelObject);
                        if (index > -1) {
                            dataList.splice(index, 1);
                            myGrid.dataList = dataList;
                        }
                    });
                }
            }
        ];

        myGrid.renderGrid();

        resolve(true);
    });
}

async function init() {
    let persons = [];

    const template = await M2MJS_TemplateLoader.loadTemplateFromCurrentPage("listTemplate");

    await renderGrid(template, persons);

    let personForm = new M2MJS_Form();
    personForm.addComponent(new M2MJS_Component("_name", document.getElementById("txtName")));

    let person = new Person();
    personForm.modelObject = person;

    M2MJS_XBrowser.addHandler(document.getElementById("txtName"), "keyup", async (e) => {
        if (e.keyCode === keyCodes.ENTER && document.getElementById("txtName").value.trim() != '') {
            persons.push(personForm.modelObject);

            myGrid.dataList = persons;
            person = new Person();
            personForm.modelObject = person;
        }
    });
}

(async () => {
    await init();
}
)();