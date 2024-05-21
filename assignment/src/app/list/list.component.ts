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

  pieChartData: number[] = [];
  pieChartLabels: string[] = [];
  pieChartType: string = 'pie';
  pieChartColors: any[] = [{ backgroundColor: [] }];
  pieChartOptions: any;

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
      this.prepareChartData();
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
        this.prepareChartData();
      });
    }
  }

  incrementAmount(parfume: any) {
    parfume.amount += 1;
    this.updateParfume(parfume);
  }

  decrementAmount(parfume: any) {
    if (parfume.amount > 0) {
      parfume.amount -= 1;
      this.updateParfume(parfume);
    }
  }

  updateParfume(parfume: any) {
    this.appService.updateParfume(parfume._id, parfume).subscribe(response => {
      console.log('Parfume updated', response);
      this.prepareChartData();
    });
  }

  prepareChartData() {
    // Initialize an empty array to store the data for the pie chart
    const chartData = [];
    this.pieChartData = [];
    this.pieChartLabels = [];

    // Iterate over the list of perfumes and add their names and amounts to the chartData array
    this.Parfume.forEach(parfume => {
      chartData.push({
        label: parfume.parfumeName,
        data: parfume.amount
      });
    });

    // Extract labels and data from chartData array
    chartData.forEach(item => {
      this.pieChartLabels.push(item.label);
      this.pieChartData.push(item.data);
      this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
    });

    this.pieChartOptions = {
      title: {
        display: true,
        text: 'Parfümök mennyisége név szerint',
        fontSize: 20,
        fontColor: 'black'
      },
      legend: {
        labels: {
          fontColor: 'black',
        }
      },
      tooltips: {
        callbacks: {
          labelTextColor: function() {
            return '#FFFFFF';
          }
        }
      }
    };
  }

  // Generate a random color for the pie slice
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
