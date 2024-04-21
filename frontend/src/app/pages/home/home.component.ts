import { Component } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class Home {
  raw1h1v: string = ' '
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Wulfco ID')
    this.meta.addTags([{name: 'description', content: 'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC.',}, {property: 'og:title', content: 'Wulfco ID',}, {property: 'og:description', content: 'Wulfco ID is a place where you can create one ID that you will use for all of the services created by Wulfco LLC.',}])
  }
}
