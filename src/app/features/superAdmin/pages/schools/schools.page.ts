import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SchoolRequest, SchoolResponse } from '../../models/school.model';
import { SchoolsService } from '../../services/schools.service';
import { schoolStatusClass } from '../../utils/status.utils';

@Component({
  selector: 'app-schools-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
  ],
  templateUrl: './schools.page.html',
})
export class SchoolsPage implements OnInit {
  private schoolsService = inject(SchoolsService);
  private toast = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  query = signal('');
  schools = signal<SchoolResponse[]>([]);
  modalOpen = signal(false);
  confirmDeleteOpen = signal(false);
  editingSchoolId = signal<string | null>(null);
  deletingSchoolId = signal<string | null>(null);

  filteredSchools = computed(() => {
    const search = this.query().trim().toLowerCase();
    if (!search) return this.schools();
    return this.schools().filter((school) => school.name.toLowerCase().includes(search));
  });

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    subDomain: new FormControl('', [Validators.required, Validators.minLength(3)]),
    logo: new FormControl(''),
    city: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    address: new FormControl(''),
  });

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.loading.set(true);
    this.schoolsService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (schools) => this.schools.set(schools),
      });
  }

  openCreate(): void {
    this.form.reset();
    this.editingSchoolId.set(null);
    this.modalOpen.set(true);
  }

  openEdit(school: SchoolResponse): void {
    this.form.patchValue({
      name: school.name ?? '',
      subDomain: school.subDomain ?? '',
      logo: school.logo ?? '',
      city: school.city ?? '',
      country: school.country ?? '',
      address: school.address ?? '',
    });
    this.editingSchoolId.set(school.id);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  saveSchool(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload: SchoolRequest = {
      name: this.form.value.name || '',
      subDomain: this.form.value.subDomain || '',
      logo: this.form.value.logo || '',
      city: this.form.value.city || '',
      country: this.form.value.country || '',
      address: this.form.value.address || '',
    };

    const request$ = this.editingSchoolId()
      ? this.schoolsService.update(this.editingSchoolId()!, payload)
      : this.schoolsService.create(payload);

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`School ${this.editingSchoolId() ? 'updated' : 'created'} successfully`);
          this.closeModal();
          this.loadSchools();
        },
      });
  }

  openDelete(id: string): void {
    this.deletingSchoolId.set(id);
    this.confirmDeleteOpen.set(true);
  }

  closeDelete(): void {
    this.confirmDeleteOpen.set(false);
    this.deletingSchoolId.set(null);
  }

  deleteSchool(): void {
    const id = this.deletingSchoolId();
    if (!id) return;
    this.schoolsService.delete(id).subscribe({
      next: () => {
        this.toast.success('School deleted');
        this.closeDelete();
        this.loadSchools();
      },
    });
  }

  schoolStatusClass = schoolStatusClass;
}
