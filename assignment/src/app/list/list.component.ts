import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { AppService } from '../app.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  Parfume: any = [];
  user = new User();
  username: string;

  constructor(private router: Router,
              private appService: AppService)
  {
    this.getParfume();
    this.getUser();
  }

  ngOnInit(): void {
  }

  getParfume() {
    this.appService.getParfume().subscribe((data) => {
      this.Parfume = data;
    });
  }

  getUser(){

    if (this.appService.getLoggedInUser().uname == null)
    {
      this.router.navigate(['/login']);
    }

    this.user = this.appService.getLoggedInUser();
    this.username = JSON.stringify(this.user.uname);
  }

  deleteParfume(id: string, index: number) {
    if (confirm('Biztosan törli a parfümöt?')) {
      this.appService.deleteParfume(id).subscribe(() => {
        this.Parfume.splice(index, 1); // Remove the perfume from the array
      });
    }
  }

  logout(){
    this.user = new User();
    this.appService.setLoggedInUser(this.user);
    this.router.navigate(['/login']);
  }
  back(){
    this.router.navigate(['/add']);
  }
}
