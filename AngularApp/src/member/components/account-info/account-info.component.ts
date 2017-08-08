import {Component, Input, OnInit, Output, EventEmitter,ViewChild } from '@angular/core';
import {FormBuilder, Validators, FormControl, FormGroup} from '@angular/forms';
import {ApplicationService} from "../../../services/application.service";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {ServerResponse} from "../../../models/server.response";
import {ReferenceDataService} from "../../../services/reference_data.service";
import {EmailValidator} from "../../../validators/email.validator";
import {ZipcodeValidator} from "../../../validators/zipcode.validator";
import {PhoneValidator} from "../../../validators/phone.validator";
import {PasswordValidator} from "../../../validators/password.validator";
import {FieldMatchValidator} from "../../../validators/field-match.validator";
import {UsernameValidator} from "../../../validators/username.validator";
import {AlertDialogueComponent} from "../../../components/alert-dialogue/alert-dialogue.component";

@Component({
    selector: 'member-account-info',
    template: require("./view.html"),
    providers: [UserService]
})

export class AccountInfoComponent implements OnInit {

    @Input() user:User = new User();
    @Output() modelSaved = new EventEmitter<User>();
    edit_user:User = new User();
    referenceData:ReferenceDataService;
    public saving:boolean = false;
    @ViewChild("alertMessage") alertModal:AlertDialogueComponent;

    
    form:FormGroup = null;
    
    fullName:FormControl = null;
    username:FormControl = null;
    email:FormControl = null;
    mailingAddress:FormControl = null;
    mailingAddress2:FormControl = null;
    password:FormControl = null;
    passwordConfirmation:FormControl = null;
    mailingCity:FormControl = null;
    mailingState:FormControl = null;
    mailingPostalCode:FormControl = null;
    phoneNumber:FormControl = null;
    timeZone:FormControl = null;
    subscriptionSMS = null;
    cellphoneNumber = null;
    remittanceAddress = null;
    nextMembershipLevelId = null;
    practiceName = null;



    constructor(private _appService:ApplicationService,  private _userService:UserService, private _builder:FormBuilder) {
        this.referenceData = this._appService.refData;

        this.fullName = new FormControl(null, Validators.required);
        this.username = new FormControl(null, Validators.compose([Validators.required, UsernameValidator.format]));
        this.email = new FormControl(null, Validators.compose([Validators.required, EmailValidator.format]));
        this.mailingAddress = new FormControl(null, Validators.required);
        this.mailingAddress2 = new FormControl(null);
        this.password = new FormControl(null, Validators.compose([PasswordValidator.format]));
        this.passwordConfirmation = new FormControl(null, Validators.compose([PasswordValidator.format]));
        this.mailingCity = new FormControl(null, Validators.required);
        this.mailingState = new FormControl(null, Validators.required);
        this.mailingPostalCode = new FormControl(null, Validators.compose([Validators.required, ZipcodeValidator.format]));
        this.phoneNumber = new FormControl(null, Validators.compose([Validators.required, PhoneValidator.format]));
        this.timeZone = new FormControl(null, Validators.required);
        this.practiceName = new FormControl(null);

        this.subscriptionSMS = new FormControl(null);
        this.cellphoneNumber = new FormControl(null, Validators.compose([PhoneValidator.format]));
        this.remittanceAddress = new FormControl(null, Validators.required);


        this.form = this._builder.group({
            fullName: this.fullName,
            username: this.username,
            email: this.email,
            mailingAddress: this.mailingAddress,
            mailingAddress2: this.mailingAddress2,
            password: this.password,
            passwordConfirmation: this.passwordConfirmation,
            mailingCity: this.mailingCity,
            mailingState: this.mailingState,
            mailingPostalCode: this.mailingPostalCode,
            phoneNumber: this.phoneNumber,
            timeZone: this.timeZone,
            subscriptionSMS: this.subscriptionSMS,
            cellphoneNumber: this.cellphoneNumber,
            remittanceAddress: this.remittanceAddress,
            practiceName: this.practiceName
        }, {validator: FieldMatchValidator.compareFields('password', 'passwordConfirmation', " Passwords do not match ")} );


    }

    ngOnInit() {
        this.updateControls();
    }


    onCancel() {
        this.updateControls();
    }

    onSubmit() {
        if (this.saving || !this.form.valid) {
            this.alertModal.open("Data did not pass validation",
                "We are sorry but something about the data you are entering is not valid.  Please check the error messaes on the screen.");
            return;
        }
        
        this.saving = true;
        
        var user:User = new User();
        user.fullName = this.fullName.value;
        user.username = this.username.value;
        user.email = this.email.value;
        user.mailingAddress = this.mailingAddress.value;
        user.mailingAddress2 = this.mailingAddress2.value;
        user.password = this.password.value;
        user.passwordConfirmation = this.passwordConfirmation.value;
        user.mailingCity = this.mailingCity.value;
        user.mailingState = this.mailingState.value;
        user.mailingPostalCode = this.mailingPostalCode.value;
        user.phoneNumber = this.phoneNumber.value;
        user.timeZone = this.timeZone.value;
        user.id = this.user.id;
        user.remittanceAddress = this.remittanceAddress.value;
        user.cellphoneNumber = this.cellphoneNumber.value;
        user.subscriptionSMS = this.subscriptionSMS.value;
        user.practiceName = this.practiceName.value;

        this._userService.update(user).subscribe(
            server_response => {
                this.saveSuccess(server_response);
                this._appService.successMessage("Save", "Profile Saved");
                this.saving = false;
            },
            error => {
                this.saveError(error);
                this._appService.successMessage("NOT Save", "Profile NOT Saved");
                this.saving = false;
            }
        );
    }

    private updateControls():void {
        this.fullName.setValue(this.user.fullName);
        this.username.setValue(this.user.username);
        this.email.setValue(this.user.email);
        this.mailingAddress.setValue(this.user.mailingAddress);
        this.mailingAddress2.setValue(this.user.mailingAddress2);
        this.password.setValue(null);
        this.passwordConfirmation.setValue(null);
        this.mailingCity.setValue(this.user.mailingCity);
        this.mailingState.setValue(this.user.mailingState);
        this.mailingPostalCode.setValue(this.user.mailingPostalCode);
        this.phoneNumber.setValue(this.user.phoneNumber);
        this.timeZone.setValue(this.user.timeZone);
        this.remittanceAddress.setValue(this.user.remittanceAddress);
        this.cellphoneNumber.setValue(this.user.cellphoneNumber);
        this.subscriptionSMS.setValue(this.user.subscriptionSMS);
        this.practiceName.setValue(this.user.practiceName)
;
    }
    
    private saveSuccess(server_response:ServerResponse):void {
        this._appService.publishErrors(server_response);

        if (server_response.has_value()) {

            this.user = server_response.value;
            this.edit_user = Object.assign({}, server_response.value);
            this.modelSaved.emit(this.user);
            this.updateControls();
        }
    }

    private saveError(server_response:any):void {
        this._appService.publishErrors(server_response);
    }
}