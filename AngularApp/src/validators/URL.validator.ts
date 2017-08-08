import {AbstractControl} from '@angular/forms';

export class URLValidator {
    static format(c: AbstractControl): {[key: string]: any} {
        var reg = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\?#]\S*)?$/i;
        if ( typeof c.value === "undefined" || c.value === null || c.value.toString().trim().length === 0) {
            return null;
        }

        if (!reg.test(c.value)) {
            return {"URLFormat": "Must be a valid URL (please include http:// header)"};
        } else {
            return null;
        }
    }
}