import { DatePipe } from "@angular/common"

export class URLUtils {

    //Common
    static getCountries = `/countries`
    static getTimeZones = `/event/timezones`
    static getCurrencies = `/currencies`

    //Registration
    static register = `/register`

    //Login
    static login = `/login`
    static forgotPwd = `/reset-pwd`
    static profile = '/profile'
    static editprofile = '/professional/profile/<field>/update'
    static country = '/countries'
    

    //Dashboard
    static getDashboard = `/v3/dashboard`
    static getLayout = `/v3/dashboard/layout`
    static getMeeting = `/v3/dashboard/meeting/`+new Date().getTimezoneOffset();
    static getChatrel = `/v3/dashboard/chat-rel`
    static getChatteam = `/v3/dashboard/chat-team`
    static getEmail = `/v3/dashboard/email`
    static getHours = `/v3/dashboard/hours`
    static getHiring = `/v3/dashboard/hiring`
    static getStorage = `/v3/dashboard/storage`
    static getTimesheet = `/v3/dashboard/timesheet`
    static getMatter = `/v3/dashboard/matter`
    static getnewNotification = `/v3/dashboard/notification`
    static getSubscription = `/v3/dashboard/subscription`
    static getGroupsandtms = `/v3/dashboard/groupsandtms`
    static getNewClients = `/v3/dashboard/new-clients`
    static getDashboardRelations = `/v3/dashboard/relationships`
    static getExternalCounsels = '/v3/dashboard/external-counsels'
    
    static postDocumentsClient = '/v3/document/upload'
    static postDocumentsFirm = '/v3/documents/firm'
    static MergePdfDocumentsClient = '/v3/mergepdf'
    static tempClientPost = '/v3/tempclient'
    static inviteConsumer = '/v2/relationship/invite/consumer'
    static inviteEntity = '/v2/relationship/invite/entity'

    static getCountry='/countries'
    static getGeneralExternalMatter = '/v3/sharedgeneral'
    static getLegalExternalMatter = '/v3/sharedlegal'

    

    // Profile
    static getProfile = `/profile`
    

    static updateProfile(args: any) {
        return `/profile/${args.field}/update`;
    }
    static emailAuthentication(args: any) {
        return `/gmail/authurl?authtoken=${args.token}`
    }
    static emailMessages(args: any) {
        return `/gmail/messages/${args.token}?rows=${args.rows}`
    }

    static NextPageMessages(args: any) {
        return `/gmail/messages/${args.token}?rows=${args.rows}&nextpagetoken=${args.nextpagetoken}`
    }
    static searchMessages(args: any) {
        return `/gmail/messages/${args.token}?rows=${args.rows}&subject=${args.search}&search=${args.search}`
    }
    static messagesCount(args: any) {
        return `/gmail/label/${args.token}?labelid=${args.labelid}`
    }
    static MessageDetails(args: any) {
        return `/gmail/message/detail/${args.token}/${args.msgid}`
    }
    static MessageDocUpload(args: any) {
        return `/gmail/message/attachment/upload/${args.token}/${args.msgid }?partid=${args.partid}`
    }
    static sendMessage(args: any) {
        return `/gmail/sendmail/attach/documents/${args.token}`
    }
    static getClientMatter(args: any) {
        return `/v2/matter/all/${args.id}`
    }
    static viewDocuments(args: any) {
        return `/v3/document/${args.id}/view`
    }
    static viewMergedDocuments(args: any) {
        return `/v3/mergepdf/${args.id}/view`
    }
    static DownloadDocuments(args: any) {
        return `/v3/document/${args.id}/view`
    }
    static editDocuments(args: any) {
        return `/v3/document/${args.id}`
    }
    static getGroupAuditLogs(args: any) {
        return `/v3/auditlogs/${args.id}`
    }
    static deleteDocument = '/v3/document/delete'
    // partners
    static getPartners = `/partners`
    static addPartners = `/partners/add`
    static updatePartners(args: any) {
        return `/partners/${args.email}/update`
    }
    static deletePartners(args: any) {
        return `/partners/${args.email}/delete`
    }

