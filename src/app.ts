// Code goes here!
window.onload = () => startProject(); 

let arrOfProject: Project[] = [];


const startProject = () => {
    showForm();
//    showProjectTemplate();
}

const submitFom = (e:Event) => {
    e.preventDefault();
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const descriptionEl = document.getElementById('description') as HTMLInputElement;
    const peopleEl = document.getElementById('people') as HTMLInputElement;

    const title: string = titleEl.value;
    const description: string = descriptionEl.value;
    const people: number = +peopleEl.value;

    const createProject = new Project(title, description, people);

    if(!validate(createProject)){
        alert('Invalid input! Please try again...');
        return;
    }

    clearForm(titleEl, descriptionEl, peopleEl);
   // showProject(createProject);
    showListOfProject(createProject);     
}

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

const Positive = (target: any, propName: string) => {
    registeredValidators[target.constructor.name] ={
        ...registeredValidators[target.constructor.name],
        [propName]: [ ...(registeredValidators[target.constructor.name]?.[propName]??[]), 'positive']
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
                    isValid = isValid && !!obj[prop];
                    break;
                case 'positive':
                    isValid = isValid && obj[prop] >= 0;
                    break;
            }
        }
    } 
    return isValid;
}
class Project{
    @Require
    title: string;
    @Require
    description: string;
    @Positive
    people: number;    

    constructor(t: string, d: string, p: number){
        this.title = t;
        this.description = d;
        this.people = p;
    }

}

const showForm = () => {
    const projectInputElement = document.getElementById("project-input")! as HTMLTemplateElement;
    const projectInputClone: Node = projectInputElement.content.cloneNode(true);
    const appElement: Element = document.querySelector('.app')!;
    appElement.appendChild(projectInputClone);

    const form: HTMLFormElement = document.querySelector('form')!;
    form.addEventListener('submit',submitFom);
}

const showProjectTemplate = () => {    
    const projectListElement = document.getElementById("project-list")! as HTMLTemplateElement;
    const projectListClone: Node = projectListElement.content.cloneNode(true);  
    const appElement: Element = document.querySelector('.app')!;          
    appElement.appendChild(projectListClone);
    document.querySelector('h2')!.textContent = 'PROJECTS';
}

const clearForm = (titleEl: HTMLInputElement, descriptionEl: HTMLInputElement, peopleEl: HTMLInputElement) => {
    titleEl.value = '';
    descriptionEl.value = '';
    peopleEl.value ='';
}

const showProject = (project: Project) => {
    const ul = document.querySelector('ul')!;
    const projectSingleElement = document.getElementById("single-project")! as HTMLTemplateElement;
    const projectSingleClone: Node = projectSingleElement.content.cloneNode(true);
    ul.appendChild(projectSingleClone);
    const arrOfLiElements = document.querySelectorAll("li");
    arrOfLiElements[arrOfLiElements.length-1].textContent= 
    `title: ${project.title} description: ${project.description} people: ${project.people}`;
}

const showListOfProject = (project: Project) => {
    arrOfProject.push(project);
    arrOfProject.length <= 1 && showProjectTemplate();
    showProject(project);     
}


