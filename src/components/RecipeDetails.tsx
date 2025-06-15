
import React from 'react';
import { Button } from '@/components/ui/button';
import { Recipe, recipeStorage } from '@/utils/recipeStorage';
import { Share, FileDown, Trash, X, Clock, Tag, Heart, BookOpen } from 'lucide-react';
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
      {/* Book Cover */}
      <div className="bg-white border-4 border-black rounded-xl p-6 relative" style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 border-2 border-black hover:bg-gray-100 z-10"
        >
          <X size={20} />
        </Button>
        
        <div className="flex items-start gap-6">
          {/* Recipe Cover Image */}
          <div className="w-48 h-64 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-xl border-4 border-black overflow-hidden flex-shrink-0 relative">
            {recipe.coverImage ? (
              <img src={recipe.coverImage} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">📖</div>
            )}
            {recipe.isFavorite && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 border-2 border-black">
                <Heart size={16} className="text-red-500 fill-red-500" />
              </div>
            )}
          </div>

          {/* Book Title Page */}
          <div className="flex-1">
            <div className="text-center mb-6">
              <BookOpen size={32} className="mx-auto mb-4 text-gray-600" />
              <h1 className="text-4xl font-black mb-4 transform -rotate-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {recipe.title}
              </h1>
              <div className={`inline-block px-6 py-3 rounded-full text-xl font-bold border-4 border-black ${getDifficultyColor(recipe.difficulty)}`}>
                {getDifficultyEmoji(recipe.difficulty)} {recipe.difficulty}
              </div>
            </div>

            {/* Recipe Metadata */}
            <div className="flex items-center justify-center gap-6 text-lg font-bold text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Clock size={20} />
                {recipe.ingredients.length} ingredients
              </div>
              <div className="text-gray-400">•</div>
              <div>Created: {new Date(recipe.createdAt).toLocaleDateString()}</div>
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Chapter 1: Ingredients */}
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden">
        <div className="bg-yellow-400 border-b-4 border-black p-4">
          <h2 className="text-2xl font-black text-center transform -rotate-1">
            📋 Chapter 1: The Ingredients Quest
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <span className="w-8 h-8 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-lg font-medium">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter 2: Instructions */}
      <div className="bg-white border-4 border-black rounded-xl overflow-hidden">
        <div className="bg-green-400 border-b-4 border-black p-4">
          <h2 className="text-2xl font-black text-center transform -rotate-1">
            👨‍🍳 Chapter 2: The Cooking Adventure
          </h2>
        </div>
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="text-lg leading-relaxed whitespace-pre-wrap bg-green-50 border-2 border-green-300 rounded-lg p-4">
              {recipe.instructions}
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 3: Gallery (if images exist) */}
      {recipe.images && recipe.images.length > 0 && (
        <div className="bg-white border-4 border-black rounded-xl overflow-hidden">
          <div className="bg-purple-400 border-b-4 border-black p-4">
            <h2 className="text-2xl font-black text-center transform -rotate-1">
              📸 Chapter 3: The Visual Journey
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipe.images.map((image, index) => (
                <div key={index} className="border-4 border-black rounded-lg overflow-hidden">
                  <img src={image} alt={`Step ${index + 1}`} className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white border-4 border-black rounded-xl p-6">
        <h3 className="text-xl font-black mb-4 text-center transform -rotate-1">Recipe Tools</h3>
        <div className="flex flex-wrap justify-center gap-3">
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
    </div>
  );
};

export default RecipeDetails;
