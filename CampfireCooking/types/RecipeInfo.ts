export default interface RecipeInfo {
    _id: string;
    name: string;
    description: string;
    ingredients: Array<{
        quantity: {
            _id: string;
            name: string;
        };
        ingredient: {
            _id: string;
            name: string;
        };
        _id: string;
    }>;
    instructions: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}