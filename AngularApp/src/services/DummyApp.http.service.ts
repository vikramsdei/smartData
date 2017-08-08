import {Injectable} from '@angular/core';
import {Headers, Response, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {JwtHelper} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {AppConfig} from '../app.config';
import {SitedownService} from "./site_down.service";
import {ServerResponse} from "../models/server.response";

// Base class that helps services connect to the backend DummyApp server.
// this has functionality to allow setting of security headers and managing auth tokens.
@Injectable()
export class DummyAppHttpService {
    private jwtHelper:JwtHelper = new JwtHelper();

    constructor(private _siteDownServiceInternal:SitedownService) {
    }

    // What is the server of the sonder mind server we want to connect to.
    protected getServerDomain():string {
        return AppConfig.api_server;
    }

    // Use this to generate a url to the sonder mind server.
    // params: url - format of "/api/users/:user_id.json
    // params: params - Hash of keys and values.
    // returns : new url with all parameter change out.
    protected  generateUrl(url:string, params:any):string {
        var new_url = url;
        var variables = new_url.match(/:[a-zA-Z_]*/g);

        // console.log("Checking url " + url + " - " + JSON.stringify(variables));
        for(var index in variables) {
            // console.log("Var " + index + " - " + variables[index]);
            var keyname = variables[index].toString().replace(":", "");
            if (typeof  params[keyname] === "undefined" || typeof keyname === "undefined") {
                continue;
            }

            new_url = new_url.replace(variables[index], params[keyname]);
        }


        return this.getServerDomain() + new_url;
    }

    // Create a request option object that has the auth headers pre filled out.
    protected  authRequestOptions():RequestOptions {
        return new RequestOptions({headers: this.getHeaders(true)});
    }
    protected  noAuthRequestOptions():RequestOptions {
        return new RequestOptions({headers: this.getHeaders(false)});
    }

    protected getHeaders(includeToken: boolean = true):Headers {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        if (includeToken && this.getCurrentJwt() ) {
            headers.append("JWTTOKEN", this.getCurrentJwt());
            headers.append("CLIENTTOKEN", this.clientToken());
        }
        return headers;
    }

    protected setCurrentJwt(user_id:number, token:string):void {
        localStorage.setItem('id_token', token);
        localStorage.setItem('user_id', ""+user_id.toString());
    }

    protected clientToken():string {
        return localStorage.getItem('client_token');
    }

    protected  handleUnAuthorized(response:Response):Observable<any> {
        if (response.status === 401) {
            return Observable.of(false);
        }
        return null;
    }

    protected handleErrorObject(error:Response,object_name):Observable<any> {
        if (error.status === 0 || error.status === 500) {
            this._siteDownServiceInternal.appdown = true;
            return Observable.of(error);
        }
        var login_check =  this.handleUnAuthorized(error);
        if (login_check != null) {
            return login_check;
        }

        var server_response = new ServerResponse(error, object_name);
        return Observable.throw(server_response);
    }

    protected handleError(error:Response) {
        if (error.status === 0 || error.status === 500) {
            this._siteDownServiceInternal.appdown = true;
        }
        var login_check =  this.handleUnAuthorized(error);
        if (login_check != null) {
            return login_check;
        }

        console.error(error);
        return Observable.throw(error || 'Server error');
    }

    protected resetJwt():void {
        localStorage.removeItem('id_token');
        localStorage.removeItem('user_id');
    }


    private getCurrentJwt():string {
        return localStorage.getItem('id_token');
    }

    getCurrentUserId():string {
        return localStorage.getItem('user_id');
    }


}