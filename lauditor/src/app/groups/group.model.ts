// export class GroupModel {
//     //Fields 
//     description:string;
//     members:number;
//     name: string;
//     constructor (description: string, members: number,name:string){
//        this.description = description,
//        this.members = members,
//        this.name=name
//     }
// }
export class GroupModel {
    //Fields 
    description: string = '';
    members: any = new Array();
    name: string = '';


}
export class GroupViewModel {
    //Fields 
    id: string = '';
    description: string = '';
    members: any = new Array();
    name: string = '';


}
export class MembersViewModel {
    //Fields 
    id: string = '';
    name: string = '';
    email: string = '';
    isadmin: boolean = false;
    hourly_rate: number = 0;
    designation: string = '';
    groups: any = new Array();
    last_login: any = '';

}
