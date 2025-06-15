
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Recipe } from '@/utils/recipeStorage';
import { Plus, X } from 'lucide-react';

interface AddRecipeFormProps {
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
}

const AddRecipeForm = ({ onSubmit }: AddRecipeFormProps) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState<string[]>(['']);
  const [difficulty, setDifficulty] = useState<'Quickie' | 'Gourmet' | 'Comfort Food'>('Quickie');
  const [image, setImage] = useState('');

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
    const filteredTags = tags.filter(tag => tag.trim() !== '');
    
    if (!title.trim() || filteredIngredients.length === 0 || !instructions.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      ingredients: filteredIngredients,
      instructions: instructions.trim(),
      tags: filteredTags,
      difficulty,
      image: image.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setIngredients(['']);
    setInstructions('');
    setTags(['']);
    setDifficulty('Quickie');
    setImage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-lg font-bold">Recipe Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Epic Recipe..."
          className="border-2 border-black rounded-lg font-bold"
          required
        />
      </div>

      {/* Difficulty */}
      <div>
        <Label className="text-lg font-bold">Difficulty Level</Label>
        <div className="flex gap-2 mt-2">
          {(['Quickie', 'Gourmet', 'Comfort Food'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 border-2 border-black rounded-lg font-bold transition-colors ${
                difficulty === level
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {level === 'Quickie' && '⚡'} 
              {level === 'Gourmet' && '👨‍🍳'} 
              {level === 'Comfort Food' && '🤗'} 
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <Label className="text-lg font-bold">Ingredients *</Label>
        <div className="space-y-2 mt-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}...`}
                className="border-2 border-black rounded-lg font-bold"
              />
              {ingredients.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  variant="outline"
                  size="icon"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-50"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={addIngredient}
            variant="outline"
            className="border-2 border-green-500 text-green-500 hover:bg-green-50 font-bold"
          >
            <Plus size={16} />
            Add Ingredient
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <Label htmlFor="instructions" className="text-lg font-bold">Instructions *</Label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Step-by-step cooking instructions..."
          className="w-full h-32 p-3 border-2 border-black rounded-lg font-bold resize-none"
          required
        />
      </div>

      {/* Tags */}
      <div>
        <Label className="text-lg font-bold">Tags</Label>
        <div className="space-y-2 mt-2">
          {tags.map((tag, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                placeholder={`Tag ${index + 1} (e.g., Breakfast, Spicy)...`}
                className="border-2 border-black rounded-lg font-bold"
              />
              {tags.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeTag(index)}
                  variant="outline"
                  size="icon"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-50"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold"
          >
            <Plus size={16} />
            Add Tag
          </Button>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <Label htmlFor="image" className="text-lg font-bold">Image URL (Optional)</Label>
        <Input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/recipe-image.jpg"
          className="border-2 border-black rounded-lg font-bold"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-lg border-4 border-black rounded-xl shadow-lg transform hover:scale-105 transition-transform py-3"
      >
        🚀 Create Epic Recipe! 🚀
      </Button>
    </form>
  );
};

export default AddRecipeForm;