    // Audit Trails
    static getAuditTrails = `/audit`
    static getAudit = `/v3/auditlogs`
    static getFilterAudit = '/audit/search'
    //Notification
    static getNotifications = `/notification`
    static deleteNotifications = `/notification/delete`
    static readNotifications =`/notification/read`
    // Groups 
    static getGroups = `/v3/groups`
    static addGroup = `/v3/group`
    static getUserGroups = `/groups/user`
    static updateGroup(args: any) {
        return `/v3/group/${args.id}`
    }
    static deleteGroup(args: any) {
        return `/v3/group/${args.id}/${args.newid}`
    }
    static moveGroups(args: any) {
        return `/v3/members/${args.id}/move`
    }
    static groupActivityLog = `/professional/v3/auditlogs`

    // Users
    static getMembersList = `/v3/members`
    static getMembers = `/v3/members`
    static getGroupHeads = `/v3/groupHeads`
    static addMember = `/v3/member`
    static resetMemberPassword = `/v3/member/resetpwd`
    static getGroupResources(args: any) {
        return `/v3/group/resources/counts/${args.id}`
    }
    static updateMember(args: any) {
        return `/v3/member/${args.id}`
    }
    static deleteMember(args: any) {
        return `/v3/member/${args.id}`
    }
    static disableMember(args: any) {
        return `/members/${args.id}/disable`
    }
    static makeMemberAdmin(args: any) {
        return `/members/${args.id}/admin`
    }
    static getChatUsers = `/chatusers`

    //Documents
    static getFirmDocuments = `/v3/documents/firm`;
    static getClientDocuments = `/v3/documents/client`;
    static getClientPdfDocuments = '/v3/pdfdocuments/client';
    static filterMergeDoc = '/v3/mergepdf/filter';
    static getfrmPdfDocuments = '/v3/pdfdocuments/firm';
    static getMergedDocuments = `/v3/mergepdf`;
    static getFilteredDocuments = `/v3/document/filter`
    static getDocuments = `/docs/all`
    static getFilterDocuments = `/docs/docsearch`
    static getCalenderDocuments = `/docs/professional/admin/user`
    static getGeneralDocuments(args: any) {
        return `/docs/professional/${args.userid}/user`
    }

    static updateGeneralDocument(args: any) {
        return `/docs/professional/${args.id}/update`
    }
    static uploadProfDocument = `/docs/professional/add`

    static viewGeneralDocument(args: any) {
        return `/docs/professional/${args.id}/view`
    }

    static downloadGeneralDocument(args: any) {
        return `/v3/document/${args.id}/download`
    }

    static downloadInvoiceDocument(args: any) {
        return `/v3/document/${args}/download`
    }

    static deleteGeneralDocument = `/docs/professional/delete`

    static shareDocumentsToIndividual(args: any) {
        return `/clients/${args.id}/consumer/bizdocs/web`
    }

    static updateTags(args: any) {
        return `/docs/professional/${args.id}/tags`
    }
    //timesheets
    static getTimeSheets = '/v3/user/timesheets'
    static getTasksDetails(args: any) {
        return `/v3/event/tasks/` + args;
    }
    static getCurrentWeekDetails(args: any) {
        return `/v3/user/timesheets/` + args;
    }
    static deleteTimeSheetEvent(val: any) {
        return `/v3/user/timesheets/` + val;
    }
    static frezeDate(val: any) {
        return `/v3/user/timesheets/freeze/` + val;
    }

    static aggregateProjects = '/matter/timesheets/project-all-weekly';
    static aggregateTeamMembers = '/matter/timesheets/tms-all-weekly';
    static aggregateTeamMembersMounthView = '/matter/timesheets/tms-all-monthly';
    static aggregateProjectMounthView = '/matter/timesheets/project-all-monthly';

