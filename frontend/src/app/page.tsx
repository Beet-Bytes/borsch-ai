'use client';

import { useState } from 'react';
import { Button } from './components/ui/Button/Button';
import { Input } from './components/ui/Input/Input';
import { Select } from './components/ui/Select/Select';
import { PageWrapper } from './components/ui/PageWrapper/PageWrapper';

const dietOptions = [
  { label: 'Vegan', value: 'vegan' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Keto', value: 'keto' },
  { label: 'Gluten-Free', value: 'gluten-free' },
  { label: 'No preference', value: 'none' },
];

export default function Home() {
  const [diet, setDiet] = useState<string | null>(null);

  return (
    <PageWrapper
      title="UI Kit"
      subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {/* Buttons */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" icon="plus">
              З іконкою зліва
            </Button>
            <Button variant="primary" icon="search" iconPosition="right">
              З іконкою справа
            </Button>
          </div>
        </section>

        {/* Inputs */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
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
        </section>

        {/* Selects */}
        <section style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 260 }}>
            <Select
              label="Label"
              options={dietOptions}
              value={diet}
              onChange={(val) => setDiet(val)}
              placeholder="Select option"
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
        </section>
      </div>
    </PageWrapper>
  );
}
