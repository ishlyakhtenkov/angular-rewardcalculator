export class PositionTo {
    id: number;
    name: string;
    salary: number;
    chiefPosition: boolean;
    departmentId: number;

    constructor(id: number, name: string, salary: number, chiefPosition: boolean, departmentId: number) { 
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.chiefPosition = chiefPosition;
        this.departmentId = departmentId;
    }
}