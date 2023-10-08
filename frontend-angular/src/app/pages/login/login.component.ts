import { Component } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http';
import { NgxSpinner } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class Login {
  raw7mql: string = ' '
  constructor(private http: HttpClient, private title: Title, private meta: Meta) {
    this.title.setTitle('Log In')
    this.meta.addTags([{name: 'description', content: 'Login to your account to be able to access everything',}, {property: 'og:title', content: 'Log In',}, {property: 'og:description', content: 'Login to your account to be able to access everything',}, {property: 'og:image', content: 'https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/70dc84ed-902e-47ba-a9d3-d75e24c32e1d?org_if_sml=1',},])
  }

  login = (event: any) => {
    event.target.disabled = true
    event.target.innerHTML = '<ngx-spinner type="ball-clip-rotate" size="medium" color="#fff"></ngx-spinner>'

  }
}
