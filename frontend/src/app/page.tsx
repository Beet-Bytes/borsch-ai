'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { Button } from './components/ui/Button/Button';
import { Input } from './components/ui/Input/Input';
import { useState } from 'react';
import { Select } from './components/ui/Select/Select';

export default function Home() {
  const [diet, setDiet] = useState<string | null>(null);

  const dietOptions = [
    { label: 'Vegan', value: 'vegan' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Keto', value: 'keto' },
    { label: 'Gluten-Free', value: 'gluten-free' },
    { label: 'No preference', value: 'none' },
  ];
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>To get started, edit the page.tsx file.</h1>
          <p>
            Looking for a starting point or more instructions? Head over to{' '}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{' '}
            or the{' '}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{' '}
            center.
          </p>
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Button variant="primary" size="sm">
                Primary SM
              </Button>
              <Button variant="primary" size="md">
                Primary MD
              </Button>
              <Button variant="primary" size="lg">
                Primary LG
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" loading>
                Loading
              </Button>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Button variant="secondary" size="sm">
                Secondary SM
              </Button>
              <Button variant="secondary" size="md">
                Secondary MD
              </Button>
              <Button variant="secondary" size="lg">
                Secondary LG
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button variant="secondary" loading>
                Loading
              </Button>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Button variant="ghost" size="sm">
                Ghost SM
              </Button>
              <Button variant="ghost" size="md">
                Ghost MD
              </Button>
              <Button variant="ghost" size="lg">
                Ghost LG
              </Button>
              <Button variant="ghost" disabled>
                Disabled
              </Button>
              <Button variant="ghost" loading>
                Loading
              </Button>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Button variant="danger" size="sm">
                Danger SM
              </Button>
              <Button variant="danger" size="md">
                Danger MD
              </Button>
              <Button variant="danger" size="lg">
                Danger LG
              </Button>
              <Button variant="danger" disabled>
                Disabled
              </Button>
              <Button variant="danger" loading>
                Loading
              </Button>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Button variant="primary" icon="plus">
                З іконкою зліва
              </Button>
              <Button variant="primary" icon="search" iconPosition="right">
                З іконкою справа
              </Button>
            </div>

            <div
              style={{
                padding: 40,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                maxWidth: 400,
              }}
            >
              <Input label="Label" placeholder="Default" leftIcon="search" rightIcon="search" />
              <Input
                label="Label"
                placeholder="Error"
                leftIcon="search"
                rightIcon="search"
                error="Повідомлення про помилку"
              />
              <Input
                label="Label"
                placeholder="Disabled"
                leftIcon="search"
                rightIcon="search"
                disabled
              />
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={{ width: 260 }}>
                <Select
                  label="Label"
                  options={dietOptions}
                  value={diet}
                  onChange={(val) => setDiet(val)}
                  placeholder="Focused"
                />
              </div>

              <div style={{ width: 260 }}>
                <Select
                  label="Label (disabled)"
                  options={dietOptions}
                  value={null}
                  onChange={() => {}}
                  placeholder="Disabled"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
