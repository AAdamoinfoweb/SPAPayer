import {NgModule} from '@angular/core';
import {OrderByPipe} from './orderby-pipe';
import {ParseHtmlPipe} from './parseHtml-pipe';
import {ReplacePipe} from './ReplacePipe';
import {CommonModule} from '@angular/common';
import {CustomValidator} from './custom-validator.directive';

@NgModule({
  declarations: [OrderByPipe, ParseHtmlPipe, ReplacePipe, CustomValidator],
  imports: [CommonModule],
  exports: [OrderByPipe, ParseHtmlPipe, ReplacePipe, CustomValidator]
})
export class PipeModule {
}
