import { Position } from "./position";

export class Employee {
    id: number;
    name: string;
    position: Position;

    constructor(id: number, name: string, position: Position) { 
        this.id = id;
        this.name = name;
        this.position = position;
    }
}