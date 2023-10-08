import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-transaction',
  templateUrl: 'transaction.component.html',
  styleUrls: ['transaction.component.css'],
})
export class Transaction {
  @Input()
  date: string = '06/07/2023'
  @Input()
  amount: string = '$9.99'
  @Input()
  name: string = 'Hyper Monthly'
  constructor() {}
}
