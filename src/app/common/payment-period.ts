export class PaymentPeriod {
    id: number;
    period: Date;
    requiredHoursWorked: number;

    constructor(id: number, period: Date, requiredHoursWorked: number) { 
        this.id = id;
        this.period = period;
        this.requiredHoursWorked = requiredHoursWorked;
    }
}