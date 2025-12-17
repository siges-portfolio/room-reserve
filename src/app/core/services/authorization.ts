import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, switchMap } from 'rxjs';
import { environment } from '@environment';
import { AuthState, User } from '@core/models/user';
import { AuthResponse, AuthResponsePassword, UserAttributes } from '@supabase/supabase-js';
import { SupabaseService } from '@core/services/supabase';

const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  error: null,
  session: null,
  isLoading: true,
  isRecovery: false,
};

const STORED_RECOVERY_KEY = 'auth:isRecovery';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  supabase = inject(SupabaseService);

  #authState = new BehaviorSubject(INITIAL_AUTH_STATE);
  authState$ = this.#authState.asObservable();

  constructor() {
    this.#initAuthStateChange();
  }

  #initAuthStateChange() {
    this.supabase.client.auth.onAuthStateChange((event, session) => {
      const storedIsRecovery = sessionStorage.getItem(STORED_RECOVERY_KEY);
      const user = session?.user;

      switch (event) {
        case 'INITIAL_SESSION':
          if (user) {
            this.updateState({
              user: this.mapUserData({ ...user, email: user.email! }),
              session: session,
              isLoading: false,
              isRecovery: storedIsRecovery === 'true',
              error: null,
            });
          } else {
            this.updateState({
              isLoading: false,
            });
          }
          break;
        case 'PASSWORD_RECOVERY':
          sessionStorage.setItem(STORED_RECOVERY_KEY, 'true');
          this.updateState({ isRecovery: true });
          return;
        case 'SIGNED_IN':
          if (user) {
            this.updateState({
              user: this.mapUserData({ ...user, email: user.email! }),
              session: session,
              isLoading: false,
              isRecovery: storedIsRecovery === 'true',
              error: null,
            });
          }
          break;
        case 'SIGNED_OUT':
          this.updateState({ ...INITIAL_AUTH_STATE, isLoading: false });
          break;
        case 'TOKEN_REFRESHED':
          break;
        case 'USER_UPDATED':
          if (user) {
            this.updateState({
              user: this.mapUserData({ ...user, email: user.email! }),
            });
          }
          break;
      }
    });
  }

  get session() {
    return from(this.supabase.client.auth.getSession()).pipe(
      map((response) => response.data.session),
    );
  }

  signIn(email: string, password: string) {
    this.updateState({ isLoading: true });

    return from(this.supabase.client.auth.signInWithPassword({ email, password })).pipe(
      map((response) => {
        if (response.error) throw response.error;

        sessionStorage.removeItem(STORED_RECOVERY_KEY);
        this.updateState({ isRecovery: false })
      }),
      catchError((error: any) => {
        this.updateState({
          isLoading: false,
          error: error.message,
        });

        throw error;
      }),
    );
  }

  signUp(email: string, password: string) {
    return from(
      this.supabase.client.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${environment.BASE_URL}/authorization/sign-up`,
        },
      }),
    ).pipe(
      catchError((error) => {
        this.updateState({
          isLoading: false,
          error: error.message,
        });

        throw error;
      }),
    );
  }

  resendConfirmation(email: string) {
    return from(
      this.supabase.client.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${environment.BASE_URL}/authorization/sign-up`,
        },
      }),
    ).pipe(
      map((response: AuthResponsePassword) => {
        if (response.error) throw response.error;
      }),
    );
  }

  resetPassword(email: string) {
    return from(
      this.supabase.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${environment.BASE_URL}/authorization/reset-password`,
      }),
    ).pipe(
      map((response) => {
        if (response.error) throw response.error;;
      }),
    );
  }

  updateUser(data: Partial<UserAttributes>) {
    return from(this.supabase.client.auth.updateUser({ ...data })).pipe(
      map((response) => {
        if (response.error) throw response.error;

        sessionStorage.removeItem(STORED_RECOVERY_KEY);
        this.updateState({ isRecovery: false });
      }),
    );
  }

  logout() {
    return from(this.supabase.client.auth.signOut()).pipe(
      map((response) => {
        if (response.error) throw response.error;

        sessionStorage.removeItem(STORED_RECOVERY_KEY);
        this.updateState({ isRecovery: false });
      }),
    );
  }

  mapUserData(user: User) {
    return {
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata,
      created_at: user.created_at,
    };
  }

  updateState(newState: Partial<AuthState>) {
    this.#authState.next({
      ...this.#authState.value,
      ...newState,
    });
  }
}
