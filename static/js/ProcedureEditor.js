class ProcedureEditor {
    constructor() {
        
        this.currId = 2;

        this.procedureObjs = [
            { id: 0, name: 'procedure-1', params: [{ id: 0, name: 'arr' }, { id: 1, name: 'x'}] },
            { id: 1, name: 'procedure-2', params: [{ id: 0, name: 'letter' }, { id: 1, name: 'y'}] },
            { id: 2, name: 'procedure-3', params: [{ id: 0, name: 'z' }, { id: 1, name: 'okej'}] }
        ];

        this.currentProcedure = this.procedureObjs[0];
        this.params = this.currentProcedure.params;

        this.ul = document.getElementById('procedure-arguments');
        this.procedureName = document.getElementById('procedure-name');
        this.procedureName.addEventListener('input', e => {
            this.currentProcedure.name = e.target.value;
            this.init();
        });
        this.procedures = document.getElementById('procedures');
        this.procedures.addEventListener('change', e => {
            this.currentProcedure = this.procedureObjs.find(p => p.id === +e.target.value);
            this.params = this.currentProcedure.params;
            this.init();
        });

        this.init();
    }

    init() {
        this.ul.innerHTML = '';
        this.procedureName.value = this.currentProcedure.name;

        const addArgumentSpan = document.createElement('span');
        addArgumentSpan.classList.add('add-argument');

        const i = document.createElement('i');
        i.classList.add('fa-solid', 'fa-plus');
        i.addEventListener('click', () => {
            this.params.push({ id: this.currId++,  name: 'name' });
            this.init();
        });

        addArgumentSpan.appendChild(i);
        this.ul.appendChild(addArgumentSpan);

        this.displayArguments();
        this.setProcedures();
    }

    setProcedures() {
        this.procedures.innerHTML = '';
        this.procedureObjs.forEach(({name, id}) => {
            const option = document.createElement('option');
            option.innerText = name;
            option.value = id;
            if (this.currentProcedure.id === id)
                option.selected = true;
            this.procedures.appendChild(option);
        });
    }

    displayArguments() {
        this.params.forEach(({name, id}) => {
            const li = document.createElement('li');
            li.classList.add('procedure-argument');

            const input = document.createElement('input');
            input.classList.add('procedure-argument-input');
            input.type = 'text';
            input.value = name;
            input.addEventListener('input', e => {
                this.resizeInput(e.target);
                this.currentProcedure.params.find(p => p.id === id).name = e.target.value;
            });
            this.resizeInput(input);

            const i = document.createElement('i');
            i.classList.add('fa-solid', 'fa-xmark');
            i.addEventListener('click', () => {
                this.params = this.params.filter(p => p.id !== id);
                this.currentProcedure.params = this.params;
                this.init();
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
