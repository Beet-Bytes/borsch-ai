'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile } from '@/app/services/profile';
import { logout as logoutFn } from '@/app/services/auth';

export interface ProfileForm {
  fullName: string;
  birthDate: string;
  goal: string;
  activityLevel: string;
  diet: string;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
}

const DEFAULT: ProfileForm = {
  fullName: '',
  birthDate: '',
  goal: '',
  activityLevel: '',
  diet: '',
  glutenFree: false,
  dairyFree: false,
  nutFree: false,
};

export function useProfile() {
  const router = useRouter();
  const [initial, setInitial] = useState<ProfileForm>(DEFAULT);
  const [form, setForm] = useState<ProfileForm>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);

  useEffect(() => {
    getProfile()
      .then((data) => {
        const loaded: ProfileForm = {
          fullName: [data.first_name, data.last_name].filter(Boolean).join(' '),
          birthDate: data.birthDate ?? '',
          goal: '',
          activityLevel: '',
          diet: '',
          glutenFree: false,
          dairyFree: false,
          nutFree: false,
        };
        setInitial(loaded);
        setForm(loaded);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const [firstName = '', ...rest] = form.fullName.trim().split(' ');
      const allergies = [
        form.glutenFree && 'gluten',
        form.dairyFree && 'dairy',
        form.nutFree && 'nuts',
      ].filter(Boolean) as string[];

      await updateProfile({
        profile: {
          first_name: firstName,
          last_name: rest.join(' '),
          ...(form.birthDate ? { birthDate: form.birthDate } : {}),
        },
        biometrics: {
          ...(form.goal ? { goal: form.goal } : {}),
          ...(form.activityLevel ? { activityLevel: form.activityLevel } : {}),
        },
        hard_constraints: {
          ...(form.diet ? { diet: form.diet } : {}),
          allergies,
        },
      });
      setInitial(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setForm(initial);

  const handleLogout = async () => {
    try {
      await logoutFn();
    } catch {}
    router.push('/login');
  };

  return { form, set, isDirty, loading, saving, error, handleSave, handleCancel, handleLogout };
}
