'use client';

import { useRef } from 'react';
import { Camera, Upload, Sparkles, Trash2, List, X, Loader2 } from 'lucide-react';
import { PageWrapper } from '@/app/components/ui/PageWrapper/PageWrapper';
import { Card } from '@/app/components/ui/Card/Card';
import { Button } from '@/app/components/ui/Button/Button';
import { useAIRecipe } from './useAIRecipe';
import styles from './page.module.css';

export default function AIRecipePage() {
  const {
    preview,
    loading,
    error,
    result,
    isDragging,
    editableIngredients,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleAnalyze,
    handleClear,
    removeIngredient,
  } = useAIRecipe();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <PageWrapper
      title="AI Recipe Generator"
      subtitle="Upload a photo of your fridge or ingredients to get smart recipe suggestions"
    >
      <div className={styles.content}>
        {/* Секція завантаження */}
        <Card title="Upload Ingredients" icon={<Camera size={20} />}>
          {!preview ? (
            <div
              className={`${styles.uploadArea} ${isDragging ? styles.dragActive : ''}`}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                capture="environment"
                className={styles.hiddenInput}
              />
              <Upload size={40} className={styles.uploadIcon} />
              <p className={styles.uploadText}>
                {isDragging ? 'Drop image here...' : 'Click or drag a photo of your fridge'}
              </p>
              <p className={styles.uploadSubtext}>Supports JPG, PNG, WEBP</p>
            </div>
          ) : (
            <div className={styles.previewContainer}>
              <div className={styles.imageWrapper}>
                <img
                  src={
                    result?.image_base64 ? `data:image/jpeg;base64,${result.image_base64}` : preview
                  }
                  alt="Fridge preview"
                  className={styles.previewImage}
                />

                {/* Анімація сканування під час завантаження */}
                {loading && (
                  <div className={styles.loadingOverlay}>
                    <Loader2 size={40} className={styles.spinner} />
                    <p className={styles.spinnerText}>AI is scanning your fridge...</p>
                  </div>
                )}
              </div>

              {!result && (
                <div className={styles.actionButtons}>
                  <Button variant="secondary" onClick={handleClear} disabled={loading}>
                    <Trash2 size={16} />
                    Clear
                  </Button>
                  <Button onClick={handleAnalyze} loading={loading}>
                    <Sparkles size={16} />
                    Analyze Image
                  </Button>
                </div>
              )}
            </div>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </Card>

        {/* Секція результатів розпізнавання */}
        {result && (
          <Card
            title={`Detected Ingredients (${editableIngredients.length})`}
            icon={<List size={20} />}
          >
            {/* Zero State (якщо ШІ нічого не знайшов або користувач усе видалив) */}
            {editableIngredients.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>No ingredients found</p>
                <p className={styles.emptySub}>
                  Try uploading a different photo with better lighting or clearer items.
                </p>
              </div>
            ) : (
              <div className={styles.ingredientsList}>
                {editableIngredients.map((item, index) => (
                  <div key={index} className={styles.ingredientItem}>
                    <div className={styles.ingredientHeader}>
                      <span className={styles.ingredientName}>{item.ingredient}</span>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeIngredient(index)}
                        title="Remove incorrect item"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className={styles.confidenceWrapper}>
                      <div className={styles.confidenceBar}>
                        <div
                          className={styles.confidenceFill}
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                      <span className={styles.confidenceText}>
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.bottomActions}>
              <Button variant="secondary" onClick={handleClear}>
                Upload Another Photo
              </Button>
              <Button disabled={editableIngredients.length === 0}>
                <Sparkles size={16} />
                Generate Recipes
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}
