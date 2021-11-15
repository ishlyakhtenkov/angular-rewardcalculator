export class EmployeeTo {
    id: number;
    name: string;
    positionId: number;

    constructor(id: number, name: string, positionId: number) { 
        this.id = id;
        this.name = name;
        this.positionId = positionId;
    }
}