import {NgModule} from '@angular/core';
import {OrderByPipe} from './orderby-pipe';
import {ParseHtmlPipe} from './parseHtml-pipe';
import {ReplacePipe} from './ReplacePipe';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [OrderByPipe, ParseHtmlPipe, ReplacePipe],
  imports: [CommonModule],
  exports: [OrderByPipe, ParseHtmlPipe, ReplacePipe]
})
export class PipeModule {
}
