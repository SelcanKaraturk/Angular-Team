import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {

  teams: any;
  firstGroup: any = [];
  SecondGroup: any = [];
  ThirdGroup: any = [];
  FourthGroup: any = [];
  fifthGroup: any = [];
  sixthGroup: any = [];
  seventhGroup: any = [];
  groupScore: any = [];
  score: any = [];
  secondMatchTeams: any = [];
  buttonDisabled: boolean = false;

  constructor(private data: DataService) {
  }

  ngOnInit(): void {
    this.data.getTeams().subscribe(data => {
        this.teams = data;
        //console.log(this.teams);
      }
    )
  }

  randomFirstMatch() {
    for (let i = 0; i < this.teams.length; i++) {

      let value = this.teams[Math.floor(Math.random() * this.teams.length)];
      if (this.firstGroup.includes(value) || this.SecondGroup.includes(value) || this.ThirdGroup.includes(value) || this.FourthGroup.includes(value)) {
        continue;
      }
      if (this.firstGroup.length === 4) {
        if (this.SecondGroup.length === 4) {
          if (this.ThirdGroup.length === 4) {
            this.FourthGroup.push(value);
          } else {
            this.ThirdGroup.push(value);
          }
        } else {
          this.SecondGroup.push(value);
        }
      } else {
        this.firstGroup.push(value);
      }
    }
    if (this.FourthGroup.length < 4) {
      this.randomFirstMatch();
    }
  }

  randomSecondMatch() {

    for (let i = 0; i < this.secondMatchTeams.length; i++) {
      let value = this.secondMatchTeams[Math.floor(Math.random() * this.secondMatchTeams.length)];
      if (this.fifthGroup.includes(value) || this.sixthGroup.includes(value)) {
        continue;
      }
      if (this.fifthGroup.length === 4) {
        this.sixthGroup.push(value);
      } else {
        this.fifthGroup.push(value);
      }
    }
    if (this.sixthGroup.length < 4) {
      this.randomSecondMatch();
    }
  }

  getFirstMatch() {
    this.randomFirstMatch();
  }

  getSecondMatch() {
    this.randomSecondMatch()
  }

  Score(groupName: any) {
    this.score = [];
    this.groupScore = [];
    for (let i = 0; i < groupName.length; i++) {
      for (let j = i + 1; j < groupName.length; j++) {
        this.score.push(
          {
            'takim1': groupName[i],
            'takim2': groupName[j],
            'score1': Math.floor(Math.random() * 6),
            'score2': Math.floor(Math.random() * 6)
          }
        );
      }
    }
    this.score.forEach((val: any, key: any) => {
      if (val.score1 > val.score2) {
        let value = this.groupScore.find((i: any) => i.name === val.takim1.name);
        let value1 = this.groupScore.find((i: any) => i.name === val.takim2.name);
        if (value) {
          value.puan += 3;
          value.totalScore += (val.score1 - val.score2);
        } else {
          this.groupScore.push({name: val.takim1.name, puan: 3, totalScore: (val.score1 - val.score2)})
        }
        if (value1) {
          value1.totalScore += (val.score2 - val.score1);
        } else {
          this.groupScore.push({name: val.takim2.name, puan: 0, totalScore: (val.score2 - val.score1)})
        }
      } else if (val.score1 === val.score2) {
        let value = this.groupScore.find((i: any) => i.name === val.takim1.name);
        let value1 = this.groupScore.find((i: any) => i.name === val.takim2.name);
        if (value) {
          value.puan += 1;
        } else {
          this.groupScore.push({name: val.takim1.name, puan: 1, totalScore: 0})
        }
        if (value1) {
          value1.puan += 1;
        } else {
          this.groupScore.push({name: val.takim2.name, puan: 1, totalScore: 0})
        }
      } else {
        let value = this.groupScore.find((i: any) => i.name === val.takim2.name);
        let value1 = this.groupScore.find((i: any) => i.name === val.takim1.name);
        if (value) {
          value.puan += 3;
          value.totalScore += (val.score2 - val.score1);
        } else {
          this.groupScore.push({name: val.takim2.name, puan: 3, totalScore: (val.score2 - val.score1)})
        }
        if (value1) {
          value1.totalScore += (val.score1 - val.score2);
        } else {
          this.groupScore.push({name: val.takim1.name, puan: 0, totalScore: (val.score1 - val.score2)})
        }
      }
    })
    return this.groupScore;
  }

  getFirstMatchScore() {
    this.firstGroup = this.sortingScore(this.Score(this.firstGroup));
    this.SecondGroup = this.sortingScore(this.Score(this.SecondGroup));
    this.ThirdGroup = this.sortingScore(this.Score(this.ThirdGroup));
    this.FourthGroup = this.sortingScore(this.Score(this.FourthGroup));

    this.SecondMatch(this.firstGroup);
    this.SecondMatch(this.SecondGroup);
    this.SecondMatch(this.ThirdGroup);
    this.SecondMatch(this.FourthGroup);
    this.buttonDisabled = true;
  }

  getSecondMatchScore() {
    this.fifthGroup = this.sortingScore(this.Score(this.fifthGroup));
    this.sixthGroup = this.sortingScore(this.Score(this.sixthGroup));
    this.secondMatchTeams = [];
    this.SecondMatch(this.fifthGroup);
    this.SecondMatch(this.sixthGroup);
    this.seventhGroup = this.secondMatchTeams;
    /*console.log(this.sixthGroup);*/
  }
  getThirdMatchScore(){
    this.seventhGroup = this.sortingScore(this.Score(this.seventhGroup));
    this.secondMatchTeams=[];
    this.SecondMatch(this.seventhGroup);//iki grup veya 3 grup gelir
    if (this.secondMatchTeams.length==2){

    }
    console.log(this.seventhGroup)
    console.log(this.secondMatchTeams)
  }

  sortingScore(name: any) {
    let sort = name.sort((a: any, b: any) =>
      b.puan - a.puan
    );
    return sort;
  }

  SecondMatch(name: any) {
    if (name[0].puan === name[1].puan) { //1. scoru 2.ye eşit mi
      if (name[0].puan === name[2].puan) { //1.scoru 3.ye eşit mi
        if (name[0].totalScore > name[1].totalScore) {
          if (name[0].totalScore > name[2].totalScore) {
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[0].name))
            if (name[1].totalScore > name[2].totalScore) {
              this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[1].name));
            } else {
              this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[2].name));
            }
          } else {
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[2].name));
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[0].name));
          }
        } else {
          if (name[1].totalScore > name[2].totalScore) {
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[1].name));
            if (name[0].totalScore > name[2].totalScore) {
              this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[0].name));
            } else {
              this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[2].name));
            }
          } else {
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[2].name));
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[1].name));
          }
        }
      } else {
        this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[0].name))
        this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[1].name))
      }
    } else {
      this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[0].name))
      if (name[1].puan === name[2].puan) {
        if (name[1].puan === name[3].puan) {//2.takım scoru 4.ye eşit mi
          if (name[1].totalScore > name[2].totalScore) {
            if (name[1].totalScore > name[3].totalScore) {
              this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[1].name))
            } else {
              if (name[2].totalScore > name[3].totalScore) {
                this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[2].name))
              } else {
                this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[3].name))
              }
            }
          } else {
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[2].name))
          }
        } else {//2. ve 3. takım puanları eşitse
          if (name[1].totalScore > name[2].totalScore) {
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[1].name))
          } else {
            this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[2].name))
          }
        }
      } else {
        this.secondMatchTeams.push(this.teams.find((i: any) => i.name == name[1].name))
      }
    }
  }
}
