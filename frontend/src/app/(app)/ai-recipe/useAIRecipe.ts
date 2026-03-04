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

  // Локальні стейти для інгредієнтів
  const [originalAiIngredients, setOriginalAiIngredients] = useState<string[]>([]);
  const [editableIngredients, setEditableIngredients] = useState<DetectedIngredient[]>([]);

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
      setEditableIngredients(data.ingredients || []);

      // Зберігаємо оригінальні назви для бекенду
      const originalNames = (data.ingredients || []).map((item) => item.ingredient);
      setOriginalAiIngredients(originalNames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
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

  const saveIngredient = (newName: string) => {
    if (editingIndex !== null) {
      const updated = [...editableIngredients];
      updated[editingIndex] = { ingredient: newName, confidence: 1.0 };
      setEditableIngredients(updated);
    } else {
      setEditableIngredients((prev) => [...prev, { ingredient: newName, confidence: 1.0 }]);
    }
    closeModal();
  };

  const handleGenerateRecipes = async () => {
    if (!file || editableIngredients.length === 0) return;

    setIsGenerating(true);
    setError('');

    try {
      const finalNames = editableIngredients.map((item) => item.ingredient);

      const response = await generateRecipesApi(file, originalAiIngredients, finalNames);

      console.log('Successfully saved to DB & R2:', response);
      alert('Збережено в R2 та Mongo! Перевір базу.');
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
  };
}
