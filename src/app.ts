//START PROJECT STATE MANAGEMENT CLASS:

type Listener<T> = (items: T[]) => void;
class State<T>{
    protected listeners: Listener<T>[];

    constructor(){
        this.listeners = [];
    }

    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    }    
}
class ProjectState extends State<Project>{
    private _projects: Project[];
    private static  instance: ProjectState;

    constructor(){
        super();
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
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
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

//START COMPONENT BASE CLASS
abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    

    constructor(templateElementId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string){
        this.templateElement = document.getElementById(templateElementId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;
        const importedNode = document.importNode(
            this.templateElement.content,
            true
          );
          this.element = importedNode.firstElementChild as U;
          if(newElementId){
            this.element.id = newElementId;
          }  

          this.attach(insertAtStart);
    }

    private attach(insertAtBegin:boolean) {
        this.hostElement.insertAdjacentElement(insertAtBegin? 'afterbegin': 'beforeend' , this.element);
    }

    abstract configure(): void;

    abstract renderContent(): void;
}
//END COMPONENT BASE CLASS

//START SHOW LIST OF PROJECTS CLASS

class ProjectList extends Component <HTMLDivElement, HTMLElement> {    
    assignedProjects: Project[];
  
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects` )
        this.assignedProjects = [];  
        this.configure();
        this.renderContent();
    }

    configure(): void {
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter((project: Project) => {
              if(this.type === 'active'){
                  return project.status === ProjectStatus.Active;
              }
              return project.status === ProjectStatus.Finished;
            })
            
            this.assignedProjects = relevantProjects;    
            this.renderProjects();
        });  
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent =
          this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects() {
      const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
      //console.log(listEl);
      listEl.innerHTML = '';
      for (const prjItem of this.assignedProjects) {
        const listItem = document.createElement('li');
        listItem.textContent = prjItem.title;
        listEl.appendChild(listItem)
      }
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
    public title: string;
    @Require
    @AllowedLength
    public description: string;
    @AllowedRange
    public people: number;    
    public status: ProjectStatus

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
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleEl: HTMLInputElement;
    descriptionEl: HTMLInputElement;
    peopleEl: HTMLInputElement; 

    constructor(){
        super("project-input", 'app', true,'user-input')
        this.titleEl = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionEl = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleEl = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
    }

    configure(){
        this.element.addEventListener('submit',this.submit);
    }

    renderContent(){}

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
        this.targetElement = document.getElementById('app') as HTMLDivElement;        
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