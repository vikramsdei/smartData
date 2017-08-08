import {Injectable, Output, EventEmitter, ViewContainerRef} from '@angular/core';
import {User} from "../models/user";
import {AuthenticationService} from "./authentication.service";
import {Http, Response} from '@angular/http';
import {DummyAppHttpService} from './DummyApp.http.service';
import {UserService} from "./user.service";
import {ServerResponse} from "../models/server.response";
import {ReferenceDataService} from "./reference_data.service";
import {LocationService} from "./locaiton.service";
import {Observable, Subject} from 'rxjs/Rx';
import {OfficeService} from "./office.service";
import {SitedownService} from "./site_down.service";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {MembershipLevelService} from "./membership_level.service";
import {SignupWizardPage} from "../member/pages/signup-wizard/signup-wizard.page";

declare var trackJs: any;
@Injectable()
export class ApplicationService extends DummyAppHttpService {
    appInitializing:boolean = true;
    current_user:User = new User();
    hasCurrentUser:boolean = false;
    pageLoaded:boolean =  false;
    refData:ReferenceDataService = null;
    locations:LocationService = null;
    offices:OfficeService = null;
    membershipLevels:MembershipLevelService;
    appdown:boolean = false;
    hideLeftMenu: boolean =  false;
    signUpWizard: boolean = false;

    @Output() userLoggedOut = new EventEmitter<boolean>();
    @Output() userLoaded = new EventEmitter<User>();
    @Output() errorsUpdated = new EventEmitter<any>();

    constructor(private _authenticationService:AuthenticationService,
                private _http:Http,
                private _userService:UserService,
                private _refData:ReferenceDataService,
                private _locationService: LocationService,
                private _officeService: OfficeService,
                private _notificationService: ToastsManager,
                private _membershipLevelService: MembershipLevelService,
                private _sitedownService:SitedownService) {
        super(_sitedownService);

        this.refData = _refData;
        this.locations = _locationService;
        this.offices = _officeService;
        this.membershipLevels = _membershipLevelService;
    }

    public setRooElement(vRef: ViewContainerRef) {
        this._notificationService.setRootViewContainerRef(vRef);
    }

    public successMessage(title:string, message:string, overides?: any):void {
        var options = {
            timeOut: 2000,
            showProgressBar: false,
            lastOnBottom: true
        };
        this._notificationService.success(title, message);
    }

    // We figure out if we are loading up by first checking if we have all of our reference data.
    // We also then check to make sure the page has loaded its data.
    // We then check to see if user data is loaded.
    get loading():boolean {

        if(this.pageLoaded && this.refData.loaded && this.membershipLevels.loaded)
        {
            return true;
        }
        return false;
    }

    get shouldShowLeftNav():boolean {
        return this.hasCurrentUser === true && this.appInitializing === false && !this.hideLeftMenu;
    }

    public errorMessage(title:string, message:string, overides?: any):void {
        var options = {
            timeOut: 5000,
            showProgressBar: false,
            lastOnBottom: true
        };
        this._notificationService.error(title, message);
    }

    public alertMessage(title:string, message:string, overides?: any):void {
        var options = {
            timeOut: 5000,
            showProgressBar: false,
            lastOnBottom: true
        };
        this._notificationService.error(title, message);
    }

    public infoMessage(title:string, message:string, overides?: any):void {
        var options = {
            timeOut: 5000,
            showProgressBar: false,
            lastOnBottom: true
        };
        this._notificationService.info(title, message);
    }

    public infoMessageCustomized(title:string, message:string, overides?: any):void {
        this._notificationService.info(title, message, overides);
    }

    public removeAll():void {
        // this._notificationService.remove();
    }

    public logout() {
        this._authenticationService.logout();
        this.current_user = null;
        this.hasCurrentUser = false;
    }


    public publishErrors(server_response: ServerResponse):void {
        this.errorsUpdated.emit(server_response);
    }

