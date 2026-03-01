'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile } from '@/app/services/profile';
import { logout as logoutFn } from '@/app/services/auth';

export interface ProfileForm {
  email: string;
  fullName: string;
  birthDate: string;
  gender: string;
  height: string;
  weight: string;
  targetWeight: string;
  goal: string;
  activityLevel: string;
  diet: string;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
}

const DEFAULT: ProfileForm = {
  email: '',
  fullName: '',
  birthDate: '',
  gender: '',
  height: '',
  weight: '',
  targetWeight: '',
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
        const allergies = data.hard_constraints?.allergies ?? [];
        const loaded: ProfileForm = {
          email: data.email ?? '',
          fullName: [data.profile?.first_name, data.profile?.last_name].filter(Boolean).join(' '),
          birthDate: data.profile?.birthDate
            ? new Date(data.profile.birthDate).toISOString().split('T')[0]
            : '',
          gender: data.biometrics?.gender ?? '',
          height: data.biometrics?.height_cm != null ? String(data.biometrics.height_cm) : '',
          weight: data.biometrics?.weight_kg != null ? String(data.biometrics.weight_kg) : '',
          targetWeight:
            data.biometrics?.target_weight != null ? String(data.biometrics.target_weight) : '',
          goal: data.biometrics?.goal ?? '',
          activityLevel: data.biometrics?.activityLevel ?? '',
          diet: data.hard_constraints?.diet ?? '',
          glutenFree: allergies.includes('gluten'),
          dairyFree: allergies.includes('dairy'),
          nutFree: allergies.includes('nuts'),
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
          ...(form.gender ? { gender: form.gender } : {}),
          ...(form.height ? { height_cm: Number(form.height) } : {}),
          ...(form.weight ? { weight_kg: Number(form.weight) } : {}),
          ...(form.targetWeight ? { target_weight: Number(form.targetWeight) } : {}),
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
