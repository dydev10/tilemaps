import { useState } from "react";

export default function FullscreenModalWithSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Open Button */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={() => setIsOpen(true)}
      >
        Open Fullscreen Modal
      </button>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-white w-full h-full md:w-4/5 md:h-4/5 p-6 rounded-lg shadow-lg overflow-auto flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* New Header Row */}
            <div className="w-full flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-2xl font-semibold">Fullscreen Modal</h2>
              <button
                className="text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Two Column Layout (Main Content + Sidebar) */}
            <div className="flex flex-col md:flex-row flex-1">
              {/* Main Content */}
              <div className="flex-1 p-4 border-r border-gray-300">
                <h3 className="text-lg font-medium">Main Content</h3>
                <p className="text-gray-600 mt-2">
                  This is the main content area of the modal. Add text, forms, or other components here.
                </p>
              </div>

              {/* Right Sidebar - Row Layout */}
              <div className="w-full md:w-1/3 p-4 flex flex-col space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="text-md font-semibold">Section 1</h4>
                  <p className="text-gray-600 text-sm">Sidebar content row 1.</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="text-md font-semibold">Section 2</h4>
                  <p className="text-gray-600 text-sm">Sidebar content row 2.</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h4 className="text-md font-semibold">Section 3</h4>
                  <p className="text-gray-600 text-sm">Sidebar content row 3.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
