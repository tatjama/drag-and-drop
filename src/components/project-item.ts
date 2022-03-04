namespace App{
    
//START PROJECT ITEM  CLASS
export class ProjectItem extends Component <HTMLUListElement, HTMLLIElement> implements Draggable{
    project: Project;

    get peoples(){
        if(this.project.people === 1){
            return `${this.project.people} people assigned`
        }
        return `${this.project.people} peoples assigned`
    }

    constructor(hostId: string, project: Project){
        super("single-project", hostId, false, project.id)
        this.project = project;
        this.renderContent();
        this.configure();
    }

    @Autobind
    dragStartHandler(event: DragEvent){
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_: DragEvent){
        console.log('DragEnd')
    }

    configure(){
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent(){
        const h2 = document.createElement('h2');
        h2.innerText = `Title: ${this.project.title}`;        
        const h3 = document.createElement('h3');
        h3.innerText = this.peoples; 
        const p = document.createElement('p');
        p.innerText = `Description: ${this.project.description}`;
        this.element.appendChild(h2);
        this.element.appendChild(h3);
        this.element.appendChild(p);
    }
}
//END PROJECT ITEM CLASS
}