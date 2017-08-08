import {Component, OnInit, OnDestroy} from '@angular/core';
import {ApplicationService} from "../../../services/application.service";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../models/user";
import {ServerResponse} from "../../../models/server.response";


@Component({

    selector: 'member-account-info-page',
    template: require("./view.html"),

})

export class AccountInfoPage implements OnInit, OnDestroy {
    user:User = new User();
    appService:ApplicationService;
    private subActivated: any;

    constructor(private _route:ActivatedRoute,
                private _appService:ApplicationService,
                private _userService:UserService) {
        this.appService = _appService;
    }

    ngOnInit() {
        this._appService.pageLoaded = false;
        this.subActivated = this._route.params.subscribe(params => {
            this._userService.load(params["user_id"]).subscribe(
                server_response => this.initUserLoaded(server_response),
                server_response => console.log(JSON.stringify(server_response))
            );

        });
    }

    ngOnDestroy() {
        if (typeof this.subActivated  !== "undefined") {
            this.subActivated.unsubscribe();
        }
    }

    onUserUpdate(user: User) {
        this.user = user;
    }
    
    private initUserLoaded(server_response:ServerResponse):void {
        this.user = server_response.value;
        this._appService.pageLoaded = true;
    }

}
