import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Link, QrCode, X } from "lucide-react";

export function QrCodeUploadModal({ isOpen, onClose, onSubmit }) {
  // State for form values
  const [formValues, setFormValues] = useState({
    title: "",
    qrCodeLink: "",
    description: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        title: "",
        qrCodeLink: "",
        description: "",
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

  // Validate if the string is a valid URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValues.title.trim()) {
      alert("Please enter a title for the QR code");
      return;
    }

    if (!formValues.qrCodeLink.trim()) {
      alert("Please provide a link to the QR code");
      return;
    }

    if (!isValidUrl(formValues.qrCodeLink)) {
      alert("Please provide a valid URL for the QR code");
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
            Add QR Code Link
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
              <Label htmlFor="qrCodeLink" className="text-gray-700 mb-2 block">
                QR Code Link
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="qrCodeLink"
                  name="qrCodeLink"
                  value={formValues.qrCodeLink}
                  onChange={handleChange}
                  className="pl-10 border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                  placeholder="Paste link to your QR code image (Google Drive, Dropbox, etc.)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please provide a direct link to the QR code image with public access enabled
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!formValues.qrCodeLink.trim() || !formValues.title.trim()}
            >
              Save QR Code Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
