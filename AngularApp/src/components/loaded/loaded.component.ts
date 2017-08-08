import {Component, Input} from '@angular/core';
import {ApplicationService} from "../../services/application.service";

@Component({
    selector: 'loaded',
    template: require("./view.html")
})

export class LoadedComponent   {
    @Input() loaded = false;

    constructor(private _appService:ApplicationService) {

    }

    get showLoaded():boolean {
        return this._appService.loading;
    }
}


















