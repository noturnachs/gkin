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
import { Book, X, Save, Loader2, Calendar } from "lucide-react";
import { getUpcomingSundays } from "../lib/date-utils";

export function SermonCreatorModal({ isOpen, onClose, onSubmit }) {
  const [selectedService, setSelectedService] = useState("");
  const [upcomingServices, setUpcomingServices] = useState([]);
  const [sermonText, setSermonText] = useState("");
  const [sermonTitle, setSermonTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch upcoming services on component mount
  useEffect(() => {
    const services = getUpcomingSundays(6); // Get next 6 Sundays
    setUpcomingServices(services);
    if (services.length > 0) {
      setSelectedService(services[0].dateString);
    }
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSermonText("");
      setSermonTitle("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Function to handle completion
  const handleComplete = () => {
    if (!selectedService) {
      alert("Please select a service date");
      return;
    }

    if (!sermonTitle.trim()) {
      alert("Please enter a sermon title");
      return;
    }

    if (!sermonText.trim()) {
      alert("Please enter sermon text");
      return;
    }

    setIsSubmitting(true);

    // Get the formatted title for the document
    const selectedServiceObj = upcomingServices.find(
      (service) => service.dateString === selectedService
    );

    // Submit the data to parent component
    setTimeout(() => {
      onSubmit({
        serviceDate: selectedService,
        sermonTitle,
        sermonText,
        documentType: "sermon",
        documentTitle: `${
          selectedServiceObj?.title || selectedService
        } - Sermon`,
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white p-3 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold text-gray-900">Add Sermon Text</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-gray-100 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-full">
                  <Book className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
                  Sermon Content
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-gray-600">
                Enter the sermon title and text for the upcoming service
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-3 sm:p-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="service-date"
                  className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  Service Date
                </label>
                <select
                  id="service-date"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  {upcomingServices.length === 0 ? (
                    <option value="">Loading services...</option>
                  ) : (
                    upcomingServices.map((service) => (
                      <option
                        key={service.dateString}
                        value={service.dateString}
                      >
                        {service.title}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  Select the service this sermon is for
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="sermon-title"
                  className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5"
                >
                  <Book className="w-3.5 h-3.5 text-gray-500" />
                  Sermon Title
                </label>
                <input
                  id="sermon-title"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Enter sermon title"
                  value={sermonTitle}
                  onChange={(e) => setSermonTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="sermon-text"
                  className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5"
                >
                  <Book className="w-3.5 h-3.5 text-gray-500" />
                  Sermon Text
                </label>
                <textarea
                  id="sermon-text"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all min-h-[200px]"
                  placeholder="Enter the sermon text here..."
                  value={sermonText}
                  onChange={(e) => setSermonText(e.target.value)}
                ></textarea>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  Enter the full sermon text or outline that will be used in the
                  service
                </p>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 p-2.5 border-t border-gray-100 text-[10px] sm:text-xs text-gray-600 flex items-center gap-1.5 justify-between">
              <div className="flex items-center gap-1.5">
                <Book className="w-3.5 h-3.5 text-gray-500" />
                <span>This sermon will be linked to the service workflow</span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleComplete}
                  className="h-8 flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                  disabled={
                    isSubmitting ||
                    !sermonTitle ||
                    !sermonText ||
                    !selectedService
                  }
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Sermon</span>
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
