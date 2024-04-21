import { Component } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-authorize',
  templateUrl: 'authorize.component.html',
  styleUrls: ['authorize.component.css'],
})
export class Authorize {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Authorize App Connection')
    this.meta.addTags([
      {
        name: 'description',
        content:
          'An app is asking for permission to read your account information, would you like to approve it?',
      },
      {
        property: 'og:title',
        content: 'Authorize App Connection',
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
