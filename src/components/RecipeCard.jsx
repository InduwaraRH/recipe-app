import React from 'react'
import { motion } from 'framer-motion'

export default function RecipeCard({ meal, onOpen }) {
  console.log('RecipeCard received meal:', meal)
  console.log('Image URL:', meal.strMealThumb)
  
  return (
    <motion.button
      layout
      onClick={() => onOpen(meal.idMeal)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="text-left group"
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 h-full">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img 
            src={meal.strMealThumb} 
            alt={meal.strMeal} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('Image failed to load:', meal.strMealThumb)
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {meal.strMeal}
          </h3>
        </div>
      </div>
    </motion.button>
  )
}
