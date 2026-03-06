'use client';

import { Package, ChefHat, Save, Plus, Trash2 } from 'lucide-react';
import { PageWrapper } from '@/app/components/ui/PageWrapper/PageWrapper';
import { Card } from '@/app/components/ui/Card/Card';
import { Button } from '@/app/components/ui/Button/Button';
import { useAdmin } from './useAdmin';
import styles from './page.module.css';

export default function AdminDashboard() {
  const {
    isCheckingRole,
    activeTab,
    setActiveTab,
    loading,
    message,
    formData,
    handleProductChange,
    handleNutritionChange,
    submitProduct,
    recipeData,
    handleRecipeChange,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addInstruction,
    updateInstruction,
    removeInstruction,
    submitRecipe,
    utensilsInput,
    setUtensilsInput,
    handleRecipeNutritionChange,
  } = useAdmin();

  // 1. ПОКИ ЙДЕ ПЕРЕВІРКА (або на сервері) - ПОВЕРТАЄМО ПОРОЖНЕЧУ ЧИ ЛОАДЕР
  if (isCheckingRole) {
    return (
      <PageWrapper title="Admin Dashboard" subtitle="Manage database products and recipes">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '50px',
            color: 'var(--color-neutral-400)',
          }}
        >
          Loading admin dashboard...
        </div>
      </PageWrapper>
    );
  }

  // 2. КОЛИ ПЕРЕВІРКА ПРОЙШЛА (ми точно на клієнті) - МАЛЮЄМО ФОРМУ
  return (
    <PageWrapper title="Admin Dashboard" subtitle="Manage database products and recipes">
      <div className={styles.content}>
        <div className={styles.tabActions}>
          <Button
            variant={activeTab === 'product' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('product')}
          >
            <Package size={18} /> Add Product
          </Button>
          <Button
            variant={activeTab === 'recipe' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('recipe')}
          >
            <ChefHat size={18} /> Add Recipe
          </Button>
        </div>

        {activeTab === 'product' ? (
          <Card title="New Product Database Entry" icon={<Package size={20} />}>
            <form onSubmit={submitProduct} className={styles.adminForm}>
              {message.text && (
                <div className={message.type === 'error' ? styles.errorMsg : styles.successMsg}>
                  {message.text}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Product Name</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleProductChange}
                  placeholder="e.g. Avocado"
                  className={styles.adminInput}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleProductChange}
                    className={styles.adminSelect}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Grains">Grains</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Default Unit</label>
                  <select
                    name="default_unit"
                    value={formData.default_unit}
                    onChange={handleProductChange}
                    className={styles.adminSelect}
                  >
                    <option value="g">g (grams)</option>
                    <option value="ml">ml (milliliters)</option>
                    <option value="pcs">pcs (pieces)</option>
                    <option value="slices">slices</option>
                  </select>
                </div>
              </div>

              <div className={styles.nutritionSection}>
                <h4 className={styles.sectionTitle}>Nutrition per 100g / 100ml</h4>
                <div className={styles.nutritionGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Calories</label>
                    <input
                      type="number"
                      required
                      name="calories"
                      value={formData.nutrition_per_100g.calories || ''}
                      onChange={handleNutritionChange}
                      className={styles.adminInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Protein (g)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      name="protein"
                      value={formData.nutrition_per_100g.protein || ''}
                      onChange={handleNutritionChange}
                      className={styles.adminInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Fat (g)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      name="fat"
                      value={formData.nutrition_per_100g.fat || ''}
                      onChange={handleNutritionChange}
                      className={styles.adminInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Carbs (g)</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      name="carbs"
                      value={formData.nutrition_per_100g.carbs || ''}
                      onChange={handleNutritionChange}
                      className={styles.adminInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <Button type="submit" loading={loading} disabled={loading}>
                  <Save size={16} /> Save Product
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Card title="New Recipe Builder" icon={<ChefHat size={20} />}>
            <form onSubmit={submitRecipe} className={styles.adminForm}>
              {message.text && (
                <div className={message.type === 'error' ? styles.errorMsg : styles.successMsg}>
                  {message.text}
                </div>
              )}

              <div className={styles.row}>
                <div className={styles.inputGroup} style={{ flex: 2 }}>
                  <label className={styles.inputLabel}>Recipe Name</label>
                  <input
                    required
                    name="name"
                    value={recipeData.name}
                    onChange={handleRecipeChange}
                    placeholder="e.g. Omelet with spinach"
                    className={styles.adminInput}
                  />
                </div>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                  <label className={styles.inputLabel}>Goal</label>
                  <select
                    name="goal"
                    value={recipeData.goal}
                    onChange={handleRecipeChange}
                    className={styles.adminSelect}
                  >
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Time (min)</label>
                  <input
                    type="number"
                    required
                    name="cooking_time"
                    value={recipeData.cooking_time || ''}
                    onChange={handleRecipeChange}
                    className={styles.adminInput}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Difficulty</label>
                  <select
                    name="difficulty"
                    value={recipeData.difficulty}
                    onChange={handleRecipeChange}
                    className={styles.adminSelect}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Servings</label>
                  <input
                    type="number"
                    required
                    name="number_of_servings"
                    value={recipeData.number_of_servings || ''}
                    onChange={handleRecipeChange}
                    className={styles.adminInput}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Utensils comma separated</label>
                <input
                  name="utensils"
                  value={utensilsInput}
                  onChange={(e) => setUtensilsInput(e.target.value)}
                  placeholder="e.g. Pan, Bowl, Whisk"
                  className={styles.adminInput}
                />
              </div>

              {/* Nutrition per serving */}
              <div className={styles.nutritionSection}>
                <h4 className={styles.sectionTitle}>Total Nutrition (per serving)</h4>
                <div className={styles.nutritionGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Calories</label>
                    <input
                      type="number"
                      required
                      name="calories"
                      value={recipeData.total_nutrition_per_serving.calories || ''}
                      onChange={handleRecipeNutritionChange}
                      className={styles.adminInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Protein (g)</label>
                    <input
                      type="number"
                      required
                      name="protein"
                      value={recipeData.total_nutrition_per_serving.protein || ''}
                      onChange={handleRecipeNutritionChange}
                      className={styles.adminInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Fat (g)</label>
                    <input
                      type="number"
                      required
                      name="fat"
                      value={recipeData.total_nutrition_per_serving.fat || ''}
                      onChange={handleRecipeNutritionChange}
                      className={styles.adminInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Carbs (g)</label>
                    <input
                      type="number"
                      required
                      name="carbs"
                      value={recipeData.total_nutrition_per_serving.carbs || ''}
                      onChange={handleRecipeNutritionChange}
                      className={styles.adminInput}
                    />
                  </div>
                </div>
              </div>

              {/* Інгредієнти */}
              <div className={styles.nutritionSection}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <h4 className={styles.sectionTitle} style={{ margin: 0 }}>
                    Ingredients
                  </h4>
                  <Button type="button" variant="secondary" onClick={addIngredient}>
                    <Plus size={16} /> Add
                  </Button>
                </div>
                {recipeData.ingredients.map((ing, index) => (
                  <div
                    key={index}
                    className={styles.row}
                    style={{ alignItems: 'flex-end', marginBottom: '10px' }}
                  >
                    <div className={styles.inputGroup} style={{ flex: 2, marginBottom: 0 }}>
                      <label className={styles.inputLabel}>Product ID (from DB)</label>
                      <input
                        required
                        placeholder="e.g. 69a08f6f28e..."
                        value={ing._id}
                        onChange={(e) => updateIngredient(index, '_id', e.target.value)}
                        className={styles.adminInput}
                      />
                    </div>
                    <div className={styles.inputGroup} style={{ flex: 1, marginBottom: 0 }}>
                      <label className={styles.inputLabel}>Quantity</label>
                      <input
                        type="number"
                        required
                        placeholder="Amount"
                        value={ing.quantity || ''}
                        onChange={(e) =>
                          updateIngredient(index, 'quantity', Number(e.target.value))
                        }
                        className={styles.adminInput}
                      />
                    </div>
                    {recipeData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        style={{
                          padding: '10px',
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Інструкції (Кроки) */}
              <div className={styles.nutritionSection}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <h4 className={styles.sectionTitle} style={{ margin: 0 }}>
                    Instructions
                  </h4>
                  <Button type="button" variant="secondary" onClick={addInstruction}>
                    <Plus size={16} /> Add Step
                  </Button>
                </div>
                {recipeData.steps.map((step, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 0',
                        fontWeight: 'bold',
                        color: 'var(--color-neutral-400)',
                      }}
                    >
                      {step.step_number}.
                    </div>
                    <textarea
                      required
                      placeholder={`Step ${step.step_number} description...`}
                      value={step.instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className={styles.adminInput}
                      style={{ flex: 1, minHeight: '60px', resize: 'vertical' }}
                    />
                    {recipeData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        style={{
                          padding: '10px',
                          marginTop: '5px',
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.actionButtons}>
                <Button type="submit" loading={loading} disabled={loading}>
                  <Save size={16} /> Save Recipe
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
}
