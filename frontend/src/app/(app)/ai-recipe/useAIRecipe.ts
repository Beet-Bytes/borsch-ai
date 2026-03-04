'use client';

import { useState } from 'react';
import {
  analyzeFridgeImage,
  AIAnalyzeResponse,
  DetectedIngredient,
} from '@/app/services/recognition';

export function useAIRecipe() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AIAnalyzeResponse | null>(null);

  // Нові стани для покращеного UX
  const [isDragging, setIsDragging] = useState(false);
  const [editableIngredients, setEditableIngredients] = useState<DetectedIngredient[]>([]);

  // Спільна функція для обробки файлу (з інпута або через drag&drop)
  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setEditableIngredients([]);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  // Drag & Drop обробники
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Видалення інгредієнта зі списку
  const removeIngredient = (indexToRemove: number) => {
    setEditableIngredients((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setEditableIngredients([]);
    setError('');
  };

  return {
    file,
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
  };
}
