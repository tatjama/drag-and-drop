

//START PROJECT STATE MANAGEMENT CLASS:

type Listener = (items: Project[]) => void;

/*class ProjectState {
    private listeners: any[] = [];
    private projects: any[] = [];
    private static instance: ProjectState;
  
    private constructor() {}
  
    static getInstance() {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new ProjectState();
      return this.instance;
    }
  
    addListener(listenerFn: Function) {
      this.listeners.push(listenerFn);
    }
  
    addProject(project: Project) {
      
      this.projects.push(project);
      console.log(this.projects)
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }
  }*/
class ProjectState{
    private listeners: Listener[];
    private _projects: Project[];
    private static  instance: ProjectState;

    constructor(){
        this.listeners = [];
        this._projects = [];
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
        console.log(this.projects)
               for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
    }

    addListener(listenerFn: Listener){
        this.listeners.push(listenerFn);
    }

    set projects(newProjects){       
       this._projects = newProjects;
    }

     get projects(){
        return this._projects;
    }


    removeProject(projectId:string){
        const newProjects =this._projects.filter(project => project.id !== projectId);
        this._projects = newProjects;
    }
}


//Insure to have Single instance of project state
const projectState = ProjectState.getInstance();

//END PROJECT STATE MANAGEMENT CLASS
//START SHOW LIST OF PROJECTS CLASS

class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: any[];
  
    constructor(private type: 'active' | 'finished') {
      this.templateElement = document.getElementById(
        'project-list'
      )! as HTMLTemplateElement;
      this.hostElement = document.querySelector('.app')! as HTMLDivElement;
      this.assignedProjects = [];
  
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as HTMLElement;
      this.element.id = `${this.type}-projects`;
  
      projectState.addListener((projects: any[]) => {
        this.assignedProjects = projects;
    
        this.renderProjects();
      });
  
      this.attach();
      this.renderContent();
    }
  
    private renderProjects() {
      const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
      for (const prjItem of this.assignedProjects) {
        const listItem = document.createElement('li');
        listItem.textContent = prjItem.title;
        listEl.appendChild(listItem)
      }
    }
  
    private renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent =
        this.type.toUpperCase() + ' PROJECTS';
    }
  
    private attach() {
        console.log("host element")
        console.log(this.hostElement)
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
  }


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

enum ProjectStatus  {Active, Finished};
class Project{
    id: string;
    @Require
    title: string;
    @Require
    @AllowedLength
    description: string;
    @AllowedRange
    people: number;    
    status: ProjectStatus

    constructor( t: string, d: string, p: number, status: ProjectStatus){
        this.id = Math.random().toString();
        this.title = t;
        this.description = d;
        this.people = p;
        this.status = status;
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

        const createProject = new Project(title, description, people, ProjectStatus.Active);

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
const projectOutputActive = new ProjectList('active');
const projectOutputFinished = new ProjectList('finished');

/*class ProjectList{
    assignProjects: Project[];
    type: string;
    templateElement: HTMLTemplateElement;
    element: HTMLElement;
    targetParent: HTMLElement;
    targetElement: HTMLUListElement;
    
    constructor(type: string, projects: Project[]){
        this.assignProjects = [];
        this.type = type;
        this.templateElement = document.getElementById('single-project') as HTMLTemplateElement;
        const templateElementClone: DocumentFragment = document.importNode(this.templateElement.content, true);
        this.element = templateElementClone.firstElementChild as HTMLElement;
        this.targetParent = document.getElementById( this.type + '-projects') as HTMLElement;
        this.targetElement = this.targetParent.querySelector('ul') as HTMLUListElement;
        projectState.addListener((projects: Project[]) => {
           const relevantProjects = projects.filter(project => {
                if(project.status === ProjectStatus.Active){
                    return project.status === ProjectStatus.Active     
                }
                return project.status === ProjectStatus.Finished
            })
            this.assignProjects = relevantProjects;  
            this.showListOfProjects(this.assignProjects);       
        })        
        this.attach();
    }

    private attach(){
        this.targetElement.insertAdjacentElement('beforeend', this.element);
    }

    showListOfProjects(projects:Project[]){
        projects.map(project => this.showSingleProject(project))        
    }

    showSingleProject(project: Project){
        this.element.id = project.id;
        this.element.setAttribute('draggable', "true");
        this.element.setAttribute('drop', "false");
        this.element.addEventListener('dragstart', this.dragstartHandler);
        this.element.innerHTML = `
        <h2>Project title: ${project.title}</h2>
        <h3>Number of people: ${project.people}</h3>
        <p>Description: ${project.description}</p>    `
    }

    private dragstartHandler(e: any){
        e.dataTransfer!.setData("text", e.target!.id);
        console.log(projectState.projects);
        projectState.removeProject(e.target!.id);
        console.log(projectState.projects);
    }    
}*/
//END SHOW LIST OF PROJECTS CLASS

/*class Drop{
    targetElement: HTMLUListElement

    constructor(){
        this.targetElement = document.querySelector('#finished-projects ul') as HTMLUListElement;
        this.targetElement.setAttribute('class', 'droppable');
        this.targetElement.addEventListener('dragover', this.allowDrop);
        this.targetElement.addEventListener('drop', this.drop);
    }

    private allowDrop(e: Event){
        e.preventDefault();
    }

    private drop(e: any){
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        e.target.appendChild(document.getElementById(data));
    }
}*/


//new Drop();