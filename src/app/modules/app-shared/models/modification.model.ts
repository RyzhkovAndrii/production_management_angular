import { TableType } from "../enums/table-type.enum";

export class Modififcation {

    constructor(
        public userId: number,
        public modificationDateTime: string,
        public tableType: TableType,
        public id?: number
    ) { }

}