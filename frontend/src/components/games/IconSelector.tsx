"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type IconSelectorProps = {
  onSelect: (icons: string[]) => void
  onClose: () => void
  currentIcons: string[]
  iconCount: number
}

export default function IconSelector({ onSelect, onClose, currentIcons, iconCount }: IconSelectorProps) {
  const [allIcons, setAllIcons] = useState<string[]>([])
  const [selectedIcons, setSelectedIcons] = useState<Array<string | null>>(
    Array(iconCount).fill(null).map((_, i) => currentIcons[i] || null)
  )

  useEffect(() => {
    const storedIcons = localStorage.getItem("gameIcons")
    if (storedIcons) {
      setAllIcons(JSON.parse(storedIcons))
    }
  }, [])

  const handleSelectedSlotClick = (index: number) => {
    const newSelected = [...selectedIcons]
    newSelected[index] = null
    setSelectedIcons(newSelected)
  }

  const handleAvailableIconClick = (icon: string) => {
    const firstEmptyIndex = selectedIcons.findIndex(i => i === null)
    if (firstEmptyIndex !== -1) {
      const newSelected = [...selectedIcons]
      newSelected[firstEmptyIndex] = icon
      setSelectedIcons(newSelected)
    }
  }

  const handleSubmit = () => {
    if (selectedIcons.every(icon => icon !== null)) {
      onSelect(selectedIcons.filter(Boolean) as string[])
    }
  }

  const isIconSelected = (icon: string) => selectedIcons.includes(icon)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-2">Select {iconCount} Icons</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click selected icons to remove them, then choose new ones from below
        </p>

        {/* Selected Icons Grid */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          {selectedIcons.map((icon, index) => (
            <button
              key={index}
              onClick={() => handleSelectedSlotClick(index)}
              className={`p-2 rounded-lg transition-colors ${
                icon ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {icon ? (
                <img src={icon} alt={`Selected Icon ${index + 1}`} className="w-8 h-8" />
              ) : (
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded" />
              )}
            </button>
          ))}
        </div>

        {/* Available Icons List */}
        <div className="h-64 overflow-y-auto mb-4">
          <div className="grid grid-cols-8 gap-2">
            {allIcons.map((icon, index) => (
              <button
                key={index}
                onClick={() => handleAvailableIconClick(icon)}
                disabled={isIconSelected(icon)}
                className={`p-2 rounded-lg transition-colors ${
                  isIconSelected(icon)
                    ? "bg-blue-500 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                }`}
              >
                <img
                  src={icon}
                  alt={`Icon ${index + 1}`}
                  className={`w-8 h-8 ${isIconSelected(icon) ? "opacity-50" : ""}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedIcons.some(icon => icon === null)}
            className={`px-4 py-2 text-white rounded transition-colors ${
              selectedIcons.every(icon => icon !== null)
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </motion.div>
  )
}
