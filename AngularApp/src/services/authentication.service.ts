import {Injectable  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {DummyAppHttpService} from './DummyApp.http.service';
import {Http,  Response, URLSearchParams} from '@angular/http';
import 'rxjs/Rx';
import {User} from "../models/user";
import {SitedownService} from "./site_down.service";
declare var Intercom: any;
import {AppConfig} from '../app.config';

@Injectable()
export class AuthenticationService extends DummyAppHttpService {

    constructor(private _http:Http, private _sitedownService:SitedownService) {
        super(_sitedownService);
    }

    logout() {
        this.resetJwt();
    }

    loginWithInvitecode(invite_code:string):Observable<any> {
        localStorage.removeItem("client_token");
        localStorage.removeItem('id_token');
        localStorage.removeItem('user_id');

        var options = this.noAuthRequestOptions();
        localStorage.removeItem("client_token");
        localStorage.removeItem('id_token');
        localStorage.removeItem('user_id');

        var token = "" + new Date().getTime();
        localStorage.setItem('client_token', token);
        options.headers.append("CLIENTTOKEN", token);


        return this._http.post(this.generateUrl('/api/sessions.json', { }),
            JSON.stringify({invite_code: invite_code}),
            options
        )
        .map((res:Response) => this.processLogin(res))
        .catch(this.handleError);
    }

// /api/sessions/reset_password_instructions(.:format)
// /api/sessions/reset_password(.:format)
    sendResetPasswordInfo(user_name:string):Observable<any> {
        var search = new URLSearchParams();
        search.set("user[user_name]", user_name);
        let options = this.noAuthRequestOptions();
        options.search = search;

        return this._http.get(this.generateUrl('/api/sessions/reset_password_instructions.json', { }), options)
        .map((res:Response) => {})
        .catch(this.handleError);
    }


    resetPassword(password: string, password_confirmation: string, reset_password_token: string):Observable<any> {
        var options = this.noAuthRequestOptions();
        var token = "" + new Date().getTime();
        localStorage.setItem('client_token', token);
        options.headers.append("CLIENTTOKEN", token);

        return this._http.patch(this.generateUrl('/api/sessions/reset_password.json', { }),
            JSON.stringify({password: password, password_confirmation: password_confirmation, reset_password_token: reset_password_token}),
            options
        )
        .map((res:Response) => this.processLogin(res))
        .catch(this.handleError);
    }

    login(user_name:string, password:string):Observable<any> {
        var options = this.noAuthRequestOptions();
        var token = "" + new Date().getTime();
        localStorage.setItem('client_token', token);
        options.headers.append("CLIENTTOKEN", token);

        return this._http.post(this.generateUrl('/api/sessions.json', { }),
            JSON.stringify({user: {username: user_name, password: password}}),
            options
        )
        .map((res:Response) => this.processLogin(res))
        .catch(this.handleError);
    }

    private processLogin(res:Response):User {
        var data = res.json();
        var u = new User();
        u.load_from_json(data.user);
        if (data.meta && data.meta.jwtToken) {
            if (AppConfig.intercom_enabled) {
                Intercom("boot", {
                    app_id: "knnj0h7c",
                    user_id: "" + u.id.toString(),
                    user_hash: u.intercomUserHash
                });
            }

            this.setCurrentJwt(u.id, data.meta.jwtToken);
        }
        return u;
    }

}