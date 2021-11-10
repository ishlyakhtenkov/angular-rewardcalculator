export class PaymentPeriod {
    id: string;
    period: Date;
    requiredHoursWorked: number;

    constructor(id: string, period: Date, requiredHoursWorked: number) { 
        this.id = id;
        this.period = period;
        this.requiredHoursWorked = requiredHoursWorked;
    }
}