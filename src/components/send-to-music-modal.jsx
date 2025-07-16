import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Music } from "lucide-react";
import { Textarea } from "./ui/textarea";

export function SendToMusicModal({ isOpen, onClose, onSubmit, documentType }) {
  // Default values
  const documentTypes = {
    concept: "Concept Document",
    final: "Final Liturgy",
    sermon: "Sermon",
  };

  const documentTitle = documentTypes[documentType] || "Document";

  // State for form values
  const [formValues, setFormValues] = useState({
    email: "music@gkin.org", // Default music team email
    subject: `[GKIN] ${documentTitle} for Music Team`,
    message: `Dear Music Team,\n\nPlease find attached the ${documentTitle} for the upcoming service.\n\nKind regards,\nLiturgy Team`,
  });

  // Reset form when modal opens with a new document type
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        email: "music@gkin.org",
        subject: `[GKIN] ${documentTitle} for Music Team`,
        message: `Dear Music Team,\n\nPlease find attached the ${documentTitle} for the upcoming service.\n\nKind regards,\nLiturgy Team`,
      });
    }
  }, [isOpen, documentTitle]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Add the document type to the data being sent
    const dataToSubmit = {
      ...formValues,
      documentType,
      // Add link to the document from our simulation
      documentLink:
        documentType === "concept"
          ? "https://docs.google.com/document/d/1example-concept-document/edit"
          : documentType === "final"
          ? "https://docs.google.com/document/d/1example-final-document/edit"
          : "https://docs.google.com/document/d/1example-document/edit",
    };

    onSubmit(dataToSubmit);
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
            <Music className="w-5 h-5 text-indigo-600" />
            Send {documentTitle} to Music Team
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
              <Label htmlFor="email" className="text-gray-700">
                Music Team Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject" className="text-gray-700">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formValues.subject}
                onChange={handleChange}
                className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message" className="text-gray-700">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                value={formValues.message}
                onChange={handleChange}
                className="border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Document link preview */}
            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200">
              <h3 className="text-sm font-medium text-indigo-800 mb-2">
                Document Link (will be included in the email)
              </h3>
              <div className="text-indigo-600 text-sm break-all bg-white p-2 rounded border border-indigo-100">
                {documentType === "concept"
                  ? "https://docs.google.com/document/d/1example-concept-document/edit"
                  : documentType === "final"
                  ? "https://docs.google.com/document/d/1example-final-document/edit"
                  : "https://docs.google.com/document/d/1example-document/edit"}
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <Button
            type="button"
            onClick={onClose}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
}
