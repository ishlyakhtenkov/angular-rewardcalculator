export class Position {
    id: number;
    name: string;
    salary: number;
    chiefPosition: boolean;

    constructor(id: number, name: string, salary: number, chiefPosition: boolean) { 
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.chiefPosition = chiefPosition;
    }
}