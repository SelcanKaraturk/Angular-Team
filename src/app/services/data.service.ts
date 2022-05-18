import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpService: HttpClient) { }

  getTeams(){
    return this.httpService.get('http://localhost:3000/teams');
  }
  getTeamsById(id: any){
    return this.httpService.get('http://localhost:3000/teams/'+id);
  }
  updateTeams(id: any,data: any){
    return this.httpService.put('http://localhost:3000/teams/'+id,data);
  }
}
