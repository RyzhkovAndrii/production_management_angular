import { Role } from '../../app-security/enums/role.enum';

export class User {

    public username: string;
    public firstName?: string;
    public lastName?: string;
    public roles?: Role[];
    public id?: number;

    constructor() { }

}
