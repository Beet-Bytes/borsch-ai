'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createProductApi,
  CreateProductPayload,
  checkAdminStatus,
  createRecipeApi,
  CreateRecipePayload,
} from '@/app/services/admin';

export function useAdmin() {
  const router = useRouter();
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [activeTab, setActiveTab] = useState<'product' | 'recipe'>('product');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function verifyAccess() {
      try {
        const user = await checkAdminStatus();
        if (user.role !== 'admin') router.replace('/');
        else setIsCheckingRole(false);
      } catch (error) {
        router.replace('/login');
      }
    }
    verifyAccess();
  }, [router]);

  // === ЛОГІКА ПРОДУКТІВ (без змін) ===
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    category: 'Vegetables',
    default_unit: 'g',
    nutrition_per_100g: { calories: 0, protein: 0, fat: 0, carbs: 0 },
  });

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      nutrition_per_100g: { ...prev.nutrition_per_100g, [name]: Number(value) },
    }));
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await createProductApi(formData);
      setMessage({ type: 'success', text: `Product added successfully!` });
      setFormData({
        name: '',
        category: 'Vegetables',
        default_unit: 'g',
        nutrition_per_100g: { calories: 0, protein: 0, fat: 0, carbs: 0 },
      });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  // === ЛОГІКА РЕЦЕПТІВ (ОНОВЛЕНО) ===
  const initialRecipeState: CreateRecipePayload = {
    name: '',
    goal: 'muscle_gain',
    cooking_time: 30,
    difficulty: 'easy',
    number_of_servings: 1,
    utensils: [],
    ingredients: [{ _id: '', quantity: 0 }],
    steps: [{ step_number: 1, instruction: '' }],
    total_nutrition_per_serving: { calories: 0, protein: 0, fat: 0, carbs: 0 },
  };

  const [recipeData, setRecipeData] = useState<CreateRecipePayload>(initialRecipeState);
  const [utensilsInput, setUtensilsInput] = useState(''); // Для вводу через кому

  const handleRecipeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setRecipeData((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleRecipeNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({
      ...prev,
      total_nutrition_per_serving: { ...prev.total_nutrition_per_serving, [name]: Number(value) },
    }));
  };

  // Інгредієнти (_id та quantity)
  const addIngredient = () =>
    setRecipeData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { _id: '', quantity: 0 }],
    }));
  const updateIngredient = (index: number, field: '_id' | 'quantity', value: string | number) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipeData((prev) => ({ ...prev, ingredients: newIngredients }));
  };
  const removeIngredient = (index: number) =>
    setRecipeData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));

  // Кроки (step_number та instruction)
  const addInstruction = () => {
    setRecipeData((prev) => ({
      ...prev,
      steps: [...prev.steps, { step_number: prev.steps.length + 1, instruction: '' }],
    }));
  };
  const updateInstruction = (index: number, value: string) => {
    const newSteps = [...recipeData.steps];
    newSteps[index] = { ...newSteps[index], instruction: value };
    setRecipeData((prev) => ({ ...prev, steps: newSteps }));
  };
  const removeInstruction = (index: number) => {
    const filtered = recipeData.steps.filter((_, i) => i !== index);
    // Перераховуємо step_number
    const renumbered = filtered.map((step, i) => ({ ...step, step_number: i + 1 }));
    setRecipeData((prev) => ({ ...prev, steps: renumbered }));
  };

  const submitRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Перетворюємо рядок інвентарю на масив
      const payload = {
        ...recipeData,
        utensils: utensilsInput
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      await createRecipeApi(payload);
      setMessage({ type: 'success', text: `Recipe "${payload.name}" added successfully!` });
      setRecipeData(initialRecipeState);
      setUtensilsInput('');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return {
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
    utensilsInput,
    setUtensilsInput,
    handleRecipeChange,
    handleRecipeNutritionChange,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addInstruction,
    updateInstruction,
    removeInstruction,
    submitRecipe,
  };
}
