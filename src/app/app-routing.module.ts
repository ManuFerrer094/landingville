import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { DemoProfileComponent } from './demo-profile/demo-profile.component';
import { OrganizationComponent } from './organization/organization.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'demo', component: DemoProfileComponent },
  { path: 'landing/:userIndex', component: LandingComponent },
  { path: 'organization/:orgName', component: OrganizationComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
