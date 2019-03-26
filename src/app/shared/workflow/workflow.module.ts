import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkflowComponent} from './workflow.component';
import {WorkflowService} from './workflow.service';

// export const routes: Routes = [
//     {
//         path: '',
//         component: WorkflowComponent,
//         data: {
//             authorities: ['ROLE_USER', 'ROLE_ADMIN'],
//             pageTitle: '工作流'
//         },
//         canActivate: [UserRouteAccessService]
//     }
// ];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        WorkflowComponent,
    ],
    exports: [
        WorkflowComponent
    ],
    bootstrap: [WorkflowComponent],
    providers: [
        WorkflowService
    ]
})
export class WorkflowModule {
    // static forRoot(): ModuleWithProviders {
    //     return {
    //         ngModule: WorkflowModule
    //     };
    // }
}


