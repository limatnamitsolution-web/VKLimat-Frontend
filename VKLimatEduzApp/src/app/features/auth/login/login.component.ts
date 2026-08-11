import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private appState = inject(AppStateService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    fyId: [null as number | null, Validators.required],
    branchid: [null as number | null, Validators.required]
  });

  financialYears = [
    { fyId: 1, name: '2023-2024' },
    { fyId: 2, name: '2024-2025' },
    { fyId: 3, name: '2025-2026' },
    {fyId: 4, name: '2026-2027' }

  ];

  academics = [
    { branchid: 1375, name: 'ABC School' },
    { branchid: 1376, name: 'XYZ School' }
  ];

  onSubmit() {
    if (this.loginForm.valid) {
      // Mock login logic
      const { username, fyId, branchid } = this.loginForm.value;
      
      const selectedFy = this.financialYears.find(f => f.fyId == fyId);
      const selectedAcademic = this.academics.find(a => a.branchid == branchid);

      // Set global state
      this.appState.setUser(1, username || 'User');
      if (selectedFy) {
        this.appState.setFinancialYear(selectedFy.fyId, selectedFy.name);
      }
      if (selectedAcademic) {
        this.appState.setAcademicYear(selectedAcademic.branchid, selectedAcademic.name);
      }

      // Navigate to dashboard
      console.log('Login successful', this.appState.userState());
      this.router.navigate(['/']);
    }
  }
}
