import * as moment from 'moment';
import {Membership} from "./membership";

export class User {
    id:number;
    fullName:string;
    email:string;
    username:string;
    timeZone:string;
    bio:string;
    practiceName: string;
    birthDate: string;
    searchBio: string;
    website: string;
    mailingAddress: string;
    mailingAddress2: string;
    mailingCity: string;
    mailingState: string;
    mailingPostalCode: string;
    lastSignInAt: string;
    profilePictureId: string;
    inviteCode:string;
    currentWizardStep: string;
    phoneNumber: string;
    npi: string;
    freeInpersonConsultation: boolean;
    freePhoneConsultation: boolean;
    adjustedFee: number;
    searchableProfile: boolean;
    // submit_profile, approve_profile, reject_profile
    profileState: string;
    profileRejectMessage: string;
    accountState: string;
    publicPhoneNumber: string;
    referredByUserId: number;
    password: string;
    passwordConfirmation: string;
    profilePictureThumbnail: string;
    uploadFileName: string;
    uploadFileContents: string;
    providerTypeIds: number;
    hasUnsignedDocuments:boolean;
    intercomUserHash:string;
    hasPaymentInfo:boolean;
    subscriptionSMS:boolean;
    cellphoneNumber:string;
    remittanceAddress:string;
    nextMembershipLevelId:number;
    membershipLevelId: number;
    nextMembershipChangeDate:any;
    genderId: number;
    profileErrors: string[];
    isPrimaryLeaseMember: boolean;
    canOptInToOfficeSharing: boolean;
    optedInToOfficeSharing: boolean;
    cancelsLeft: number;
    calendarUrl: string;
    uvizeSsoJwt: string;
    canAccessCalendar:boolean;
    features:any = {};
    receptionPhoneNumber: string;
    receptionNote: string;
    notifyVrByEmail: boolean;
    forwardVrCalls: boolean;
    notifyVrBySms: boolean;
    notifyVrEmail: string;
    notifyVrSmsPhoneNumber: string;
    vrPhoneNumber: string;
    vrSecurityPin: string;
    hasActiveLease: boolean;
    primaryMembershipLocationId: number;
    canTerminateMembership: boolean;
    canChangeMembershipLevel: boolean;
    nextMembershipLevelChangeTime: any;

    primaryMemberships: Membership[] = [];
    secondaryMemberships: Membership[] = [];
    memberships: Membership[] = [];
    membershipSubscriptionRequiresActivation: boolean = false;

    featureEnabled(name:string):boolean {
        return this.features[name]
    }

    featureAsBoolean(name:string):boolean {
        return this.featureAsString(name) === "true";
    }

    featureAsString(name:string):string {
        var f  = this.features[name];
        if(f) {
            return f.current_value;
        }
        return null;
    }

    featureAsNumber(name:string):number {
        return Number.parseFloat(this.featureAsString(name));
    }

    load_from_json(json:any):User {
        this.id = json.id;
        this.fullName = json.fullName;
        this.email = json.email;
        this.username = json.username;
        this.timeZone = json.timeZone;
        this.bio = json.bio;
        this.practiceName = json.practiceName;
        this.birthDate = json.birthDate;
        this.searchBio = json.searchBio;
        this.website = json.website;
        this.mailingAddress = json.mailingAddress;
        this.mailingAddress2 = json.mailingAddressLine2;
        this.mailingCity = json.mailingCity;
        this.mailingState = json.mailingState;
        this.mailingPostalCode = json.mailingPostalCode;
        this.lastSignInAt = json.lastSignInAt;
        this.profilePictureId = json.profilePictureId;
        this.inviteCode = json.inviteCode;
        this.currentWizardStep = json.currentWizardStep;
        this.phoneNumber = json.phoneNumber;
        this.npi = json.npi;
        this.freeInpersonConsultation = json.freeInpersonConsultation;
        this.freePhoneConsultation = json.freePhoneConsultation;
        this.adjustedFee = json.adjustedFee;
        this.searchableProfile = json.searchableProfile;
        this.profileState = json.profileState;
        this.profileRejectMessage = json.profileRejectMessage;
        this.accountState = json.accountState;
        this.publicPhoneNumber = json.publicPhoneNumber;
        this.referredByUserId = json.referredByUserId;
        this.profilePictureThumbnail = json.profilePictureThumbnail;
        this.providerTypeIds = json.providerTypeIds;
        this.hasUnsignedDocuments = json.hasUnsignedDocuments;
        this.intercomUserHash = json.intercomUserHash;
        this.hasPaymentInfo = json.hasPaymentInfo;
        this.subscriptionSMS = json.subscriptionSms;
        this.cellphoneNumber = json.cellphoneNumber;
        this.remittanceAddress = json.remittanceAddress;
        this.nextMembershipLevelId = json.nextMembershipLevelId;
        this.membershipLevelId = json.currentMembershipLevelId;
        this.nextMembershipChangeDate = moment(json.nextMembershipChangeDate);
        this.genderId = json.genderId;
        this.profileErrors = json.profileErrors;
        this.cancelsLeft = json.cancelsLeft;
        this.calendarUrl = json.calendarUrl;
        this.isPrimaryLeaseMember = json.isPrimaryLeaseMember;
        this.features = json.features;
        this.uvizeSsoJwt = json.uvizeSsoJwt;
        this.canOptInToOfficeSharing = json.canOptInToOfficeSharing;
        this.optedInToOfficeSharing = json.optedInToOfficeSharing;
        this.canAccessCalendar = json.canAccessCalendar;
        this.receptionPhoneNumber = json.receptionPhoneNumber;
        this.receptionNote = json.receptionNote;
        this.notifyVrByEmail = json.notifyVrByEmail;
        this.forwardVrCalls = json.forwardVrCalls;
        this.notifyVrBySms = json.notifyVrBySms;
        this.notifyVrEmail = json.notifyVrEmail;
        this.notifyVrSmsPhoneNumber = json.notifyVrSmsPhoneNumber;
        this.vrSecurityPin = json.vrSecurityPin;
        this.vrPhoneNumber = json.vrPhoneNumber;
        this.hasActiveLease = json.hasActiveLease;
        this.primaryMembershipLocationId = json.primaryMembershipLocationId;
        this.membershipSubscriptionRequiresActivation = false;
        this.canTerminateMembership = json.canTerminateMembership;
        this.canChangeMembershipLevel = json.canChangeMembershipLevel;
        this.nextMembershipLevelChangeTime = moment(this.nextMembershipLevelChangeTime);

        for(let i  in json.primaryMemberships) {
            let ins = new Membership();
            ins.load_from_json(json.primaryMemberships[i]);
            this.primaryMemberships.push(ins);
            this.memberships.push(ins);
            if (!ins.membershipSubscriptionActivated) {
                if (!this.membershipSubscriptionRequiresActivation) {
                    this.membershipSubscriptionRequiresActivation = true
                }
            }
        }

        for(let i  in json.secondaryMemberships) {
            let ins = new Membership();
            ins.load_from_json(json.secondaryMemberships[i]);
            this.secondaryMemberships.push(ins);
            this.memberships.push(ins);
            // if (!ins.membershipSubscriptionActivated) {
            //     if (!this.membershipSubscriptionRequiresActivation) {
            //         this.membershipSubscriptionRequiresActivation = true
            //     }
            // }
        }

        return this;

    }
}

