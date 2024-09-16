import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child-page',
  standalone: true,
  imports: [],
  templateUrl: './child-page.component.html',
  styleUrl: './child-page.component.scss',
})
export class ChildPageComponent {

  @Input() Name : string
  ngOnInit(): void {
      console.log(this.Name);
  }
}
