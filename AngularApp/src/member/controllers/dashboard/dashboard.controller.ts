import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {ApplicationService} from "../../../services/application.service";
import {ActivatedRoute} from '@angular/router';
import {User} from "../../../models/user";


@Component({
    selector: 'dashboard',
    template: require('./dashboard.controller.html')
})

export class DashboardController implements OnInit, OnDestroy {

    appService: ApplicationService;
    user:User = new User();
    currentUser:User = new User();
    loaded:boolean = true;
    private subActive:any;

    constructor(private _authservice:AuthenticationService, private _appService:ApplicationService, private _route:ActivatedRoute) {
        this.appService = _appService;
    }

    ngOnInit() {
        this.subActive = this._route.params.subscribe(params => {
            this.currentUser = this._appService.CurrentUser;
            this._appService.userLoaded.subscribe(loaded_user => this.userLoaded(loaded_user));
            this._appService.loadUser(parseInt(params["user_id"], 10));
        });
    }

    ngOnDestroy() {
        if (typeof this.subActive !== "undefined") {
            this.subActive.unsubscribe();
        }

    }

    private userLoaded(loaded_user:User):void {
        this.user = loaded_user;
        this.loaded = true;
    }
}
