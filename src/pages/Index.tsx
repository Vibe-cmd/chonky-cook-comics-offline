
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, BookOpen, Share, FileDown, FileUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import RecipeCard from '@/components/RecipeCard';
import AddRecipeForm from '@/components/AddRecipeForm';
import RecipeDetails from '@/components/RecipeDetails';
import { Recipe, recipeStorage } from '@/utils/recipeStorage';

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = () => {
    const loadedRecipes = recipeStorage.getAllRecipes();
    setRecipes(loadedRecipes);
  };

  const handleAddRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    const newRecipe = recipeStorage.addRecipe(recipe);
    setRecipes(prev => [...prev, newRecipe]);
    setIsAddDialogOpen(false);
    toast({
      title: "POW! Recipe Added! 💥",
      description: "Your delicious creation is now in the vault!",
    });
  };

  const handleDeleteRecipe = (id: string) => {
    recipeStorage.deleteRecipe(id);
    setRecipes(prev => prev.filter(r => r.id !== id));
    setIsDetailsOpen(false);
    toast({
      title: "KAPOW! Recipe Deleted! 🗑️",
      description: "Recipe removed from your collection!",
    });
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportAllRecipes = () => {
    const dataStr = JSON.stringify(recipes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chonky-recipes.json';
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "BOOM! Recipes Exported! 📤",
      description: "All your recipes are now in a JSON file!",
    });
  };

  const importRecipes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedRecipes = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedRecipes)) {
          importedRecipes.forEach(recipe => {
            if (recipe.title && recipe.ingredients && recipe.instructions) {
              recipeStorage.addRecipe(recipe);
            }
          });
          loadRecipes();
          toast({
            title: "ZAP! Recipes Imported! 📥",
            description: `Successfully imported ${importedRecipes.length} recipes!`,
          });
        }
      } catch (error) {
        toast({
          title: "OOPS! Import Failed! ❌",
          description: "Invalid JSON file format!",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EFDFBB' }}>
      {/* Comic Header */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#722F37' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white rounded-full"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-4 border-white transform rotate-45"></div>
          <div className="absolute bottom-4 left-1/2 w-12 h-12 border-4 border-white"></div>
        </div>
        <div className="relative z-10 text-center py-8 px-4">
          <h1 className="text-5xl font-black text-white mb-2 transform -rotate-2 drop-shadow-lg">
            ChonkyChonks
          </h1>
          <p className="text-xl text-white font-bold">My Personalized Comic Recipe Vault!</p>
          <div className="mt-4 inline-block bg-white text-black px-4 py-2 rounded-full font-bold transform rotate-1">
            💥 {recipes.length} Epic Recipes! 💥
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <Input
              placeholder="Search recipes, ingredients, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-4 border-black rounded-xl font-bold shadow-lg"
            />
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold border-4 border-black rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                  <Plus size={20} />
                  Add Recipe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-4 border-black rounded-xl" style={{ backgroundColor: '#EFDFBB' }}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center transform -rotate-1">
                    🍳 Create Epic Recipe! 🍳
                  </DialogTitle>
                </DialogHeader>
                <AddRecipeForm onSubmit={handleAddRecipe} />
              </DialogContent>
            </Dialog>

            <Button
              onClick={exportAllRecipes}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold border-4 border-black rounded-xl shadow-lg transform hover:scale-105 transition-transform"
            >
              <FileDown size={20} />
              Export All
            </Button>

            <label className="cursor-pointer">
              <Button asChild className="bg-purple-500 hover:bg-purple-600 text-white font-bold border-4 border-black rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                <span>
                  <FileUp size={20} />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importRecipes}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white border-4 border-black rounded-xl p-8 inline-block transform rotate-1 shadow-lg">
              <BookOpen size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-black mb-2">No Recipes Yet!</h3>
              <p className="text-gray-600 font-bold">Add your first epic recipe to get started!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setIsDetailsOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recipe Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-black rounded-xl" style={{ backgroundColor: '#EFDFBB' }}>
          {selectedRecipe && (
            <RecipeDetails
              recipe={selectedRecipe}
              onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
