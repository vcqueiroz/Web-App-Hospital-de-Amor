import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  userId: any = '';

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private actRoute: ActivatedRoute,
    private location: Location,
    private router: Router) {
    this.userForm = this.fb.group({
      id: 0,
      nome: '',
      sobrenome: '',
      idade: '',
      telefone: '',
      cidade: ''
    })
  }

  ngOnInit(): void {
    this.actRoute.paramMap.subscribe(params => {
      this.userId = params.get('id');
      console.log(this.userId);
      if(this.userId !== null) {
        this.userService.getUser(this.userId).subscribe(result => {
          this.userForm.patchValue({
            id: result.id,
            nome: result.nome,
            sobrenome: result.sobrenome,
            idade: result.idade,
            telefone: result.telefone,
            cidade: result.cidade
          })
        })
      }
    })

    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(response => {
      this.users = response;
    })
  }

  createUser() {
    this.userForm.get('id')?.patchValue(this.userId, this.users.length + 1);
    this.userService.postUser(this.userForm.value).subscribe(result => {
      console.log(`Paciente ${result} foi cadastrado com sucesso !`)
    }, (err) => {

    }, () => {
      this.router.navigate(['/']);
    })
  }

  saveUser():void {
    if (this.users) {
      this.userService.updateUser(this.userForm.value).subscribe(() => this.goBack())
    }
  }

  goBack(): void {
    this.location.back();
  }

  actionButton() {
    if(this.userId !== null) {
      this.saveUser()
    }else {
      this.createUser()
    }
  }
}
