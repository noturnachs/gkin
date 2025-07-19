import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Book, X, Save, Upload, FileText } from "lucide-react";

export function SermonTranslationModal({
  isOpen,
  onClose,
  onSubmit,
  sermonData,
}) {
  // State for form values
  const [formValues, setFormValues] = useState({
    translatedTitle: "",
    translatedText: "",
    fileUploaded: false,
    fileName: "",
  });

  // Initialize form with sermon data when modal opens
  useEffect(() => {
    if (isOpen && sermonData) {
      setFormValues({
        translatedTitle: sermonData.translatedTitle || "",
        translatedText: sermonData.translatedText || "",
        fileUploaded: false,
        fileName: "",
      });
    }
  }, [isOpen, sermonData]);

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

    if (!formValues.translatedTitle.trim() && !formValues.fileUploaded) {
      alert(
        "Please either enter a translated title and text or upload a translation file"
      );
      return;
    }

    onSubmit({
      ...formValues,
      originalSermonId: sermonData?.id || "",
      originalSermonTitle: sermonData?.sermonTitle || "",
      translatedAt: new Date().toISOString(),
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
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8 animate-fadeIn"
        style={{ maxHeight: "calc(100vh - 4rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Book className="w-5 h-5 text-green-600" />
            Translate Sermon
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 10rem)" }}
        >
          {!sermonData ? (
            <div className="text-center py-8 text-gray-600">
              No sermon available for translation. Please ask the Pastor to
              create or upload a sermon first.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Original sermon section */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">
                  Original Sermon
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Title</Label>
                    <div className="p-2 bg-white border border-gray-200 rounded-md text-gray-700">
                      {sermonData.sermonTitle || "No title available"}
                    </div>
                  </div>

                  {sermonData.sermonText && (
                    <div>
                      <Label className="text-sm text-gray-600">Content</Label>
                      <div className="p-2 bg-white border border-gray-200 rounded-md text-gray-700 max-h-48 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {sermonData.sermonText}
                        </pre>
                      </div>
                    </div>
                  )}

                  {sermonData.fileName && (
                    <div>
                      <Label className="text-sm text-gray-600">
                        Uploaded File
                      </Label>
                      <div className="p-2 bg-white border border-gray-200 rounded-md text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        {sermonData.fileName}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Translation section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Translation</h3>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="translatedTitle" className="text-gray-700">
                      Translated Title
                    </Label>
                    <Input
                      id="translatedTitle"
                      name="translatedTitle"
                      value={formValues.translatedTitle}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      placeholder="Enter translated sermon title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="translatedText" className="text-gray-700">
                      Translated Content
                    </Label>
                    <Textarea
                      id="translatedText"
                      name="translatedText"
                      rows={8}
                      value={formValues.translatedText}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      placeholder="Enter translated sermon content"
                    />
                  </div>

                  <div className="mt-4">
                    <Label className="text-gray-700 mb-2 block">
                      Or Upload Translation File
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        formValues.fileUploaded
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300 hover:border-green-300 hover:bg-gray-50"
                      }`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      {formValues.fileUploaded ? (
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-green-500" />
                          <span className="text-green-600 font-medium">
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
                            Drag and drop your file here, or
                          </span>
                          <label className="cursor-pointer text-green-600 hover:text-green-700 font-medium">
                            Browse files
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept=".doc,.docx,.pdf,.txt"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!sermonData}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Translation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
