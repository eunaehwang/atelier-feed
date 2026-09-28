'use client'

import { useState } from 'react'
import AboutModal from './AboutModal'

export default function Highlights() {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <div className="max-w-[935px] mx-auto px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* About highlight */}
          <button
            onClick={() => setShowAbout(true)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-black p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-xl select-none">✦</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[64px] truncate text-center">
              About
            </span>
          </button>
        </div>
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  )
}
