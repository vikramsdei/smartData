import {Component} from '@angular/core';
import {ApplicationService} from "../../services/application.service";
import {SitedownService} from "../../services/site_down.service";

@Component({

    selector: 'server-down',
    template: require("./view.html")
})

export class ServerDownComponent  {
   siteDownService:SitedownService;

    constructor(private _appService:ApplicationService, private _sitedownService:SitedownService) {
        this.siteDownService = _sitedownService;
    }


}