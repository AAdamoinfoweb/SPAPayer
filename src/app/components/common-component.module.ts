import {ErrorHandler, NgModule} from "@angular/core";
import {FooterDirective} from "./footer/FooterDirective";
import {IntegerNumberDirective} from "../utils/IntegerNumberDirective";
import {DayInputDirective} from "../utils/DayInputDirective";
import {MonthInputDirective} from "../utils/MonthInputDirective";
import {SpinnerOverlayComponent} from "./spinner-overlay/spinner-overlay.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DesignAngularKitModule} from "design-angular-kit";
import {UserIdleModule} from "angular-user-idle";
import {DpDatePickerModule} from "ng2-date-picker";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {AccordionModule} from "primeng/accordion";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TabViewModule} from "primeng/tabview";
import {ToolbarModule} from "primeng/toolbar";
import {NgxCurrencyModule} from "ngx-currency";
import {CustomFormsModule} from "ngx-custom-validators";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AutoCompleteModule} from "primeng/autocomplete";
import {TreeTableModule} from "primeng/treetable";
import {OverlayModule} from "@angular/cdk/overlay";
import {ConfirmationService} from "primeng/api";
import {JwtInterceptorService} from "../services/jwt-interceptor.service";
import {BackendInterceptorService} from "../services/backend-interceptor";
import {ErrorHandlerGenerico} from "../services/errorHandlerGenerico";
import {UrlBackInterceptor} from "../services/urlBack.interceptor";
import {TableComponent} from "./table/table.component";
import {PipeModule} from "../pipe/pipe.module";
import {PaginatorComponent} from "./table/paginator/paginator.component";
import {CommonModule} from "@angular/common";
import {TabViewComponent} from "./tab-view/tab-view.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import { AvvisoCampiObbligatoriComponent } from './avviso-campi-obbligatori/avviso-campi-obbligatori.component';

@NgModule({
  declarations: [
    TableComponent,
    FooterDirective,
    IntegerNumberDirective,
    DayInputDirective,
    MonthInputDirective,
    SpinnerOverlayComponent,
    PaginatorComponent,
    TabViewComponent,
    ToolbarComponent,
    AvvisoCampiObbligatoriComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    DesignAngularKitModule,
    ReactiveFormsModule,
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120}),
    DpDatePickerModule,
    NgxDatatableModule,
    AccordionModule,
    TableModule,
    ButtonModule,
    BrowserAnimationsModule,
    TabViewModule,
    ToolbarModule,
    DpDatePickerModule,
    NgxCurrencyModule,
    CustomFormsModule,
    ConfirmDialogModule,
    BrowserAnimationsModule,
    CustomFormsModule,
    AutoCompleteModule,
    TreeTableModule,
    OverlayModule,
    PipeModule
  ],
  providers: [
    ConfirmationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: BackendInterceptorService, multi: true},
    {provide: ErrorHandler, useClass: ErrorHandlerGenerico},
    {provide: HTTP_INTERCEPTORS, useClass: UrlBackInterceptor, multi: true}
  ],
  exports: [
    FooterDirective,
    TableComponent,
    ToolbarComponent,
    TabViewComponent,
    AvvisoCampiObbligatoriComponent,
    AvvisoCampiObbligatoriComponent
  ],
})
export class CommonComponentModule {
}
