export interface IUser {
    id: number;
    username: string;
    staffUnit?: IStaffUnit;
}

export interface IStaffUnit {
    name: string;
}