import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // <-- Added this
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class EditProfileDialogComponent {
  nameControl: FormControl;
  affiliationControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nameControl = new FormControl(data.name);
    this.affiliationControl = new FormControl(data.affiliations);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      name: this.nameControl.value,
      affiliations: this.affiliationControl.value
    });
  }
}
