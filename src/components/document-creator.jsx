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
  Link as LinkIcon,
  X,
  Check,
  Save,
  ArrowLeft,
  FileCode,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUpcomingSundays } from "../lib/date-utils";

export function DocumentCreator() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("");
  const [upcomingServices, setUpcomingServices] = useState([]);
  const [driveLink, setDriveLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(false);

  // Fetch upcoming services on component mount
  useEffect(() => {
    const services = getUpcomingSundays(6); // Get next 6 Sundays
    setUpcomingServices(services);
    if (services.length > 0) {
      setSelectedService(services[0].dateString);
    }
  }, []);

  // Function to validate Google Drive link
  const validateLink = (link) => {
    return (
      link.includes("drive.google.com") || link.includes("docs.google.com")
    );
  };

  // Function to handle link change
  const handleLinkChange = (e) => {
    const link = e.target.value;
    setDriveLink(link);
    setIsLinkValid(validateLink(link));
  };

  // Function to handle completion
  const handleComplete = () => {
    if (!selectedService) {
      alert("Please select a service date");
      return;
    }

    if (!driveLink.trim() || !isLinkValid) {
      alert("Please enter a valid Google Drive link");
      return;
    }

    setIsSubmitting(true);

    // Get the formatted title for the document
    const selectedServiceObj = upcomingServices.find(
      (service) => service.dateString === selectedService
    );
    const documentTitle = `${
      selectedServiceObj?.title || selectedService
    } - Concept Doc`;

    // Simulate saving the document link
    setTimeout(() => {
      alert(
        "Document link saved successfully! Pastor has been notified for review."
      );
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
          Add Liturgy Document
        </h2>
      </div>

      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 p-3 sm:p-4 md:pb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </div>
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Document Link
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-600">
            Add a link to your liturgy document from Google Drive
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="service-date"
              className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              Service Date
            </label>
            <select
              id="service-date"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {upcomingServices.length === 0 ? (
                <option value="">Loading services...</option>
              ) : (
                upcomingServices.map((service) => (
                  <option key={service.dateString} value={service.dateString}>
                    {service.title} - Concept Doc
                  </option>
                ))
              )}
            </select>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
              Select the service this document is for
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="drive-link"
              className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2"
            >
              <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              Google Drive Link
            </label>
            <input
              id="drive-link"
              type="url"
              className={`w-full p-2 sm:p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                driveLink && !isLinkValid
                  ? "border-red-300 bg-red-50"
                  : driveLink && isLinkValid
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300"
              }`}
              placeholder="https://drive.google.com/file/d/..."
              value={driveLink}
              onChange={handleLinkChange}
            />
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
              Paste the link to your document from Google Drive
            </p>
            {driveLink && !isLinkValid && (
              <p className="text-[10px] sm:text-xs text-red-500">
                Please enter a valid Google Drive link
              </p>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
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
              disabled={isSubmitting || !isLinkValid || !selectedService}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 animate-spin" />
                  <span className="font-medium">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  <span className="font-medium">Save & Continue</span>
                </>
              )}
            </Button>
          </div>

          {driveLink && isLinkValid && (
            <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-green-100 rounded-full">
                    <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-green-800">
                      Valid link detected
                    </h4>
                    <p className="text-xs sm:text-sm text-green-700 mt-0.5 sm:mt-1">
                      Your Google Drive document link is valid
                    </p>
                  </div>
                </div>
                <a
                  href={driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-green-300 rounded-lg text-xs sm:text-sm text-green-700 hover:bg-green-50 transition-colors"
                >
                  <span className="font-medium">Open Document</span>
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 p-2.5 sm:p-4 border-t border-gray-100 text-[10px] sm:text-xs md:text-sm text-gray-600 flex items-center gap-1.5 sm:gap-2">
          <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
          This document link will be associated with the current service
          workflow
        </CardFooter>
      </Card>
    </div>
  );
}
