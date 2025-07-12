import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  FileText,
  Upload,
  File,
  X,
  Check,
  Edit,
  Save,
  ArrowLeft,
  FileCode,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DocumentCreator() {
  const navigate = useNavigate();
  const [documentTitle, setDocumentTitle] = useState("");
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [googleDocLink, setGoogleDocLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to simulate creating a Google Doc
  const createGoogleDoc = () => {
    if (!documentTitle.trim()) {
      alert("Please enter a document title");
      return;
    }

    setIsCreatingDoc(true);

    // Simulate API call to create Google Doc
    setTimeout(() => {
      // In a real app, this would be an actual Google Docs API call
      const mockDocId = Math.random().toString(36).substring(2, 15);
      const newDocLink = `https://docs.google.com/document/d/${mockDocId}/edit`;
      setGoogleDocLink(newDocLink);
      setIsCreatingDoc(false);
    }, 1500);
  };

  // Function to handle completion
  const handleComplete = (documentData) => {
    setIsSubmitting(true);

    // Simulate saving the document link
    setTimeout(() => {
      if (documentData) {
        // Update the current service with the new document
        // In a real app, you would use an API call or context
        // For now, we'll just navigate back
        alert(
          "Document created successfully! Pastor has been notified for review."
        );
      }
      navigate("/");
    }, 1000);
  };

  // Function to handle cancel
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4">
      <div className="flex items-center mb-3 sm:mb-6">
        <Button
          variant="ghost"
          className="mr-1 sm:mr-2 text-gray-600 hover:text-gray-900 p-1 sm:p-2 h-auto"
          onClick={handleCancel}
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Back</span>
        </Button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          Create Liturgy Concept
        </h2>
      </div>

      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 p-3 sm:p-4 md:pb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </div>
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              New Document
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-600">
            Create a new Google Doc for the liturgy concept that can be shared
            with the team
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="doc-title"
              className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2"
            >
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              Document Title
            </label>
            <input
              id="doc-title"
              type="text"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Sunday Service - January 7, 2024"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
            />
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
              This will be the title of your Google Doc
            </p>
          </div>

          {!googleDocLink ? (
            <Button
              onClick={createGoogleDoc}
              className="w-full h-10 sm:h-12 flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
              disabled={isCreatingDoc}
            >
              {isCreatingDoc ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="font-medium">Creating Google Doc...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Create Google Doc</span>
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-green-100 rounded-full">
                      <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-medium text-green-800">
                        Google Doc created!
                      </h4>
                      <p className="text-xs sm:text-sm text-green-700 mt-0.5 sm:mt-1">
                        Your document is ready to edit
                      </p>
                    </div>
                  </div>
                  <a
                    href={googleDocLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-green-300 rounded-lg text-xs sm:text-sm text-green-700 hover:bg-green-50 transition-colors"
                  >
                    <span className="font-medium">Open Doc</span>
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={handleCancel}
                  className="flex-1 h-9 sm:h-10 md:h-12 flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs sm:text-sm"
                  disabled={isSubmitting}
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-medium">Cancel</span>
                </Button>

                <Button
                  onClick={handleComplete}
                  className="flex-1 h-9 sm:h-10 md:h-12 flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 animate-spin" />
                      <span className="font-medium">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      <span className="font-medium">Save & Continue</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 p-2.5 sm:p-4 border-t border-gray-100 text-[10px] sm:text-xs md:text-sm text-gray-600 flex items-center gap-1.5 sm:gap-2">
          <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
          This document will be linked to the current service workflow
        </CardFooter>
      </Card>
    </div>
  );
}
