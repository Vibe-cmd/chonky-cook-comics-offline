
import React from 'react';
import { Button } from '@/components/ui/button';
import { Recipe, recipeStorage } from '@/utils/recipeStorage';
import { Share, FileDown, Trash, X, Clock, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecipeDetailsProps {
  recipe: Recipe;
  onDelete: () => void;
  onClose: () => void;
}

const RecipeDetails = ({ recipe, onDelete, onClose }: RecipeDetailsProps) => {
  const { toast } = useToast();

  const handleExportSingle = () => {
    recipeStorage.exportSingleRecipe(recipe);
    toast({
      title: "BOOM! Recipe Exported! 📤",
      description: `${recipe.title} exported as JSON!`,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: `Check out this recipe: ${recipe.title}\n\nIngredients:\n${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}\n\nInstructions:\n${recipe.instructions}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "KAPOW! Recipe Shared! 📱",
          description: "Recipe shared successfully!",
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text).then(() => {
        toast({
          title: "ZAP! Copied to Clipboard! 📋",
          description: "Recipe text copied to clipboard!",
        });
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Quickie': return 'bg-green-400';
      case 'Gourmet': return 'bg-red-400';
      case 'Comfort Food': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'Quickie': return '⚡';
      case 'Gourmet': return '👨‍🍳';
      case 'Comfort Food': return '🤗';
      default: return '🍽️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black mb-2 transform -rotate-1">
            {recipe.title}
          </h2>
          <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold border-2 border-black ${getDifficultyColor(recipe.difficulty)}`}>
            {getDifficultyEmoji(recipe.difficulty)} {recipe.difficulty}
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="border-2 border-black hover:bg-gray-100"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Recipe Image */}
      {recipe.image && (
        <div className="w-full h-64 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-xl border-4 border-black overflow-hidden">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Recipe Info */}
      <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          {recipe.ingredients.length} ingredients
        </div>
        <div className="text-gray-400">•</div>
        <div>Created: {new Date(recipe.createdAt).toLocaleDateString()}</div>
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 border-2 border-blue-500 rounded-full text-sm font-bold text-blue-700"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients */}
      <div className="bg-white border-4 border-black rounded-xl p-6">
        <h3 className="text-2xl font-black mb-4 transform -rotate-1">🥘 Ingredients</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-3 text-lg">
              <span className="w-6 h-6 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="bg-white border-4 border-black rounded-xl p-6">
        <h3 className="text-2xl font-black mb-4 transform -rotate-1">👨‍🍳 Instructions</h3>
        <div className="text-lg whitespace-pre-wrap leading-relaxed">
          {recipe.instructions}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4">
        <Button
          onClick={handleShare}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold border-4 border-black rounded-xl shadow-lg transform hover:scale-105 transition-transform"
        >
          <Share size={20} />
          Share Recipe
        </Button>
        
        <Button
          onClick={handleExportSingle}
          className="bg-green-500 hover:bg-green-600 text-white font-bold border-4 border-black rounded-xl shadow-lg transform hover:scale-105 transition-transform"
        >
          <FileDown size={20} />
          Export JSON
        </Button>
        
        <Button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold border-4 border-black rounded-xl shadow-lg transform hover:scale-105 transition-transform"
        >
          <Trash size={20} />
          Delete Recipe
        </Button>
      </div>
    </div>
  );
};

export default RecipeDetails;
