import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { NgForm } from '@angular/forms'; 


@Component({
  selector: 'app-professor-form',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.css']
})
export class ProfessorFormComponent {
  @Output() submitForm = new EventEmitter<any>();

  professor = {
    name: '',
    author_id: '',
    affiliations: '',
    h_index: null,
    total_citations: null,
    citation_trends: ''
  };


submit(profForm: NgForm) {
  if (profForm.valid) {
    console.log(profForm.value); 
  }
}

}