    //Credential
    static getCredentialDocs = `/docs/credential`
    static updateCredentialDoc(args: any) {
        return `/docs/credential/${args.id}/update`
    }
    static viewCredentialDoc(args: any) {
        return `/docs/credential/${args.id}/view`
    }
    static downloadCredentialDoc(args: any) {
        return `/docs/credential/${args.id}/download`
    }
    static aggregateTeamDataWeekByWeek(args: any) {
        return `/matter/timesheets/tms-all-weekly-` + args;
    }
    static aggregateTeamDataWeekByMonth(args: any) {
        return `/matter/timesheets/tms-all-monthly-` + args;
    }
    static aggregateProjectDataWeekByWeek(args: any) {
        return `/matter/timesheets/project-all-weekly-` + args;
    }
    static aggregateProjectDataMonthByMonth(args: any) {
        return `/matter/timesheets/project-all-monthly-` + args;
    }
    // Relationships
    static getAllRelationship = '/v3/client/all/list';
    static getRelationship = '/v2/relationship/client/list';
    static getChatRelationship = '/v2/relationship';
    static relationshipTemporary='/v3/tempclient';
    static getcorporateRelationship ='/v3/corporate';

    static getNotify(filter: any) {
        return `/relationship/${filter.id}/users/notify`
        //return `/v3/relationship/client/${filter.id}/notify/users`
    }
    static ConvertTempClients = '/v3/convert-temp-clients';

    static getRelationshipFiltered(filter: string) {
        return `/v2/relationship/${filter}`
    }

    static shareRelationshipDocuments(args: any) {
        return `/v2/relationship/${args.id}/docs/share`
    }
    static shareRelationshipDocumentsCorp =`/v3/share`

    static shareInvoiceDocuments(args: any) {
        return `/v2/relationship/${args}/docs/share`
    }

    static sharedDocuments(args: any) {
        return `/v2/relationship/${args.id}/docs/shared/byme`
    }

    static relationshipViewDoc(args: any) {
        return `/v2/relationship/${args.relId}/${args.docid}/view`
    }

    static relationshipViewDocCorp(args: any) {
        return `/v3/relationship/${args.relId}/${args.docid}/view`
    }

    static relationshipDownloadDoc(args: any) {
        return `/v2/relationship/${args.relId}/${args.docid}/download`
    }

    static relationshipCopyDoc(args: any) {
        return `/v2/relationship/${args.relId}/${args.docid}/copy`
    }

    static relationshipExchangeInfoProfile(args: any) {
        return `/v2/relationship/${args.id}/profile`
    }
    static relationshipExchangeInfoProfileCorp(args: any) {
        return `/v3/profile/${args.id}`
    }
    static relationshipDocsSharedwithus(args: any) {
        return `/v2/relationship/${args.id}/docs/shared/withme`
    }
    static relationshipDocsSharedbyus(args: any) {
        return `/v2/relationship/${args.id}/docs/shared/byme`
    }
    static relationshipDocsSharedwithusCorp(args: any) {
        return `/v3/share/${args.id}/withme`
    }
    static relationshipDocsSharedbyusCorp(args: any) {
        return `/v3/share/${args.id}/byme`
    }

    // Relationship Search 
    static relationshipSearchConsumer = '/v2/relationship/search/consumer'
    static relationshipSearchEntities = `/v2/relationship/search/entity`
    static relationshipSearchCorporate = `/v2/relationship/search/corporate`
    static relationshipSearchLauditor = '/v2/relationship/search/lauditor'
    static relationshipAllList(product: any) {
        return `/v2/relationship/search/${product}`
    }

    // Relationship Requests
    static relationshipEntityRequest = `/v2/relationship/request/entity`
    static relationshipConsumerRequest = `/v2/relationship/request/consumer`
    static relationshipCorporateRequest = `/v3/corporate`

