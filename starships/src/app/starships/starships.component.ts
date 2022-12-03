import { Component, OnInit } from '@angular/core';
import { tap,take } from 'rxjs';
import { StarshipsService } from '../starships.service';

@Component({
  selector: 'app-starships',
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.css']
})
export class StarshipsComponent{
  data$ = this.starshipsService.data$;

  constructor(private starshipsService: StarshipsService) {}

  pagination(url: string) {
    this.starshipsService.go(url);
  }
}
