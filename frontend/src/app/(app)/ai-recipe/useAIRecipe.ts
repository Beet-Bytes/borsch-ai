'use client';

import { useState } from 'react';
import {
  analyzeFridgeImage,
  AIAnalyzeResponse,
  DetectedIngredient,
  generateRecipesApi,
} from '@/app/services/recognition';

export function useAIRecipe() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AIAnalyzeResponse | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Local states for ingredients
  const [originalAiIngredients, setOriginalAiIngredients] = useState<string[]>([]);
  const [editableIngredients, setEditableIngredients] = useState<DetectedIngredient[]>([]);

  // ВИПРАВЛЕНО: змінено типізацію з never[] на any[] (або можна описати точний інтерфейс Recipe)
  const [recommendedRecipes, setRecommendedRecipes] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setEditableIngredients([]);
    setOriginalAiIngredients([]);
    setRecommendedRecipes([]);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const data = await analyzeFridgeImage(file);
      setResult(data);

      const grouped: Record<string, DetectedIngredient> = {};
      (data.ingredients || []).forEach((item) => {
        if (grouped[item.ingredient]) {
          grouped[item.ingredient].quantity = (grouped[item.ingredient].quantity || 1) + 1;
          grouped[item.ingredient].confidence = Math.max(
            grouped[item.ingredient].confidence,
            item.confidence
          );
        } else {
          grouped[item.ingredient] = { ...item, quantity: 1, unit: item.unit || 'pcs' };
        }
      });

      setEditableIngredients(Object.values(grouped));
      setOriginalAiIngredients((data.ingredients || []).map((item) => item.ingredient));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateIngredientItem = (
    index: number,
    field: keyof DetectedIngredient,
    value: string | number
  ) => {
    const updated = [...editableIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setEditableIngredients(updated);
  };

  const removeIngredient = (indexToRemove: number) => {
    setEditableIngredients((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setEditableIngredients([]);
    setOriginalAiIngredients([]);
    setRecommendedRecipes([]);
    setError('');
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const saveIngredient = (newName: string, defaultUnit: string = 'g') => {
    if (editingIndex !== null) {
      const updated = [...editableIngredients];
      updated[editingIndex] = {
        ...updated[editingIndex],
        ingredient: newName,
        unit: defaultUnit,
      };
      setEditableIngredients(updated);
    } else {
      // Використовуємо передану одиницю замість жорсткого 'g'
      setEditableIngredients((prev) => [
        ...prev,
        { ingredient: newName, confidence: 1.0, quantity: 1, unit: defaultUnit },
      ]);
    }
    closeModal();
  };

  const handleGenerateRecipes = async () => {
    if (!file || editableIngredients.length === 0) return;
    setIsGenerating(true);
    setError('');

    try {
      // Формуємо фінальний масив ОБ'ЄКТІВ (з кількістю і одиницями)
      const finalItems = editableIngredients.map((item) => ({
        name: item.ingredient,
        quantity: item.quantity || 1,
        unit: item.unit || 'pcs',
      }));

      const response = await generateRecipesApi(file, originalAiIngredients, finalItems);

      const recipesArray = Array.isArray(response.recipes) ? response.recipes : [];
      setRecommendedRecipes(recipesArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipes');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    file,
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
    updateIngredientItem,
  };
}
