export class Task {
    id: string;
    title: string;
    description: string;
    isComplete: boolean;
    dueDate: Date;
    parentId: string;    

    constructor(title: string, id?: string, description?: string) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}
