"use client";

interface IngredientItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface KeyIngredientsProps {
  ingredients: IngredientItem[];
}

export function KeyIngredients({ ingredients }: KeyIngredientsProps) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-medium text-text mb-12 text-center">
          Key Ingredients
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${ingredient.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {ingredient.title}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {ingredient.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
