import { Component } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'coming-soon',
  templateUrl: 'coming-soon.component.html',
  styleUrls: ['coming-soon.component.css'],
})
export class ComingSoon {
  rawptk7: string = ' '
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('ComingSoon - Wulfco ID')
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC.',
      },
      {
        property: 'og:title',
        content: 'ComingSoon - Wulfco ID',
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
