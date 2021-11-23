import { Position } from "./position";

export class Employee {
    id: number;
    name: string;
    rate: string;
    position: Position;

    constructor(id: number, name: string, rate: string, position: Position) { 
        this.id = id;
        this.name = name;
        this.rate = rate;
        this.position = position;
    }
}