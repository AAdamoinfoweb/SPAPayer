import {NgModule} from '@angular/core';
import {OrderByPipe} from './orderby-pipe';
import {ParseHtmlPipe} from './parseHtml-pipe';
import {ReplacePipe} from './ReplacePipe';

@NgModule({
  declarations: [OrderByPipe, ParseHtmlPipe, ReplacePipe],
  exports: [OrderByPipe, ParseHtmlPipe, ReplacePipe]
})
export class PipeModule {
}
