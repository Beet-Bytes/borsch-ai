'use client';

import { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Trash2,
  List,
  X,
  Loader2,
  Pencil,
  Plus,
  Search,
  ChefHat,
  Clock,
} from 'lucide-react';
import { PageWrapper } from '@/app/components/ui/PageWrapper/PageWrapper';
import { Card } from '@/app/components/ui/Card/Card';
import { Button } from '@/app/components/ui/Button/Button';
import { useAIRecipe } from './useAIRecipe';
import { searchProducts, Product } from '@/app/services/products';
import styles from './page.module.css';

export default function AIRecipePage() {
  const {
    preview,
    loading,
    isGenerating,
    error,
    result,
    isDragging,
    editableIngredients,
    recommendedRecipes,
    isModalOpen,
    openAddModal,
    openEditModal,
    closeModal,
    saveIngredient,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleAnalyze,
    handleClear,
    removeIngredient,
    handleGenerateRecipes,
  } = useAIRecipe();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recipesRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim() || !isModalOpen) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayTimer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchQuery, isModalOpen]);

  useEffect(() => {
    if (recommendedRecipes && recommendedRecipes.length > 0) {
      setTimeout(() => {
        recipesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [recommendedRecipes]);

  useEffect(() => {
    if (!isModalOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isModalOpen]);

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <PageWrapper
      title="AI Recipe Generator"
      subtitle="Upload a photo of your fridge or ingredients to get smart recipe suggestions"
    >
      <div className={styles.content}>
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

        {result && (
          <Card
            title={`Detected Ingredients (${editableIngredients.length})`}
            icon={<List size={20} />}
          >
            <div className={styles.listHeaderActions}>
              <Button variant="secondary" onClick={openAddModal}>
                <Plus size={16} /> Add Ingredient
              </Button>
            </div>

            {editableIngredients.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>No ingredients found</p>
                <p className={styles.emptySub}>
                  Try uploading a different photo or add items manually.
                </p>
              </div>
            ) : (
              <div className={styles.ingredientsList}>
                {editableIngredients.map((item, index) => (
                  <div key={index} className={styles.ingredientItem}>
                    <div className={styles.ingredientHeader}>
                      <span className={styles.ingredientName}>{item.ingredient}</span>
                      <div className={styles.itemActions}>
                        <button
                          className={styles.iconBtn}
                          onClick={() => openEditModal(index)}
                          title="Edit item"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className={styles.iconBtn}
                          onClick={() => removeIngredient(index)}
                          title="Remove item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <div className={styles.confidenceWrapper}>
                      <div className={styles.confidenceBar}>
                        <div
                          className={styles.confidenceFill}
                          style={{
                            width: `${item.confidence * 100}%`,
                            backgroundColor:
                              item.confidence === 1 ? 'var(--color-success-500, #10b981)' : '',
                          }}
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
              <Button variant="secondary" onClick={handleClear} disabled={isGenerating}>
                Upload Another Photo
              </Button>
              <Button
                onClick={handleGenerateRecipes}
                loading={isGenerating}
                disabled={editableIngredients.length === 0 || isGenerating}
              >
                <Sparkles size={16} />
                Generate Recipes
              </Button>
            </div>
          </Card>
        )}

        {/* НОВА СЕКЦІЯ: Рекомендовані рецепти */}
        {recommendedRecipes && recommendedRecipes.length > 0 && (
          <div ref={recipesRef}>
            {' '}
            {/* <-- ОБГОРТКА З РЕФОМ ДЛЯ СКРОЛУ */}
            <Card title="Recommended Recipes" icon={<ChefHat size={20} />}>
              <div className={styles.recipesList}>
                {recommendedRecipes.map((recipe, index) => {
                  // Витягуємо дані з фолбеками (якщо бекенд віддав інші назви полів)
                  const recipeName = recipe.name || recipe.title || 'Unnamed Recipe';
                  const matchPercent = Number(
                    recipe.match_percentage || recipe.match_score || recipe.score || 0
                  );
                  const prepTime = recipe.cooking_time || recipe.time || recipe.prep_time || 0;
                  const difficulty = recipe.difficulty || recipe.level || 'medium';
                  const matchedCount =
                    recipe.matched_ingredients_count || recipe.matched_count || 0;

                  return (
                    <div key={recipe._id || recipe.id || index} className={styles.recipeCard}>
                      <div className={styles.recipeHeader}>
                        <h4 className={styles.recipeName}>{recipeName}</h4>
                        <span className={styles.recipeMatchBadge}>
                          {Math.round(matchPercent * 100)}% Match
                        </span>
                      </div>

                      <div className={styles.recipeMeta}>
                        <span className={styles.recipeMetaItem}>
                          <Clock size={14} /> {prepTime} min
                        </span>
                        <span
                          className={`${styles.difficultyBadge} ${styles[difficulty.toLowerCase()] || styles.medium}`}
                        >
                          {difficulty}
                        </span>
                      </div>

                      <p className={styles.recipeSummary}>
                        Matched {matchedCount} of your ingredients.
                      </p>

                      <Button variant="secondary" className={styles.viewRecipeBtn}>
                        View Recipe
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{searchQuery ? 'Select Ingredient' : 'Search Ingredient'}</h3>
              <button onClick={closeModal} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.searchInputWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Type to search database..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.searchResults}>
                {isSearching ? (
                  <div className={styles.searchStateMessage}>
                    <Loader2 className={styles.spinner} size={20} /> Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      className={styles.searchResultItem}
                      onClick={() => saveIngredient(prod.name)}
                    >
                      <span className={styles.searchResultName}>{prod.name}</span>
                      <span className={styles.searchResultCat}>{prod.category}</span>
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className={styles.searchStateMessage}>
                    No products found for {searchQuery}
                  </div>
                ) : (
                  <div className={styles.searchStateMessage}>Start typing to find products...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
