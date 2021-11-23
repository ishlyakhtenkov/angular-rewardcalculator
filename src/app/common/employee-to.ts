export class EmployeeTo {
    id: number;
    name: string;
    rate: string;
    positionId: number;

    constructor(id: number, name: string, rate: string, positionId: number) { 
        this.id = id;
        this.name = name;
        this.rate = rate;
        this.positionId = positionId;
    }
}