    // Relationship Invites
    static relationshipInviteEntity = `/v2/relationship/invite/entity`
    static relationshipInviteConsumer = `/v2/relationship/invite/consumer`


    static relationshipEntityDetails(args: any) {
        return `/v2/relationship/entity/${args.entityId}`
    }
    static editInviteRelationshipEntity(args: any) {
        return `/v2/relationship/${args.relid}/edit`
    }

    static relationshipViewProfile(args: any) {
        return `/v2/relationship/${args.id}/profile`
    }

    static addRelationshipReminder(args: any) {
        return `/v2/relationship/${args.id}/reminders`
    }
    static relationshipGroupAcls(args: any) {
        return `/v2/relationship/${args.id}/acls`
        //return `/v3/acl/${args.id}/update`
    }
    static relationshipGroupAclsCorp(args: any) {
        //return `/v2/relationship/${args.id}/acls`
        return `/v3/acl/${args.id}/update`
    }
    static acceptRelationship(args: any) {
        return `/v2/relationship/${args.id}/accept`
    }
    static acceptRelationshipCorp(args: any) {
        return `/v3/corporate/${args.id}/accept`
    }

    static terminateRelationship(args: any) {
        return `/v2/relationship/${args.id}/terminate/request`
    }

    static getProfessionalDocs(args: any) {
        return `/docs/professional/${args.userid}/user`
    }

    //MergePDF
    static getMattersByClient(args: any) {
        return `/v3/matter/all/${args.id}`
    }
    static editMergepdfFile(args: any) {
        return `/v3/mergepdf/${args.id}`
    }
    static createMerge = `/docs/mergepdf/add`

    static addPagination = `/v3/mergepdf/paginate/docs`
    static addPaginationQueue = `/v3/mergepdf/paginate/queue`
    static viewMergepdfFile(args: any) {
        return `/docs/mergepdf/${args.id}/view`
    }

    static downloadMergepdfFile(args: any) {
        return `/v3/mergepdf/${args.id}/download`
    }

    static getMergedDocs = `/docs/mergepdf`

    static updateMergedpdfTags(args: any) {
        return `/v3/mergepdf/${args.id}/tags`
    }
    static deleteMergedpdf(args: any) {
        return `/v3/mergepdf/${args.id}`
    }

    static addShortText = `/v3/mergepdf/shortext/docs`
    static addShortTextqueue = `/v3/mergepdf/shortext/queue`
    static deletePages = `/v3/mergepdf/delpages/docs`
    static deletePagesQueue = `/v3/mergepdf/delpages/queue`
    static addWatermaek = '/v3/mergepdf/watermark/docs'
    static addWatermarkQueue = '/v3/mergepdf/watermark/queue'
    //Collaboration
    static getCollaboration(args: any) {
        return `/docs/collaborate/${args.userid}`
    }

    static addCollaboration(args: any) {
        return `/docs/collaborate/${args.userid}/add`
    }

    static updateCollaboration(args: any) {
        return `/docs/collaborate/${args.userid}/${args.id}/update`
    }

    static copyDocToCollaboration(args: any) {
        return `/docs/collaborate/${args.userid}/copy`
    }

    static deleteCollaboration(args: any) {
        return `/docs/collaborate/${args.userid}/${args.id}/delete`
    }

    static permissionCollaboration(args: any) {
        return `/docs/collaborate/${args.userid}/${args.id}/permissions`
    }

    static getCollaborationActivityLogs(args: any) {
        return `/docs/collaborate/${args.userid}/${args.id}/activitylogs`
    }

    static viewVersionDocs(args: any) {
        return `/docs/collaborate/${args.userid}/${args.id}`
    }

    static uploadVersionDoc(args: any) {
        return `/docs/collaborate/${args.userid}/${args.id}/uploadversion`
    }

    static copyVersionDoc(args: any) {
        return `docs/collaborate/${args.userid}/${args.id}/${args.version}/copy`
    }

