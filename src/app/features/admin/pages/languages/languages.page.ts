import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { CourseResponse } from '../../models/course.model';
import { getLanguageFlagUrl, LANGUAGES } from '../../models/enums';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-languages-page',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './languages.page.html',
})
export class LanguagesPage implements OnInit {
  private store = inject(Store);
  private courseService = inject(CourseService);

  user = this.store.selectSignal(selectCurrentUser);
  loading = signal(true);
  courses = signal<CourseResponse[]>([]);

  languages = computed(() =>
    LANGUAGES.map(lang => ({
      ...lang,
      flagUrl: getLanguageFlagUrl(lang.value),
      courseCount: this.courses().filter(c => c.language === lang.value).length,
    }))
  );

  ngOnInit(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;
    this.courseService
      .getAllBySchool(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.courses.set(data) });
  }
}
