
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Recipe } from '@/utils/recipeStorage';
import { Plus, X, Image } from 'lucide-react';

interface AddRecipeFormProps {
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
}

const AddRecipeForm = ({ onSubmit }: AddRecipeFormProps) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState<string[]>(['']);
  const [difficulty, setDifficulty] = useState<'Quickie' | 'Gourmet' | 'Comfort Food'>('Quickie');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>(['']);

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

  const addImage = () => {
    setImages([...images, '']);
  };

  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const removeImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
    const filteredTags = tags.filter(tag => tag.trim() !== '');
    const filteredImages = images.filter(img => img.trim() !== '');
    
    if (!title.trim() || filteredIngredients.length === 0 || !instructions.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      ingredients: filteredIngredients,
      instructions: instructions.trim(),
      tags: filteredTags,
      difficulty,
      coverImage: coverImage.trim() || undefined,
      images: filteredImages.length > 0 ? filteredImages : undefined,
    });

    // Reset form
    setTitle('');
    setIngredients(['']);
    setInstructions('');
    setTags(['']);
    setDifficulty('Quickie');
    setCoverImage('');
    setImages(['']);
  };

  return (
    <div className="space-y-6 pb-4">
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

        {/* Cover Image */}
        <div>
          <Label htmlFor="coverImage" className="text-lg font-bold">Cover Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="coverImage"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/cover-image.jpg"
              className="border-2 border-black rounded-lg font-bold"
            />
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 border-2 border-black rounded-lg flex items-center justify-center">
              <Image size={20} className="text-gray-500" />
            </div>
          </div>
          {coverImage && (
            <div className="mt-2">
              <img src={coverImage} alt="Cover preview" className="w-32 h-24 object-cover rounded-lg border-2 border-black" />
            </div>
          )}
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
          <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
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
          </div>
          <Button
            type="button"
            onClick={addIngredient}
            variant="outline"
            className="border-2 border-green-500 text-green-500 hover:bg-green-50 font-bold mt-2"
          >
            <Plus size={16} />
            Add Ingredient
          </Button>
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

        {/* Additional Images */}
        <div>
          <Label className="text-lg font-bold">Additional Images</Label>
          <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
            {images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder={`Image URL ${index + 1}...`}
                  className="border-2 border-black rounded-lg font-bold"
                />
                {images.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeImage(index)}
                    variant="outline"
                    size="icon"
                    className="border-2 border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={addImage}
            variant="outline"
            className="border-2 border-purple-500 text-purple-500 hover:bg-purple-50 font-bold mt-2"
          >
            <Plus size={16} />
            Add Image
          </Button>
        </div>

        {/* Tags */}
        <div>
          <Label className="text-lg font-bold">Tags</Label>
          <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
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
          </div>
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold mt-2"
          >
            <Plus size={16} />
            Add Tag
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-lg border-4 border-black rounded-xl shadow-lg transform hover:scale-105 transition-transform py-3"
        >
          🚀 Create Epic Recipe! 🚀
        </Button>
      </form>
    </div>
  );
};

export default AddRecipeForm;
