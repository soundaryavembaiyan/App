export class DashBoardMeetingModel {
    fromTs: string = "";
    subject: string = "";
    toTs: string = "";
    message: string = "";
}
export class DashBoardChatrelModel {
    dateAndTime: string = "";
    message: string = "";
}
export class DashBoardChatteamModel {
    client: object = ChatteamObject;
    team: object = ChatteamObject;
}
export class ChatteamObject {
    message: string = "";
    timestamp: string = "";
    user: string = "";
}
export class DashBoardEmailModel {
    message: string = "";
    subject: string = "";
    timestamp: string = "";
}
export class DashBoardHoursModel {
    approxRevenue: number = 0;
    averageBillingRate: number = 0;
    billableHours: number = 0;
    nonBillableHours: number = 0;
}
export class DashBoardHiringModel {
    count: number = 0;
    type: string = "";
}
export class DashBoardStorageModel {
    balanceStorage: number = 0;
    currentStorage: number = 0;
}
export class DashBoardTimesheetModel {
    notSubmittedCount: number = 0;
    submittedCount: number = 0;
    totalMembers: number = 0;
}
export class DashBoardMatterModel {
    active: object = {};
    closed: object = {};
}
export class DashBoardSubscriptionModel {
    message: string = "";
    month: string = "";
}
export class DashBoardGroupsandtmsModel {
    totalGroups: number = 0;
    totalTms: number = 0;
}
export class DashBoardNotificationModel {
    timestamp: string = "";
    message: string = "";
    date: string = "";
}
export class AdvicateModel {
    name: string = '';
    email: string = '';
    phone: number = 0;
}
export class DocumentModel {
    name: string = '';
    title: string = '';
    content: string = '';
    body:string='';
    doclist: any=new Array();
    show_bookmark:boolean=false;
    showpagenum:any;
    user: any;
    pagenumtemplate_info:any;
    doclist_details:object = {};
    category:string='';
    clients: any;
    matters:any=new Array();
    cutomepage:any;
    pagenumalign:any;
    pagenumtemplate:any;
    pagenumfontsize:any;
    group_acls:any;
}
export class CLientObject {
    id: string = "";
    type: string = "";
}
export class HoursModel {
      action:string='';
      title:string='';
      date=new Date();
      duration_minutes:string="00";
      duration_hours  :string="00";
      matter_id:string=''; 
      matter_type:string='';
      billing :string='';
      id:string='';
}

export class DataModel {
    name:string='';
    title:string='';
    content:string='';
    id:string='';
}

