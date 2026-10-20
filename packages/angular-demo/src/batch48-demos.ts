import {Component,DestroyRef,inject,signal} from '@angular/core';
import {KitSignUpComponent,KitParticleDeleteComponent,type SignUpFormData} from 'kit-ui-angular';
@Component({selector:'kit-sign-up-demo',standalone:true,imports:[KitSignUpComponent],template:`<kit-sign-up [isLoading]="loading()" [error]="error()" [onSubmit]="submit" [onSignInClick]="signIn" [onSocialSignUp]="social"/><p>{{message()}}</p>`})
export class SignUpDemoComponent{
 readonly loading=signal(false);readonly error=signal<string|null>(null);readonly message=signal('Local demonstration; no credentials leave your browser');
 private timer:ReturnType<typeof setTimeout>|undefined;
 readonly submit=(data:SignUpFormData)=>{this.loading.set(true);this.error.set(null);if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(()=>{if(data.email.includes('fail'))this.error.set('Demo registration failed. Edit your email and try again.');else this.message.set('Registered locally as '+data.name);this.loading.set(false)},500)};
 readonly signIn=()=>this.message.set('Sign in callback');readonly social=(provider:string)=>this.message.set(provider+' callback; connect your own authentication');
 constructor(){inject(DestroyRef).onDestroy(()=>{if(this.timer)clearTimeout(this.timer)})}
}
@Component({selector:'kit-particle-delete-demo',standalone:true,imports:[KitParticleDeleteComponent],template:`<kit-particle-delete/>`})
export class ParticleDeleteDemoComponent{}