    static tagsetGet = '/tagset'
    static tagsetCreate = '/tagset/create'
    static tagsetPut(args: any) {
        return `/tagset/update/${args.tsid}`
    }
    static tagsetDelete(args: any) {
        return `/tagset/delete/${args.tsid}`
    }

    //Calendar
    static getCalenderTms = `/v3/event/tms`
    static getCalendarList(args: any) {
        return `/v3/events/${args.offset}/${args.currentPage}`
    }
    static getCalenderExternal = `/v3/corporate/list`

    static createEvent = `/v3/events`
    static getEntityTms(id: any) {
        return `/related/entities/tms/` + id
    }
    static getExternalEntities = `/related/entities`
    static eventViewDetails(args: any) {
        return `/v3/event/${args.eventId}/${args.offset}`
    }
    static updateEvent(args: any) {
        return `/v3/event/${args.eventId}/${args.offset}`
    }
    static deleteEvent(args: any) {
        return `/v3/event/${args.eventId}`
    }

    //Notes
    static updateEventNotes(id: any) {
        return `/event/notes/${id}`;
    }
    static updateCorpNotes(id: any) {
        return `/v3/notes/${id}`;
    }
    static deleteCorpNotes(id: any) {
        return `/v3/notes/` + id;
    }

    //Invoice
    static Invoice = '/v3/invoice'
    static InvoiceWithId(id: any) {
        return `/v3/invoice/${id}`
    }
    static UploadLogo = '/invoice/logoup'
    static GetLogo = '/invoice/logoget'
    //Legal Matter
    //  static legalMatterPost = `/matter/legal/create`
    static getLegalMatter = `/matter/legal`
    static getLegalMatterEventList = '/v3/matter/legal'
    static createLegalMatter = '/matter/legal/create'

    //matter
    static matterIndiviuals = '/v3/relationship/temp-invite/consumer'
    static matterEntity = '/v3/relationship/temp-invite/entity'
    static updateLegalMatter(Id: any) {
        return `/matter/legal/update/` + Id;
    }
    static deleteLegalMatter(Id: any) {
        return `/matter/legal/delete/` + Id;
    }
    static updateLegalAcls(Id: any) {
        return `/matter/legal/` + Id + `/acls`
    }
    static legalgroupCanDelete(LId: any, Gid: any) {
        return `/matter/legal/` + LId + `/acls/` + Gid
    }
    static generalgroupCanDelete(LId: any, Gid: any) {
        return `/matter/legal/` + LId + `/acls/` + Gid
    }
    static updateLegalTags(args: any) {
        return `/matter/legal/${args.id}/tags`
    }

    static getLegalMatterDetails(args: any) {
        return `/matter/legal/view/${args.id}`
    }

    // History
    static legalHistoryDocuments(id: any) {
        return `/matter/legal/` + id + `/documents`
    }

    static legalHistoryDocumentsUpdate(id: any) {
        return `/matter/legal/` + id + `/documents/update`
    }

    static getLegalHistoryMembers(id: any) {
        return `/matter/legal/` + id + `/members`
    }

    static updateLegalHistoryMembers(id: any) {
        return `/matter/legal/` + id + `/members/update`
    }

    static getLegalHistoryTimesheet(args: any) {
        return `/matter/legal/${args.id}/timesheets`
    }

    static updateLegalHistoryTimesheet(args: any) {
        return `/matter/legal/${args.id}/timesheets/update`
    }

    static getLegalHistory(args: any) {
        return `/matter/legal/${args.id}/history/${args.offset}`
    }


    static updateLegalMatterStatus(args: any) {
        return ``
        // need to update with correct end point (uday)
    }
    static getFilterTypeAttachements = `/matter/attachments`

    static getLegalMatterviewDetail(args: any) {
        return `/matter/legal/` + args.id + `/history/` + args.offset;
    }


