class ProcedureEditor {

    static #instance = null;

    static getInstance() {
        if (ProcedureEditor.#instance === null) {
            ProcedureEditor.#instance = new ProcedureEditor();
        }
        return ProcedureEditor.#instance;
    }

    constructor() {
        this.procedureObjs = [];
        this.currentProcedure = null;
        this.params = null;

        this.ul = document.getElementById('procedure-arguments');
        this.procedureName = document.getElementById('procedure-name');
        this.procedures = document.getElementById('procedures');
        this.bodyTextarea = document.getElementById('editor-textarea');
        this.saveButton = document.getElementById('save-procedure');
        this.editorSection = document.getElementById('section-editor');
        this.overlay = document.getElementById('editor-overlay');
        this.overlay.style.display = 'none';
        this.init();
    }

    addListeners() {
        this.procedureName.addEventListener('input', e => {
            this.currentProcedure.newName = e.target.value;
            this.reloadProcedures();
        });

        this.procedures.addEventListener('change', e => {
            this.currentProcedure = this.procedureObjs.find(p => p.lastName === e.target.value);
            console.log(this.procedureObjs);
            this.params = this.currentProcedure.params;
            this.reloadProcedures();
        });

        this.saveButton.addEventListener('click', () => {
            this.procedureObjs = this.procedureObjs.filter(p => p.lastName !== this.currentProcedure);
            window.logoInterpreter.saveProcedure(this.currentProcedure);
            const pop = document.getElementById('popup');
            pop.textContent = 'Zapisano procedurę';
            pop.style.transform = 'translateX(0)';
            this.reloadProcedures();
            setTimeout(() => pop.style.transform = 'translateX(-200%)', 1500);
        });
    }

    uniqValues() {
        const uniques = [];
        this.procedureObjs.forEach(p => {
            if (!uniques.some(u => u.lastName === p.lastName))
                uniques.push(p);
        });
        this.procedureObjs = uniques;
    }

    setProcedure(name, agrNames, body) {
        const obj = {lastName: name, newName: name, params: agrNames, body};
        this.procedureObjs.push(obj);
        this.currentProcedure = obj;
        console.log(this.procedureObjs);
        this.reloadProcedures();
    }

    init() {
        this.reloadProcedures();
        this.addListeners();
    }

    setProcedures() {
        this.procedures.innerHTML = '';
        this.procedureObjs.forEach(({lastName}) => {
            const option = document.createElement('option');
            option.innerText = lastName;
            if (this.currentProcedure.lastName === lastName)
                option.selected = true;
            this.procedures.appendChild(option);
        });
    }

    reloadProcedures() {
        if (!this.procedureObjs.length) {
            this.overlay.style.display = 'grid';
            return;
        }

        this.overlay.style.display = 'none';
        this.ul.innerHTML = '';
        console.log(this.currentProcedure.lastName);
        this.procedureName.value = this.currentProcedure.newName;

        const addArgumentSpan = document.createElement('span');
        addArgumentSpan.classList.add('add-argument');

        const i = document.createElement('i');
        i.classList.add('fa-solid', 'fa-plus');
        i.addEventListener('click', () => {
            this.currentProcedure.params.push('name');
            this.reloadProcedures();
        });

        addArgumentSpan.appendChild(i);
        this.ul.appendChild(addArgumentSpan);

        this.bodyTextarea.innerHTML = this.currentProcedure.body;

        this.displayArguments();
        this.uniqValues();
        this.setProcedures();
    }

    displayArguments() {
        this.currentProcedure.params.forEach(n => {
            const li = document.createElement('li');
            li.classList.add('procedure-argument');

            const input = document.createElement('input');
            input.classList.add('procedure-argument-input');
            input.type = 'text';
            input.value = n;
            input.addEventListener('input', e => {
                this.resizeInput(e.target);
                for (let i = 0; i < this.currentProcedure.params.length; i++) {
                    if (this.currentProcedure.params[i] === n)
                        this.currentProcedure.params[i] = e.target.value;
                }
            });
            this.resizeInput(input);

            const i = document.createElement('i');
            i.classList.add('fa-solid', 'fa-xmark');
            i.addEventListener('click', () => {
                this.currentProcedure.params = this.currentProcedure.params.filter(p => p !== n);
                this.reloadProcedures();
            });

            li.appendChild(input);
            li.appendChild(i);

            this.ul.insertBefore(li, this.ul.firstChild);
        });
    }

    resizeInput(obj) {
        obj.style.width = `${obj.value.length + 1}ch`;
    }
}

export default ProcedureEditor;
