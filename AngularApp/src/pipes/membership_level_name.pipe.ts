import { Pipe, PipeTransform } from '@angular/core';
import {ApplicationService} from "../services/application.service";
/*
 * Given the number id of a credential type return the name.
 * Usage:
 *   value | credentialTypeName
 */
@Pipe({name: 'membershipLevelName'})
export class MembershipLevelNamePipe implements PipeTransform {

    constructor(private _appService:ApplicationService) {
    }

    transform(value: any): string {
        if(typeof  value === 'undefined') {
            return "";
        }
        // console.log("looking for " + value);
        // console.log("in " + JSON.stringify(this._appService.membershipLevels.membershipLevelsLookup));
        return this._appService.membershipLevels.membershipLevelsLookup[value].title;
    }
}