import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as favorites from '../api/favorites.js'

export default function Favorites() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await favorites.list()
    setList(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    await favorites.remove(id)
    load()
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Your Favorites</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} className="h-48 rounded-2xl bg-gray-100" initial={{opacity:0.3}} animate={{opacity:[0.4,1,0.4]}} transition={{duration:1.2, repeat:Infinity}}/>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-gray-600">No favorites yet. Add some delicious recipes! 🍝</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {list.map((m) => (
            <motion.div key={m._id} whileHover={{ y: -4 }} className="bg-white border rounded-2xl overflow-hidden">
              <img src={m.thumbnail} alt={m.name} className="w-full h-40 object-cover" />
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="font-medium line-clamp-2">{m.name}</div>
                <button onClick={()=>remove(m._id)} className="px-3 py-2 rounded-xl bg-rose-600 text-white">Remove</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
