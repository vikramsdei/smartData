import {Component, Input} from '@angular/core';
import {ApplicationService} from "../../services/application.service";

@Component({
    selector: 'loading',
    template: require("./view.html")
})

export class LoadingComponent   {
    @Input() loading = false;

    messages: String[] = [
        "",

    ]

    constructor(private _appService:ApplicationService) {
    }

    get showLoading():boolean {
        return !this._appService.loading;
    }
}


















