'use client';

import Link from 'next/link';
import {
  LogOut,
  Lock,
  User,
  Heart,
  ChevronRight,
  Flag,
  Activity,
  Bell,
  Camera,
  KeyRound,
  X,
  Save,
} from 'lucide-react';
import { PageWrapper } from '@/app/components/ui/PageWrapper/PageWrapper';
import { Card } from '@/app/components/ui/Card/Card';
import { Input } from '@/app/components/ui/Input/Input';
import { Button } from '@/app/components/ui/Button/Button';
import { Select } from '@/app/components/ui/Select/Select';
import { Toggle } from '@/app/components/ui/Toggle/Toggle';
import { useProfile } from './useProfile';
import styles from './page.module.css';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const GOAL_OPTIONS = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'weight-gain', label: 'Weight Gain' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
];

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Light (1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (3-5 days/week)' },
  { value: 'active', label: 'Active (6-7 days/week)' },
  { value: 'very-active', label: 'Very Active (intense daily)' },
];

export default function ProfilePage() {
  const { form, set, isDirty, loading, saving, error, handleSave, handleCancel, handleLogout } =
    useProfile();

  if (loading) {
    return (
      <PageWrapper title="Profile Settings" subtitle="Manage your account and dietary preferences">
        <div className={styles.loading}>Loading...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Profile Settings" subtitle="Manage your account and dietary preferences">
      <div className={styles.content}>
        {/* Personal Information */}
        <Card title="Personal Information" icon={<User size={20} />}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {form.fullName ? form.fullName[0].toUpperCase() : <User size={24} />}
            </div>
            <div className={styles.avatarInfo}>
              <p className={styles.avatarName}>{form.fullName || '—'}</p>
              <Button variant="secondary" size="sm">
                <Camera size={14} />
                Change Photo
              </Button>
            </div>
          </div>
          <div className={styles.grid}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
            />
            <Input label="Email" type="email" value={form.email} readOnly disabled />
          </div>
          <div className={`${styles.grid} ${styles.gridGap}`}>
            <Select
              label="Gender"
              options={GENDER_OPTIONS}
              value={form.gender || null}
              placeholder="Select gender"
              onChange={(val) => set('gender', val as string)}
            />
            <Input
              label="Height (cm)"
              type="number"
              placeholder="e.g. 175"
              value={form.height}
              onChange={(e) => set('height', e.target.value)}
            />
          </div>
          <div className={styles.dateField}>
            <Input
              label="Date of Birth"
              type="date"
              value={form.birthDate}
              onChange={(e) => set('birthDate', e.target.value)}
            />
          </div>
        </Card>

        {/* Favorite Recipes */}
        <Link href="/favorites" className={styles.favoriteLink}>
          <div className={styles.favoriteLinkLeft}>
            <Heart size={20} className={styles.favoriteIcon} />
            <div>
              <p className={styles.favoriteLinkTitle}>Favorite Recipes</p>
              <p className={styles.favoriteLinkSub}>View your saved recipes</p>
            </div>
          </div>
          <ChevronRight size={20} className={styles.chevronIcon} />
        </Link>

        {/* Change Password */}
        <Card title="Change Password" icon={<Lock size={20} />}>
          <div className={styles.stack}>
            <Input label="Current Password" type="password" placeholder="Enter current password" />
            <div className={styles.grid}>
              <Input label="New Password" type="password" placeholder="Enter new password" />
              <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
            </div>
            <div className={styles.alignRight}>
              <Button variant="secondary" disabled>
                <KeyRound size={16} />
                Update Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Goals & Activity */}
        <Card title="Goals & Activity" icon={<Flag size={20} />}>
          <div className={styles.grid}>
            <Input
              label="Current Weight (kg)"
              type="number"
              placeholder="e.g. 75"
              value={form.weight}
              onChange={(e) => set('weight', e.target.value)}
            />
            <Input
              label="Target Weight (kg)"
              type="number"
              placeholder="e.g. 70"
              value={form.targetWeight}
              onChange={(e) => set('targetWeight', e.target.value)}
            />
          </div>
          <div className={`${styles.grid} ${styles.gridGap}`}>
            <Select
              label="Weight Goal"
              options={GOAL_OPTIONS}
              value={form.goal || null}
              placeholder="Select goal"
              onChange={(val) => set('goal', val as string)}
            />
            <Select
              label="Activity Level"
              options={ACTIVITY_OPTIONS}
              value={form.activityLevel || null}
              placeholder="Select activity level"
              onChange={(val) => set('activityLevel', val as string)}
            />
          </div>
        </Card>

        {/* Dietary Preferences */}
        <Card title="Dietary Preferences" icon={<Activity size={20} />}>
          <div className={styles.toggleList}>
            {[
              {
                label: 'Vegan',
                checked: form.diet === 'vegan',
                onChange: () => set('diet', form.diet === 'vegan' ? '' : 'vegan'),
              },
              {
                label: 'Vegetarian',
                checked: form.diet === 'vegetarian',
                onChange: () => set('diet', form.diet === 'vegetarian' ? '' : 'vegetarian'),
              },
              {
                label: 'Gluten Free',
                checked: form.glutenFree,
                onChange: () => set('glutenFree', !form.glutenFree),
              },
              {
                label: 'Dairy Free',
                checked: form.dairyFree,
                onChange: () => set('dairyFree', !form.dairyFree),
              },
              {
                label: 'Nut Free',
                checked: form.nutFree,
                onChange: () => set('nutFree', !form.nutFree),
              },
            ].map(({ label, checked, onChange }) => (
              <div key={label} className={styles.toggleRow}>
                <span className={styles.toggleLabel}>{label}</span>
                <Toggle checked={checked} onChange={onChange} />
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notifications" icon={<Bell size={20} />}>
          <div className={styles.toggleList}>
            {[
              {
                label: 'Recipe Recommendations',
                sub: 'Get daily recipe suggestions',
                defaultOn: true,
              },
              { label: 'Calorie Reminders', sub: 'Daily goal tracking alerts', defaultOn: true },
              {
                label: 'Shopping List Updates',
                sub: 'When items are added or removed',
                defaultOn: false,
              },
            ].map(({ label, sub, defaultOn }) => (
              <div key={label} className={styles.toggleRowSub}>
                <div>
                  <p className={styles.toggleLabel}>{label}</p>
                  <p className={styles.toggleSub}>{sub}</p>
                </div>
                <Toggle checked={defaultOn} onChange={() => {}} />
              </div>
            ))}
          </div>
        </Card>

        {/* Error */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </Button>
          <div className={styles.bottomActions}>
            <Button variant="secondary" onClick={handleCancel} disabled={!isDirty}>
              <X size={16} />
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} disabled={!isDirty}>
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
