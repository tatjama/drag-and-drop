//START PROJECT STATE MANAGEMENT CLASS:
class ProjectState{
    private projects: any[];
    private static  instance: ProjectState;

    constructor(){
        this.projects = [];
    }

    static getInstance(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance
    }

    addProject(project: Project){        
        this.projects.push(project);
        console.log(this.projects);
        new ProjectList( 'active', this.projects)
    }
}
//Insure to have Single instance of project state
const projectState = ProjectState.getInstance();

//END PROJECT STATE MANAGEMENT CLASS
//START SHOW LIST OF PROJECTS CLASS

class ProjectList{
    type: string;
    templateElement: HTMLTemplateElement;
    element: HTMLElement;
    targetParent: HTMLElement;
    targetElement: HTMLUListElement;

    constructor(type: string, projects: Project[]){
        this.type = type;
        this.templateElement = document.getElementById('single-project') as HTMLTemplateElement;
        const templateElementClone: DocumentFragment = document.importNode(this.templateElement.content, true);
        this.element = templateElementClone.firstElementChild as HTMLElement;
        this.targetParent = document.getElementById( this.type + '-projects') as HTMLElement;
        this.targetElement = this.targetParent.querySelector('ul') as HTMLUListElement;
        
        this.showListOfProjects(projects);
        this.attach();
    }

    showListOfProjects(projects:Project[]){
        projects.map(project => this.showSingleProject(project))        
    }

    showSingleProject(project: Project){
        this.element.id = project.id;
        this.element.innerHTML = `
        <h2>Project title: ${project.title}</h2>
        <h3>Number of people: ${project.people}</h3>
        <p>Description: ${project.description}</p>
    `
    }

    private attach(){
        this.targetElement.insertAdjacentElement('beforeend', this.element);
    }
}
//END SHOW LIST OF PROJECTS CLASS



//START PROJECT CLASS
interface ValidatorConfig{
    [property: string]: {
        [validatableProperty: string]: string[];
    } 
}

const registeredValidators: ValidatorConfig = {}

const Require = (target: any, propName: string) => {
    registeredValidators[target.constructor.name] ={
        ...registeredValidators[target.constructor.name],
        [propName]: [ ...(registeredValidators[target.constructor.name]?.[propName]??[]), 'required']
    }   
}

const AllowedRange = (target: any, propName: string) => {
    registeredValidators[target.constructor.name] ={
        ...registeredValidators[target.constructor.name],
        [propName]: [ ...(registeredValidators[target.constructor.name]?.[propName]??[]), 'allowed-range']
    }    
}
const AllowedLength = (target: any, propName: string) => {
    registeredValidators[target.constructor.name] ={
        ...registeredValidators[target.constructor.name],
        [propName]: [ ...(registeredValidators[target.constructor.name]?.[propName]??[]), 'allowed-length']
    }    
}

const validate = (obj:any) => {
    const objectValidationConfig = registeredValidators[obj.constructor.name];
    if(!objectValidationConfig) return true;
    let isValid = true;
    for(const prop in objectValidationConfig){
        for(const validator of objectValidationConfig[prop]){            
            switch(validator){
                case 'required':
                    isValid = isValid && obj[prop].trim().length > 0;
                    break;
                case 'allowed-range':
                    isValid = isValid && obj[prop] > 0 && obj[prop] <6;
                    break;
                case 'allowed-length':
                    isValid = isValid && obj[prop].trim().length > 4 && obj[prop].trim().length < 11
            }
        }
    } 
    return isValid;
}
class Project{
    id: string;
    @Require
    title: string;
    @Require
    @AllowedLength
    description: string;
    @AllowedRange
    people: number;    

    constructor( t: string, d: string, p: number){
        this.id = Math.random().toString();
        this.title = t;
        this.description = d;
        this.people = p;
    }

}

//END PROJECT CLASS


//START PROJECT-INPUT CLASS
function Autobind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjustedMethod: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get(){
            return originalMethod.bind(this)
        }
    };
    return adjustedMethod;
}
class ProjectInput{
    templateElement: HTMLTemplateElement;
    targetElement: HTMLDivElement;
    element: HTMLFormElement;
    titleEl: HTMLInputElement;
    descriptionEl: HTMLInputElement;
    peopleEl: HTMLInputElement; 


    constructor(){
        this.templateElement = document.getElementById("project-input") as HTMLTemplateElement;
        this.targetElement = document.querySelector('.app') as HTMLDivElement;
        const templateElementClone: DocumentFragment = document.importNode(this.templateElement.content, true) ;
        this.element = templateElementClone.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';        
        this.titleEl = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionEl = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleEl = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
        this.attach();
    }

    private attach(){
        this.targetElement.insertAdjacentElement('afterbegin', this.element); 
    }

    
    private configure(){
        this.element.addEventListener('submit',this.submit);
    }

    @Autobind
    private submit(e:Event){
        e.preventDefault();
        const title: string = this.titleEl.value;
        const description: string = this.descriptionEl.value;
        const people: number = +this.peopleEl.value;

        const createProject = new Project(title, description, people);

        if(!validate(createProject)){
            alert('Invalid input! Please try again...');
            return;
        }
        projectState.addProject(createProject);
        this.clearForm(this.titleEl, this.descriptionEl, this.peopleEl);
    }

    private clearForm(titleEl: HTMLInputElement, descriptionEl: HTMLInputElement, peopleEl: HTMLInputElement){
        titleEl.value = '';
        descriptionEl.value = '';
        peopleEl.value ='';
    }
}
//START PROJECT-INPUT CLASS

//START PROJECT-TEMPLATE CLASS
class ProjectTemplate{
    type: string;
    templateElement: HTMLTemplateElement;
    targetElement: HTMLDivElement;
    element: HTMLOptionElement;
    headerElement: HTMLElement;   

    constructor(type: string){
        this.type = type;
        this.templateElement = document.getElementById("project-list") as HTMLTemplateElement;
        this.targetElement = document.querySelector('.app') as HTMLDivElement;        
        const templateElementClone: DocumentFragment = document.importNode(this.templateElement.content, true);
        this.element = templateElementClone.firstElementChild as HTMLOptionElement;
        this.element.id = type + '-projects';
        this.headerElement = this.element.querySelector('h2') as HTMLElement; 
        this.defineType(this.type);
        this.attach();
    }

    private attach(){
        this.targetElement.insertAdjacentElement('beforeend', this.element )
    }

    private defineType(type: string){
        this.headerElement.innerHTML = type.toUpperCase() + " PROJECTS";
    }
}

//END PROJECT-TEMPLATE CLASS

const projInput = new ProjectInput();
const projectOutputActive = new ProjectTemplate('active');
const projectOutputFinished = new ProjectTemplate('finished');


