
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  image?: string;
  tags: string[];
  difficulty: 'Quickie' | 'Gourmet' | 'Comfort Food';
  createdAt: string;
}

const STORAGE_KEY = 'chonky-recipes';

export const recipeStorage = {
  getAllRecipes(): Recipe[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading recipes:', error);
      return [];
    }
  },

  addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Recipe {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const recipes = this.getAllRecipes();
    recipes.push(newRecipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    return newRecipe;
  },

  updateRecipe(id: string, updates: Partial<Recipe>): void {
    const recipes = this.getAllRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      recipes[index] = { ...recipes[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }
  },

  deleteRecipe(id: string): void {
    const recipes = this.getAllRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  exportSingleRecipe(recipe: Recipe): void {
    const dataStr = JSON.stringify(recipe, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};
