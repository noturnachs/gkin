import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Upload, FileText, Book } from "lucide-react";

export function SermonUploadModal({ isOpen, onClose, onSubmit }) {
  // State for form values - removed scripture, date, and notes
  const [formValues, setFormValues] = useState({
    sermonTitle: "",
    fileUploaded: false,
    fileName: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        sermonTitle: "",
        fileUploaded: false,
        fileName: "",
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

    if (!formValues.sermonTitle.trim()) {
      alert("Please enter a sermon title");
      return;
    }

    if (!formValues.fileUploaded) {
      alert("Please upload a sermon document");
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
            <Book className="w-5 h-5 text-purple-600" />
            Upload Sermon
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="sermonTitle" className="text-gray-700">
                Sermon Title *
              </Label>
              <Input
                id="sermonTitle"
                name="sermonTitle"
                value={formValues.sermonTitle}
                onChange={handleChange}
                className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* File upload area */}
            <div className="grid gap-2">
              <Label className="text-gray-700">Upload Sermon Document *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  formValues.fileUploaded
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-purple-300 bg-gray-50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {formValues.fileUploaded ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-8 h-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      {formValues.fileName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      File uploaded successfully
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
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
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Drag and drop your file here
                    </p>
                    <p className="text-xs text-gray-500 mt-1 mb-2">
                      Or click to browse
                    </p>
                    <input
                      type="file"
                      id="sermon-file"
                      accept=".doc,.docx,.pdf,.txt"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="sermon-file"
                      className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-md cursor-pointer hover:bg-purple-700"
                    >
                      Select File
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Accepted formats: .doc, .docx, .pdf, .txt
              </p>
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
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={
                !formValues.fileUploaded || !formValues.sermonTitle.trim()
              }
            >
              Upload Sermon
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
