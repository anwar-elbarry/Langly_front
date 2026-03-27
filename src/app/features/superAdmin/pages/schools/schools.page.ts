import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { SearchFilterBarComponent } from '../../../../shared/ui/search-filter-bar/search-filter-bar';
import { SchoolRequest, SchoolResponse } from '../../models/school.model';
import { SchoolsService } from '../../services/schools.service';
import { schoolStatusClass } from '../../utils/status.utils';

@Component({
  selector: 'app-schools-page',
  imports: [
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    SpinnerComponent,
    SearchFilterBarComponent,
  ],
  templateUrl: './schools.page.html',
})
export class SchoolsPage implements OnInit {
  private schoolsService = inject(SchoolsService);
  private toast = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  searchQuery = signal('');
  schools = signal<SchoolResponse[]>([]);
  modalOpen = signal(false);
  confirmDeleteOpen = signal(false);
  editingSchoolId = signal<string | null>(null);
  deletingSchoolId = signal<string | null>(null);

  filteredSchools = computed(() => {
    const search = this.searchQuery().trim().toLowerCase();
    if (!search) return this.schools();
    return this.schools().filter((school) => school.name.toLowerCase().includes(search));
  });

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
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

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  schoolLogo(school: SchoolResponse): string | null {
    return school.logo || null;
  }

  schoolLetter(school: SchoolResponse): string {
    const name = (school.name || '').trim();
    return name ? name[0].toUpperCase() : '?';
  }

  openCreate(): void {
    this.form.reset();
    this.editingSchoolId.set(null);
    this.modalOpen.set(true);
  }

  openEdit(school: SchoolResponse): void {
    this.form.patchValue({
      name: school.name ?? '',
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
