import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as recipes from '../api/recipes.js'
import * as favorites from '../api/favorites.js'

export default function RecipeModal({ id, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setDetails(null)

    ;(async () => {
      try {
        const d = await recipes.getById(id)
        if (!cancelled) setDetails(d)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load recipe')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [id])

  const add = async () => {
    if (!details) return
    setAdding(true)
    try {
      await favorites.add({
        recipeId: details.idMeal,
        name: details.strMeal,
        thumbnail: details.strMealThumb
      })
      setShowFeedback(true)
      setTimeout(() => { onClose() }, 1500)
    } catch (error) {
      console.error('Error adding to favorites:', error)
    } finally {
      setAdding(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden z-10"
        >
          <div className="bg-white rounded-2xl overflow-hidden border shadow-2xl">
            {loading ? (
              <div className="p-8 text-center">Loading…</div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">
                Failed to load recipe: {error}
                <div className="mt-4">
                  <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Close</button>
                </div>
              </div>
            ) : !details ? (
              <div className="p-8 text-center">No recipe found.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative">
                  <img src={details.strMealThumb} alt={details.strMeal} className="w-full h-64 lg:h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                <div className="p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{details.strMeal}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {[details.strArea, details.strCategory].filter(Boolean).map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium">{t}</span>
                      ))}
                    </div>
                  </div>

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-100 border border-green-200 rounded-lg text-green-800 text-sm font-medium"
                    >
                      ✅ Recipe added to favorites!
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Cooking Instructions
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                        {details.strInstructions}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={add}
                      disabled={adding || showFeedback}
                      className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {adding ? 'Adding…' : showFeedback ? 'Added!' : 'Add to Favorites'}
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
