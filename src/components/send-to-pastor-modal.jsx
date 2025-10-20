import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Mail } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useWorkflow } from "./workflow/context/WorkflowContext";

export function SendToPastorModal({ isOpen, onClose, onSubmit, documentType }) {
  // Import the WorkflowContext to get the actual document link
  const { completedTasks } = useWorkflow();
  // Default values
  const documentTypes = {
    concept: "Concept Document",
    final: "Final Liturgy",
    sermon: "Sermon",
  };

  const documentTitle = documentTypes[documentType] || "Document";

  // State for form values
  const [formValues, setFormValues] = useState({
    email: "user2003@andrewscreem.com", // Default pastor email (using your personal email)
    subject: `[GKIN] ${documentTitle} for Review`,
    message: `Dear Pastor,\n\nPlease find attached the ${documentTitle} for the upcoming service.\n\nKind regards,\nLiturgy Team`,
  });

  // Reset form when modal opens with a new document type
  useEffect(() => {
    if (isOpen) {
      setFormValues({
        email: "user2003@andrewscreem.com",
        subject: `[GKIN] ${documentTitle} for Review`,
        message: `Dear Pastor,\n\nPlease find attached the ${documentTitle} for the upcoming service.\n\nKind regards,\nLiturgy Team`,
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
            <Mail className="w-5 h-5 text-blue-600" />
            Send {documentTitle} to Pastor
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
                Pastor's Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Document link preview */}
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Document Link (will be included in the email)
              </h3>
              <div className="text-blue-600 text-sm break-all bg-white p-2 rounded border border-blue-100">
                {completedTasks[documentType]?.documentLink ||
                  completedTasks?.documentLinks?.[documentType] ||
                  (documentType === "concept"
                    ? "https://docs.google.com/document/d/1example-concept-document/edit"
                    : documentType === "final"
                    ? "https://docs.google.com/document/d/1example-final-document/edit"
                    : "https://docs.google.com/document/d/1example-document/edit")}
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
}
