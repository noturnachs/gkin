import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, Upload, File, X, Check, Edit, Save, ArrowLeft, FileCode, ExternalLink, Loader2 } from "lucide-react";

export function DocumentCreator({ onComplete, currentService }) {
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
  const handleComplete = () => {
    setIsSubmitting(true);
    
    // Simulate saving the document link
    setTimeout(() => {
      onComplete && onComplete({
        title: documentTitle,
        link: googleDocLink,
        date: new Date().toISOString()
      });
      setIsSubmitting(false);
    }, 1000);
  };

  // Function to handle cancel
  const handleCancel = () => {
    onComplete && onComplete(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2 text-gray-600 hover:text-gray-900"
          onClick={handleCancel}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Create Liturgy Concept</h2>
      </div>
      
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">New Document</CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            Create a new Google Doc for the liturgy concept that can be shared with the team
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="doc-title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Edit className="w-4 h-4 text-gray-500" />
              Document Title
            </label>
            <input
              id="doc-title"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Sunday Service - January 7, 2024"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be the title of your Google Doc
            </p>
          </div>
          
          {!googleDocLink ? (
            <Button 
              onClick={createGoogleDoc} 
              className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              disabled={isCreatingDoc}
            >
              {isCreatingDoc ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Creating Google Doc...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Create Google Doc</span>
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">Google Doc created!</h4>
                      <p className="text-sm text-green-700 mt-1">Your document is ready to edit</p>
                    </div>
                  </div>
                  <a 
                    href={googleDocLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
                  >
                    <span className="font-medium">Open Doc</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleCancel}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                  <span className="font-medium">Cancel</span>
                </Button>
                
                <Button 
                  onClick={handleComplete} 
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-medium">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span className="font-medium">Save and Continue</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-4 border-t border-gray-100 text-sm text-gray-600 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-gray-500" />
          This document will be linked to the current service workflow
        </CardFooter>
      </Card>
    </div>
  );
} 