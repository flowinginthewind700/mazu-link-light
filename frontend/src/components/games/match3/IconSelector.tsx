"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type IconSelectorProps = {
  onSelect: (icons: string[]) => void
  onClose: () => void
  currentIcons: string[]
}

export default function IconSelector({ onSelect, onClose, currentIcons }: IconSelectorProps) {
  const [allIcons, setAllIcons] = useState<string[]>([])
  const [selectedIcons, setSelectedIcons] = useState<string[]>(currentIcons)

  useEffect(() => {
    const storedIcons = localStorage.getItem("iconPaths")
    if (storedIcons) {
      setAllIcons(JSON.parse(storedIcons))
    }
  }, [])

  const handleIconClick = (icon: string) => {
    if (selectedIcons.includes(icon)) {
      setSelectedIcons(selectedIcons.filter((i) => i !== icon))
    } else if (selectedIcons.length < 6) {
      setSelectedIcons([...selectedIcons, icon])
    }
  }

  const handleSubmit = () => {
    if (selectedIcons.length === 6) {
      onSelect(selectedIcons)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Select 6 Icons</h2>
        <div className="grid grid-cols-5 gap-4">
          {allIcons.map((icon, index) => (
            <button
              key={index}
              onClick={() => handleIconClick(icon)}
              className={`p-2 rounded-lg ${
                selectedIcons.includes(icon) ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              <img src={icon || "/placeholder.svg"} alt={`Icon ${index + 1}`} className="w-12 h-12" />
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedIcons.length !== 6}
            className={`px-4 py-2 text-white rounded ${
              selectedIcons.length === 6 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </motion.div>
  )
}

