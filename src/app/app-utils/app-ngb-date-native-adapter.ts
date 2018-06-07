import { Injectable } from "@angular/core";
import { NgbDateAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {

    fromModel(date: Date): NgbDateStruct {
        return (date && date.getFullYear) ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : null;
    }

    toModel(date: NgbDateStruct): Date {
        return date ? new Date(date.year, date.month - 1, date.day) : null;
    }

}