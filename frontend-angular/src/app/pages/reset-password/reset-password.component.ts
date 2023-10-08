import { Component } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.component.html',
  styleUrls: ['reset-password.component.css'],
})
export class ResetPassword {
  rawtr7z: string = ' '
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Reset your password')
    this.meta.addTags([
      {
        name: 'description',
        content:
          "Forgot your password? No worries, just enter your email and we'll send a link to reset your password!",
      },
      {
        property: 'og:title',
        content: 'Reset your password',
      },
      {
        property: 'og:description',
        content:
          'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC.',
      },
      {
        property: 'og:image',
        content:
          'https://aheioqhobo.cloudimg.io/v7/_playground-bucket-v2.teleporthq.io_/39ebfb3d-48ba-4ad3-b4e3-71d35b211205/70dc84ed-902e-47ba-a9d3-d75e24c32e1d?org_if_sml=1',
      },
    ])
  }
}