    //General
    static getGeneralMatter = `/matter/general`
    static getGenMatterEventList = '/v3/matter/general'
    static createGeneralMatter = '/matter/general/create'
    static updateGeneralMatter(Id: any) {
        return `/matter/general/update/` + Id;
    }
    static deleteGeneralMatter(Id: any) {
        return `/matter/general/delete/` + Id;
    }
    static updateGeneralAcls(Id: any) {
        return `/matter/general/` + Id + `/acls`
    }
    static getGeneralHistory(args: any) {
        return `/matter/general/` + args.id + `/history/` + args.offset;
    }
    static updateGeneralTags(args: any) {
        return `/matter/general/${args.id}/tags`
    }

    static getGeneralMatterDetails(args: any) {
        return `/matter/general/view/${args.id}`
    }
    static generalHistoryDocuments(id: any) {
        return `/matter/general/` + id + `/documents`
    }
    static generalHistoryDocumentsUpdate(id: any) {
        return `/matter/general/` + id + `/documents/update`
    }
    static getGeneralHistoryMembers(id: any) {
        return `/matter/general/` + id + `/members`
    }
    static updateGeneralHistoryMembers(args: any) {
        return `/matter/general/${args.id}/members/update`
    }

    static getGeneralHistoryTimesheet(args: any) {
        return `/matter/general/${args.id}/timesheets`
    }

    static updateGeneralHistoryTimesheet(args: any) {
        return `/matter/general/${args.id}/timesheets/update`
    }
    static getFilterGeneralTypeAttachements = `/matter/attachments`

    //old rsvpAPI
    // static updateRSVP(args: any) {
    //     return `/event/update/rsvp/${args.event_id}`
    // }

    static updateRSVP(args: any){
        return `/v3/event/response/${args.event_id} `
    }

    //Approval Delete List
    static getAprovalDeleteList = `/docs/deleted/list`
    static approvalDeleteDocDelete = `/docs/deleted/delete`
    static approvalDeleteDocRestore = `/docs/deleted/restore`
    static approvalDeleteDocView = `/docs/deleted/view`

    static getAggregateTimesheet(args: any) {
        return `/matter/timesheets/${args.matter}`
    }

    static userAggregateTimesheet = '/v2/matter/user/timesheets'
    static userAggregateTimesheetWithParam(args: any) {
        return `/v2/matter/user/timesheets/${args.date}`
    }

    static timesheetsNamesList = `/v2/matter/user/timesheet-names`
    static tmtimesheetWeekly(args: any) {
        return `/matter/timesheets/tms-${args.id}-weekly`
    }
    static tmtimesheetMonthly(args: any) {
        return `/matter/timesheets/tms-${args.id}-monthly`
    }

    static projecttimesheetWeekly(args: any) {
        return `/matter/timesheets/project-${args.id}-weekly`
    }

    static allMatterList = `/v2/matter/all`

    static timeDiffCalc(dateFuture: any, dateNow: any) {
        var futureTime = new DatePipe('en-US').transform(dateFuture, 'HH:mm')
        if (futureTime == '00:00') {
            dateFuture.setHours(24)
        }
        let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
        diffInMilliSeconds = Math.round(diffInMilliSeconds)

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;
        // //console.log('calculated days', days);

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        // //console.log('calculated hours', hours);

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
        // //console.log('minutes', minutes);

        let difference = '';
        if (days > 0) {
            difference += (days === 1) ? `${days} day, ` : `${days} days, `;
        }

        difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

        difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

        return difference;
    }
    static is_admin() {
        var isadmin = localStorage.getItem('isadmin')
        return isadmin
    }
    static get_jid() {
        if (localStorage.getItem('user_id') == 'admin' || localStorage.getItem('user_id') == null)
            return localStorage.getItem('jid')
        else
            return localStorage.getItem('jid') + "_" + localStorage.getItem('user_id')
    }
    static get_firmName() {
        return localStorage.getItem("firm_name")
    }
    static get_userid() {
        if (localStorage.getItem('user_id') == null) {
            return null
        }
        return localStorage.getItem('user_id')
    }
}