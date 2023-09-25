import { NgModule } from '@angular/core';
import { SearchPipe } from './filter.pipe';
@NgModule({
    imports: [
        // dep modules
    ],
    declarations: [
        SearchPipe
    ],
    exports: [
        SearchPipe
    ]
})
export class SharedModule {

}