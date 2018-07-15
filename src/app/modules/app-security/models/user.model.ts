import { Role } from "../enums/role.enum";

export class User {

    constructor(
        public username: string,
        public password: string,
        public firstName?: string,
        public lastName?: string,
        public roles?: Role[],
        public id?: number
    ) { }

}