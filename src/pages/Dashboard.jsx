import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as recipesApi from '../api/recipes.js'
import RecipeCard from '../components/RecipeCard.jsx'
import RecipeModal from '../components/RecipeModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [allCategories, setAllCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState('')
  const [recipes, setRecipes] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [modalId, setModalId] = useState(null)

  const allCategoryNames = useMemo(() => {
    console.log('allCategories in useMemo:', allCategories)
    const names = allCategories.map(c => c.strCategory)
    console.log('allCategoryNames:', names)
    return names
  }, [allCategories])

  useEffect(() => {
    console.log('Fetching categories...')
    recipesApi.getCategories().then(d => {
      console.log('Categories response:', d)
      console.log('Categories data:', d.categories)
      const categories = Array.isArray(d) ? d : (d.categories || [])
      console.log('Processed categories:', categories)
      setAllCategories(categories)
      if (categories.length) setSelectedCat(categories[0].strCategory)
    }).catch(err => {
      console.error('Error fetching categories:', err)
    }).finally(() => setCategoriesLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedCat) return
    setLoading(true)
    console.log('Fetching recipes for category:', selectedCat)
    recipesApi.listByCategory(selectedCat).then(d => {
      console.log('Recipes response:', d)
      console.log('Recipes data:', d.meals)
      const recipesData = Array.isArray(d) ? d : (d.meals || [])
      console.log('Processed recipes:', recipesData)
      console.log('First recipe sample:', recipesData[0])
      console.log('Recipe fields:', recipesData[0] ? Object.keys(recipesData[0]) : 'No recipes')
      setRecipes(recipesData)
    }).catch(err => {
      console.error('Error fetching recipes:', err)
    }).finally(() => setLoading(false))
  }, [selectedCat])

  const displayed = useMemo(() => {
    console.log('Computing displayed recipes. recipes:', recipes, 'query:', query)
    if (!query) return recipes
    const filtered = recipes.filter(m => m.strMeal.toLowerCase().includes(query.toLowerCase()))
    console.log('Filtered recipes:', filtered)
    return filtered
  }, [recipes, query])

  return (
    <div className="w-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Categories Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{user?.email}</div>
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {categoriesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {allCategoryNames.map(name => (
                  <button 
                    key={name} 
                    onClick={()=>setSelectedCat(name)} 
                    className={
                      `w-full px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium text-left ${
                        name===selectedCat 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-100' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                      }`
                    }
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Search Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                placeholder="Search recipes..." 
                value={query} 
                onChange={(e)=>setQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              />
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              {displayed.length} recipes
            </div>
          </div>

          {/* Recipe Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" initial={{opacity:0.3}} animate={{opacity:[0.4,1,0.4]}} transition={{duration:1.2, repeat:Infinity}}/>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {displayed.map(m => (
                  <RecipeCard key={m.idMeal} meal={m} onOpen={(id)=>setModalId(id)} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && displayed.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-500">Try adjusting your search or select a different category.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modalId && <RecipeModal id={modalId} onClose={()=>setModalId(null)} />}
      </AnimatePresence>
    </div>
  )
}
