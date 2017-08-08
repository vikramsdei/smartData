import { NgModule , Injectable, ErrorHandler, ViewContainerRef}      from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule}      from '@angular/common';
import { ReactiveFormsModule, FormsModule}      from '@angular/forms';
import { Router, RouterOutlet, RouterLink,ActivatedRouteSnapshot , RouterModule, CanActivate,  RouterLinkWithHref,RouterStateSnapshot, RouterLinkActive} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {BrowserModule} from '@angular/platform-browser';
import { AccordionModule, TooltipModule } from 'ng2-bootstrap';
import {AuthenticationService} from "./services/authentication.service";
import {ApplicationService} from "./services/application.service";
import {LocationService} from "./services/locaiton.service";
import {OfficeService} from "./services/office.service";
import {CalendarModule} from "primeng/primeng";
import {MemberAppComponent} from "./member.app.component";
import {DateFormatPipe} from "angular2-moment";
import {UserService} from "./services/user.service";
import {SitedownService} from "./services/site_down.service";
import {MembershipLevelService} from "./services/membership_level.service";
import { NgIdleModule } from '@ng-idle/core';
import {LoginPage} from "./pages/login/login.page";
import {AccountInfoPage} from "./member/pages/account-info/account-info.page";
import {ProfilePage} from "./member/pages/profile/profile.page";
import {PaymentMethodPage} from "./member/pages/payment-method/payment-method.page";
import {InvoicesPage} from "./member/pages/invoices/invoices.page";
import {UnsignedDocumentsPage} from "./member/pages/unsigned-documents/unsigned-documents.page";
import {CalendarPage} from "./member/pages/calendar/calendar.page";
import {ClientsPage} from "./member/pages/clients/clients.page";
import {SignupWizardPage} from "./member/pages/signup-wizard/signup-wizard.page";
import {MembershipPage} from "./member/pages/membership/membership.page";
import {NoPrivateBrowsingPage} from "./pages/no-private-browsing/no-private-browsing.page";
import {ReservationPage} from "./member/pages/reservations/reservations.page";
import {SoloAvailablityPage} from "./member/pages/solo_availability/solo_availability.page";
import {MemberLeftNavComponent} from "./member/components/left-nav/left-nav.component";
import {ServerDownComponent} from "./components/server-down/server_down.component";
import {LoadingComponent} from "./components/loading/loading.component";
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { HttpModule } from "@angular/http";
import {ErrorListComponent} from "./components/error_list/error_list.component";
import {FormFieldErrorNoticeComponent} from "./components/form-field-error-notice/form-field-error-notice.component";
import {SaveButtonComponent} from "./components/save-button/save-button.component";
import {AlertDialogueComponent} from "./components/alert-dialogue/alert-dialogue.component";
import {AccountInfoComponent} from "./member/components/account-info/account-info.component";
import {MyAccountTopNavComponet} from "./member/components/my-account-top-nav/my-account-top-nav.component";
import {ProfileSubmitComponet} from "./member/components/profile-submit/profile-submit.component";
import {ContactInfoComponent} from "./member/components/contact-info/contact-info.component";
import {SpecialitesComponet} from "./member/components/specialities/specialities.component";
import {ClientFocusComponet} from "./member/components/client-focus/client-focus.component";
import {PaymentTypesComponet} from "./member/components/payment-types/payment-types.component";
import {TreatmentApproachesComponent} from "./member/components/treatment-approaches/treatment-approaches.component";
import {LanguagesSpokenComponent} from "./member/components/languages-spoken/languages-spoken.component";
import {CancelButtonComponent} from "./components/cancel-button/cancel-button.component";
import {CredentialFormComponent} from "./member/components/credentials/credential-form/credential-form.component";
import {EditCredentialComponent} from "./member/components/credentials/edit-credential/edit-credential.component";
import {NewCredentialComponent} from "./member/components/credentials/new-credential/new-credential.component";
import {DeleteConfirmationComponent} from "./components/delete-confirmation/delete-confimation.component";
import {CredentialTypeNamePipe} from "./pipes/credential-type-name.pipe";
import {FormatServerDatePipe} from "./pipes/format-server-date.pipe";
import {ReferralCodeComponet} from "./member/components/referral-code/referral-code.component";
import {MembershipsComponent} from "./member/components/memberships/memberships.component";
import {CredentialsComponent} from "./member/components/credentials/credentials.component";
import {MembershipService} from "./services/membership.service";
import {NewPaymentMethodFormComponent} from "./member/components/payment-method/new-payment-method-forms/new-payment-method-form.component";
import {UnsignedDocumentsListComponent} from "./member/components/unsigned-documents-list/unsigned-documents-list.component";
import {UnsignedDocumentService} from "./services/unsigned_document.service";
import {SignDocumentComponent} from "./member/components/sign-document/sign-document.component";
import {AttachedDocumentService} from "./services/attached_document.service";
import {AccountPaymentMethodService} from "./services/account_payment_method.service";
import {NewPaymentMethodComponent} from "./member/components/payment-method/new-payment-method/new-payment-method.component";
import {BankAccountVerificationComponent} from "./member/components/payment-method/bank-account-verification/bank-account-verification.component";
import {PatientService} from "./services/patient_service";
import {NewPatientComponent} from "./member/components/patient/new-patient/new-patient-component";
import {AutoCompleteModule,  ScheduleModule} from 'primeng/primeng';
import {Confirmation} from "./member/components/event-creator/confirmation/confirmation.component";
import {EmbeddedClientChooser} from "./member/components/event-creator/embedded-client-chooser/embedded-client-chooser.component";
import {EmbeddedRoomListComponent} from "./member/components/event-creator/embedded-room-list/embedded-room-list.component";
import {EventCreator} from "./member/components/event-creator/event-creator.component";
import {ReservationViewComponent} from "./member/components/reservation-view/reservation-view.component";
import {LocationNamePipe} from "./pipes/location-name.pipe";
import {RoomReservationService} from "./services/room_reservation_service";
import {FormatPhonePipe} from "./pipes/format-phone.pipe";
import {MembershipLevelNamePipe} from "./pipes/membership_level_name.pipe";
import {OfficeNamePipe} from "./pipes/office-name.pipe";
import {SoloAvailableService} from "./services/solo_available_service";
import {LeaseService} from "./services/lease_service";
import {SoloViewComponent} from "./member/components/solo-view/solo-view.component";
import {SoloAvailabilityCreator} from "./member/components/solo-availablity-creator/solo-availablity-creator.component";
import {InvoiceService} from "./services/invoice.service";
import {InvoiceDetailsComponent} from "./components/invoice-details/invoice-details.component";
import {LedgerItemService} from "./services/ledger_item.service";
import {SoloOptinComponent} from "./member/components/solo-optin/solo-optin.component";
import {FormFieldErrorComponent} from "./components/form-field-error/form-field-error.component";
import {DashboardController} from "./member/controllers/dashboard/dashboard.controller";
import {NewPatientModalComponent} from "./member/components/patient/new-patient-modal/new-patient-modal-component";
import {FormatDatePipe} from "./pipes/format-date.pipe";
import {ReferenceDataService} from "./services/reference_data.service";
import {MemberTreatmentApproachesService} from "./services/member_treatment_approaches.service";
import {MemberLanguagesSpokenService} from "./services/member_languages_spoken.service";
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import {LoadedComponent} from "./components/loaded/loaded.component";
import {ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';
import {PhoneCallsPage} from "./member/pages/phone_calls/phone_calls.page";
import {PhoneCallService} from "./services/phone_call.service";
import {PhoneCallListComponent} from "./member/components/phone_call_list/phone_call_list.component";
import {PhoneCallDetailComponent} from "./member/components/phone_call_detail/phone_call_detail.component";
import {ReceptionSettingsComponent} from "./member/components/reception_settings/reception_settings.component";
import {CommunityRoomCalendarComponent} from "./member/components/community-room-calendar/community-room-calendar.component";
import {PrivateRoomCalendarComponent} from "./member/components/private-room-calendar/private-room-calendar.component";
import {MemberReservationComponent} from "./member/components/member-reservations/member-reservations.component";
import {PrivateEmbeddedClientChooser} from "./member/components/private-room-event-creator/private-embedded-client-chooser/private-embedded-client-chooser.component";
import {PrivateEmbeddedRoomListComponent} from "./member/components/private-room-event-creator/private-embedded-room-list/private-embedded-room-list.component";
import {PrivateConfirmation} from "./member/components/private-room-event-creator/private-confirmation/private-confirmation.component";
import {PrivateRoomEventCreator} from "./member/components/private-room-event-creator/private-room-event-creator.component";
import {AvailabilityCalendarComponent} from "./member/components/availability_calendar/availability-calendar.component";
import {MemberAvailabilityService} from "./services/member_availability_service";
import {AvailabilityView} from "./member/components/availability-view/availability-view.component";
import {SuperBillsPage} from "./member/pages/super-bills/super_bills.page";
import {SuperBillsService} from "./services/super_bills.service";
import {PatientListComponent} from "./member/components/patient-list/patient-list.component";
import {EditPatientModalComponent} from "./member/components/patient/edit-patient-modal/edit-patient-modal-component";
import {EditPatientComponent} from "./member/components/patient/edit-patient/edit-patient-component";
import {PatientInsuranceService} from "./services/patient_insurance_service";
import {ListPatientInsuranaceComponent} from "./member/components/patient-insurance/list-patient-insuranace/list-patient-insurance.component";
import {ProviderNetworkNamePipe} from "./pipes/provider-network-name.pipe";
import {NewPatientInsuranceComponent} from "./member/components/patient-insurance/new-patient-insurance/new-patient-insurance.component";
import {EditPatientInsuranceComponent} from "./member/components/patient-insurance/edit-patient-insurance/edit-patient-insurance.component";
import {NewSuperBillModalComponent} from "./member/components/super-bill/new-super-bill-modal/new-super-bill-modal.component";
import {EditSuperBillComponent} from "./member/components/super-bill/edit-super-bill/edit-super-bill.component";
import {SuperBillCptCodesComponent} from "./member/components/super-bill/super-bill-cpt-codes/super-bill-cpt-codes.component";
import {SuperBillListComponent} from "./member/components/super-bill/super-bill-list/super-bill-list.component";
import {SuperBillsCptCodeService} from "./services/super_bills_cpt_code.service";
import {SuperBillIdcCodesComponent} from "./member/components/super-bill/super-bill-idc-codes/super-bill-idc-codes.component";
import {SuperBillsIdcCodeService} from "./services/super_bills_idc_code.service";
import {SuperBillInsurnacesComponent} from "./member/components/super-bill/super-bill-insurances/super-bill-insurnaces.component";
import {SuperBillsInsurnaceService} from "./services/super_bills_insurance.service";
import {SuperBillStatePipe} from "./pipes/super-bill-state.pipe";
import {MembershipNoticeComponent} from "./member/components/membership-notice/membership-notice.component";


declare var trackJs: any;

@Injectable()
class HasLocalStorage implements CanActivate {
    constructor(private _router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        try {
            localStorage.setItem('test_private', "no");
        } catch (err) {
            this._router.navigate(['/no_private_browsing']);
        }
        return Observable.of(true);
    }
}

@Injectable()
class IsMemberLoggedIn implements CanActivate {
    constructor(private _applicationService: ApplicationService,
                private _router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (this._applicationService.userLoggedIn()) {
            return Observable.of(true);
        }
        this._router.navigate(['/login']);
        return Observable.of(true);
    }
}


declare var trackJs: any;

class MyExceptionHandler extends ErrorHandler {
    handleError(error:any) {
        // Add the error message to the telemetry timeline.
        // It can occasionally have useful additional context.
        console.warn(error.message);
        try {
            console.warn(error.stack);
        } catch (e) {

        }
        // Assumes we have already loaded and configured TrackJS*
        if (trackJs) {
            trackJs.track(error.originalError); // Send the native error object to TrackJS
        } else {

        }
    }
}



var routes = [
    {
        path: '',
        component: LoginPage,
        canActivate: [HasLocalStorage]
    },
    {
        path: 'login',
        component: LoginPage,
        canActivate: [HasLocalStorage]
    },
    {
        path: 'reset_password/:token',
        component: LoginPage,
        canActivate: [HasLocalStorage]
    },
    {
        path: 'account_info/:user_id',
        component: AccountInfoPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'patients/:user_id',
        component: ClientsPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'membership/:user_id',
        component: MembershipPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'profile/:user_id',
        component: ProfilePage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'solo_availability/:view/:user_id',
        component: SoloAvailablityPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'calendar/:active_tab/:user_id',
        component: CalendarPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'phone_calls/:user_id',
        component: PhoneCallsPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'payment_method/:user_id',
        component: PaymentMethodPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'signup_wizard/:user_token',
        component: SignupWizardPage,
        canActivate: [HasLocalStorage],
        data: {
            ignoreCurrentUser: true
        }
    },
    {
        path: 'super_bills/:user_id',
        component: SuperBillsPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'invoices/:user_id',
        component: InvoicesPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'unsigned/:user_id',
        component: UnsignedDocumentsPage,
        canActivate: [HasLocalStorage, IsMemberLoggedIn]
    },
    {
        path: 'no_private_browsing',
        component: NoPrivateBrowsingPage,
        canActivate: []
    }
];



let toastOptions: ToastOptions = new ToastOptions({
    animate: 'flyRight',
    positionClass: 'toast-bottom-right',
});

@NgModule({
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy},
        { provide: ErrorHandler, useClass: MyExceptionHandler},
        AccountPaymentMethodService,
        ApplicationService,
        AttachedDocumentService,
        SuperBillsService,
        AuthenticationService,
        HasLocalStorage,
        InvoiceService,
        MemberTreatmentApproachesService,
        MemberLanguagesSpokenService,
        IsMemberLoggedIn,
        LeaseService,
        PhoneCallService,
        LedgerItemService,
        SuperBillsCptCodeService,
        SuperBillsIdcCodeService,
        LocationService,
        MembershipLevelService,
        MembershipService,
        OfficeService,
        PatientService,
        PatientInsuranceService,
        ReferenceDataService,
        RoomReservationService,
        SitedownService,
        SoloAvailableService,
        MemberAvailabilityService,
        SuperBillsInsurnaceService,
        UnsignedDocumentService,
        UserService,
        Angulartics2GoogleAnalytics
    ],
    imports: [
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        ToastModule.forRoot(toastOptions),
        CalendarModule,
        CommonModule,
        BrowserModule,
        Ng2Bs3ModalModule,
        ReactiveFormsModule,
        FormsModule,
        AutoCompleteModule,
        HttpModule,
        ScheduleModule,
        RouterModule.forRoot(routes),
        NgIdleModule.forRoot(),
        Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])

    ],
    declarations: [
        FormatDatePipe,
        ProviderNetworkNamePipe,
        AccountInfoComponent,
        AvailabilityView,
        PhoneCallListComponent,
        SuperBillCptCodesComponent,
        SuperBillListComponent,
        SuperBillInsurnacesComponent,
        NewPatientInsuranceComponent,
        EditPatientInsuranceComponent,
        SuperBillIdcCodesComponent,
        NewSuperBillModalComponent,
        MembershipNoticeComponent,
        PhoneCallDetailComponent,
        ReceptionSettingsComponent,
        ListPatientInsuranaceComponent,
        PatientListComponent,
        EditSuperBillComponent,
        AccountInfoPage,
        SuperBillsPage,
        EditPatientComponent,
        AlertDialogueComponent,
        BankAccountVerificationComponent,
        PrivateRoomEventCreator,
        PrivateEmbeddedClientChooser,
        PrivateEmbeddedRoomListComponent,
        PrivateConfirmation,
        CalendarPage,
        AvailabilityCalendarComponent,
        PhoneCallsPage,
        CancelButtonComponent,
        ClientFocusComponet,
        ClientsPage,
        Confirmation,
        ContactInfoComponent,
        CredentialFormComponent,
        CommunityRoomCalendarComponent,
        PrivateRoomCalendarComponent,
        MemberReservationComponent,
        CredentialsComponent,
        CredentialTypeNamePipe,
        SuperBillStatePipe,
        DashboardController,
        DateFormatPipe,
        DeleteConfirmationComponent,
        EditCredentialComponent,
        EditPatientModalComponent,
        EmbeddedClientChooser,
        EmbeddedRoomListComponent,
        ErrorListComponent,
        EventCreator,
        FormatPhonePipe,
        FormatServerDatePipe,
        FormFieldErrorComponent,
        FormFieldErrorNoticeComponent,
        InvoiceDetailsComponent,
        InvoicesPage,
        LanguagesSpokenComponent,
        LoadingComponent,
        LoadedComponent,
        LocationNamePipe,
        LoginPage,
        MemberAppComponent,
        MemberLeftNavComponent,
        MembershipLevelNamePipe,
        MembershipPage,
        MembershipsComponent,
        MyAccountTopNavComponet,
        NewPatientModalComponent,
        NewCredentialComponent,
        NewPatientComponent,
        NewPaymentMethodComponent,
        NewPaymentMethodFormComponent,
        NoPrivateBrowsingPage,
        OfficeNamePipe,
        PaymentMethodPage,
        PaymentTypesComponet,
        ProfilePage,
        ProfileSubmitComponet,
        ReferralCodeComponet,
        ReservationPage,
        ReservationViewComponent,
        SaveButtonComponent,
        ServerDownComponent,
        SignDocumentComponent,
        SignupWizardPage,
        SoloAvailabilityCreator,
        SoloAvailablityPage,
        SoloOptinComponent,
        SoloViewComponent,
        SpecialitesComponet,
        TreatmentApproachesComponent,
        UnsignedDocumentsListComponent,
        UnsignedDocumentsPage
    ],
    bootstrap: [
        MemberAppComponent
    ]
})



export class AppModule {
}