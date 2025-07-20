import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Upload, Image, QrCode, X } from "lucide-react";

export function QrCodeUploadModal({ isOpen, onClose, onSubmit }) {
  // State for form values
  const [formValues, setFormValues] = useState({
    title: "",
    imageUploaded: false,
    fileName: "",
    description: "",
    imagePreview: null,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        title: "",
        imageUploaded: false,
        fileName: "",
        description: "",
        imagePreview: null,
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
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormValues((prev) => ({
          ...prev,
          imageUploaded: true,
          fileName: file.name,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image paste
  const handlePaste = (e) => {
    const items = (e.clipboardData || window.clipboardData).items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();

        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormValues((prev) => ({
            ...prev,
            imageUploaded: true,
            fileName: "Pasted image",
            imagePreview: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormValues((prev) => ({
          ...prev,
          imageUploaded: true,
          fileName: file.name,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValues.title.trim()) {
      alert("Please enter a title for the QR code");
      return;
    }

    if (!formValues.imageUploaded) {
      alert("Please upload a QR code image");
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
            <QrCode className="w-5 h-5 text-emerald-600" />
            Upload QR Code
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
                QR Code Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                className="border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                placeholder="Enter QR code title (e.g., Donation QR Code)"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700">
                Description (Optional)
              </Label>
              <Input
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                className="border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                placeholder="Enter a short description"
              />
            </div>

            <div>
              <Label className="text-gray-700 mb-2 block">
                Upload QR Code Image
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  formValues.imageUploaded
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-gray-300 hover:border-emerald-300 hover:bg-gray-50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onPaste={handlePaste}
                tabIndex={0}
              >
                {formValues.imageUploaded ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-32 h-32 border border-emerald-200 rounded-md overflow-hidden">
                      <img
                        src={formValues.imagePreview}
                        alt="QR Code Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-emerald-600 font-medium">
                      {formValues.fileName}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-red-500 hover:text-red-700"
                      onClick={() =>
                        setFormValues((prev) => ({
                          ...prev,
                          imageUploaded: false,
                          fileName: "",
                          imagePreview: null,
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Image className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-500">
                      Drag and drop your QR code image here, or
                    </span>
                    <label className="cursor-pointer text-emerald-600 hover:text-emerald-700 font-medium">
                      Browse files
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                    <span className="text-xs text-gray-500 mt-1">
                      Supported formats: PNG, JPG, JPEG, GIF
                    </span>
                    <div className="mt-2 text-xs text-gray-500">
                      You can also paste an image directly (Ctrl+V)
                    </div>
                  </div>
                )}
              </div>
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!formValues.imageUploaded || !formValues.title.trim()}
            >
              Upload QR Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
