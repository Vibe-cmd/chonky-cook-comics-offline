
import React from 'react';
import { Recipe } from '@/utils/recipeStorage';
import { Clock, Tag } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
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
    <div
      onClick={onClick}
      className="bg-white border-4 border-black rounded-xl p-4 cursor-pointer transform hover:scale-105 hover:rotate-1 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      {/* Recipe Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg mb-4 flex items-center justify-center border-2 border-black">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-6xl">🍽️</div>
        )}
      </div>

      {/* Recipe Title */}
      <h3 className="text-xl font-black mb-2 transform -rotate-1 text-center">
        {recipe.title}
      </h3>

      {/* Difficulty Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold border-2 border-black mb-3 ${getDifficultyColor(recipe.difficulty)}`}>
        {getDifficultyEmoji(recipe.difficulty)} {recipe.difficulty}
      </div>

      {/* Ingredients Count */}
      <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-600">
        <Clock size={16} />
        {recipe.ingredients.length} ingredients
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 border-2 border-blue-500 rounded-full text-xs font-bold text-blue-700"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 border-2 border-gray-500 rounded-full text-xs font-bold text-gray-700">
              +{recipe.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
