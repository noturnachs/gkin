// src/components/slides-upload-modal.jsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Upload, FileText, Presentation, X } from "lucide-react";

export function SlidesUploadModal({ isOpen, onClose, onSubmit }) {
  // State for form values
  const [formValues, setFormValues] = useState({
    title: "",
    fileUploaded: false,
    fileName: "",
    notes: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        title: "",
        fileUploaded: false,
        fileName: "",
        notes: "",
      });
    }
  }, [isOpen]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues((prev) => ({
        ...prev,
        fileUploaded: true,
        fileName: file.name,
      }));
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormValues((prev) => ({
        ...prev,
        fileUploaded: true,
        fileName: file.name,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValues.title.trim()) {
      alert("Please enter a title for the presentation");
      return;
    }

    if (!formValues.fileUploaded) {
      alert("Please upload a presentation file");
      return;
    }

    onSubmit({
      ...formValues,
      uploadedAt: new Date().toISOString(),
    });
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8 animate-fadeIn"
        style={{ maxHeight: "calc(100vh - 4rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Presentation className="w-5 h-5 text-orange-600" />
            Upload Presentation Slides
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-700">
                Presentation Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                placeholder="Enter presentation title"
              />
            </div>

            <div>
              <Label className="text-gray-700 mb-2 block">
                Upload Presentation File
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  formValues.fileUploaded
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-300 hover:border-orange-300 hover:bg-gray-50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {formValues.fileUploaded ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-orange-500" />
                    <span className="text-orange-600 font-medium">
                      {formValues.fileName}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-red-500 hover:text-red-700"
                      onClick={() =>
                        setFormValues((prev) => ({
                          ...prev,
                          fileUploaded: false,
                          fileName: "",
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-500">
                      Drag and drop your presentation file here, or
                    </span>
                    <label className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium">
                      Browse files
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".ppt,.pptx,.pdf"
                      />
                    </label>
                    <span className="text-xs text-gray-500 mt-1">
                      Supported formats: PPT, PPTX, PDF
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-700">
                Notes (Optional)
              </Label>
              <Input
                id="notes"
                name="notes"
                value={formValues.notes}
                onChange={handleChange}
                className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                placeholder="Any additional notes about the presentation"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Upload Slides
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