    //Convert date to MM/DD/YYYY
    public serverdate_to_date(d:any) {
        let date = null;

        if (d instanceof Date) {
            date = d;
        } else if (typeof d === "string") {
            date = new Date(d);
        }

        if (date === null) {
            return null;
        }
        let jdate = date.toJSON();
        jdate = date.toJSON().substring(0,jdate.indexOf("T")).split("-");
        return jdate[1] + "/" + jdate[2] + "/" + jdate[0];
    }
    
    public date_to_serverdate(d:any) {
        let date = null;

        if (d instanceof Date) {
            date = d;
        } else if (typeof d === "string") {
            date = new Date(d);
        }

        if (date === null) {
            return null;
        }

        let jdate = date.toJSON();
        return jdate.substring(0,jdate.indexOf("T"));

    }

    public init_app() {
        Observable.forkJoin(
            this.loadReferenceData(),
            this.loadLocationData(),
            this.loadOfficeData(),
            this.loadMembershipLevels(),
            this.loadOfferedServices()
        ).subscribe(
            data => {
                if(this.signUpWizard) {
                    this.appInitializing = false;

                } else  {
                    this.loadCurrentUser().subscribe(
                        data => {
                            this.processContinuedLogin(data);
                        },
                        err => {
                            this.processContinuedLoginError(err);

                        }
                    );

                }
            },
            err => {
            }
        );

    }

    public loadUser(user_id: number):void {
        this._userService.load(user_id).subscribe(
            server_response => this.userLoaded.emit(server_response.value),
            server_response => console.log("dam")
        );
    }

    public reloadCurrentUser():void {
        this.loadCurrentUser().subscribe( data => {
            var u = new User();
            u.load_from_json(data.user);
            this.setCurrentUser(u);
        });
    }

    private processContinuedLoginError(error:any) {
        this._authenticationService.logout();
        this.userLoggedOut.emit(true);
        this.hasCurrentUser = false;
        this.appInitializing = false;
    }

    userLoggedIn():string {
        var jwt =  localStorage.getItem('id_token');
        var user_id =  localStorage.getItem('user_id');
        if( !jwt || !user_id) {
            this.logout();
        }
        // // return this.current_user && jwt && user_id;
        // console.log(jwt);
        // console.log(user_id);
        return jwt && user_id;
    }

    get CurrentUser():User {
        return this.current_user;
    }

    setCurrentUser(user:User):void {
        this.current_user = user;
        this.hasCurrentUser = true;
    }

    private processContinuedLogin(data):void {
        var u = new User();
        this.current_user = u.load_from_json(data.user);
        this.hasCurrentUser = true;
        try {
            trackJs.configure({"userId": u.id.toString()});
            trackJs.addMetadata("UserName", u.username);
            trackJs.addMetadata("UserEmail", u.email);
            trackJs.addMetadata("UserFullName", u.fullName);
        } catch (error) {

        }
        this.appInitializing = false;
    }

    public featureEnabled(name:string):boolean {
        if(this.CurrentUser) {
            return this.CurrentUser.featureEnabled(name)
        } else {
            return false
        }
    }

    public featureAsBoolean(name:string):boolean {
        if(this.CurrentUser) {
            return this.CurrentUser.featureAsBoolean(name);
        } else {
            return false
        }

    }

    public featureAsString(name:string):string {
        if(this.CurrentUser) {
            return this.CurrentUser.featureAsString(name);
        } else {
            return ""
        }
    }

    public featureAsNumber(name:string):number {
        return Number.parseFloat(this.featureAsString(name));
    }


    private loadMembershipLevels():any {
        return this._membershipLevelService.load();
    }

    private loadReferenceData():any {
        return this._refData.load();
    }

    private loadCurrentUser():any {
        return this._http.get(this.generateUrl('/api/users/get_current_user.json', { }), this.authRequestOptions()).map((res:Response) => res.json());
    }

    private loadLocationData():any {
        return this._locationService.load();
    }

    private loadOfficeData():any {
        return this._officeService.load();
    }

    private loadOfferedServices():any {
        return this._refData.loadOfferedServices();

    }
}