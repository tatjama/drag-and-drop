import Component  from './basic-component.js';
import { Autobind } from '../decorators/autobind.js';
import { Project, ProjectStatus } from '../models/project.js';
import { projectState } from '../state/project-state.js';
import { validate } from '../util/validator.js';

//START PROJECT-INPUT CLASS
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
//END PROJECT-INPUT CLASS
