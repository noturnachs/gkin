import { useState, useEffect } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Globe, Save, Check, X, AlertCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export function TranslationForm({ lyric, onClose, canTranslate, canApprove }) {
  const { submitTranslation, approveTranslation } = useTranslation();

  const [translatedTitle, setTranslatedTitle] = useState("");
  const [translatedLyrics, setTranslatedLyrics] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Initialize form with existing translation if available
  useEffect(() => {
    if (lyric?.translation) {
      setTranslatedTitle(lyric.translation.translated_title || "");
      setTranslatedLyrics(lyric.translation.translated_lyrics || "");
    } else {
      setTranslatedTitle("");
      setTranslatedLyrics("");
    }
  }, [lyric]);

  // Handle translation submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!translatedTitle.trim() || !translatedLyrics.trim()) {
      toast.error("Please provide both title and lyrics translations");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitTranslation(
        lyric.id,
        translatedTitle.trim(),
        translatedLyrics.trim()
      );

      // Success is handled in the context
    } catch (error) {
      // Error is handled in the context
      console.error("Error in translation submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle translation approval
  const handleApprove = async () => {
    if (!lyric.translation || !lyric.translation.id) {
      toast.error("No translation available to approve");
      return;
    }

    setIsApproving(true);

    try {
      await approveTranslation(lyric.translation.id, lyric.id);

      // Success is handled in the context
    } catch (error) {
      // Error is handled in the context
      console.error("Error in translation approval:", error);
    } finally {
      setIsApproving(false);
    }
  };

  // Determine if form is editable
  const isEditable =
    canTranslate &&
    (!lyric.translation || lyric.translation.status !== "approved");

  // Determine if translation can be approved
  const showApproveButton =
    canApprove && lyric.translation && lyric.translation.status === "completed";

  // Get status badge
  const getStatusBadge = () => {
    if (!lyric.translation) {
      return (
        <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
          <Clock className="h-4 w-4 mr-1" />
          Pending Translation
        </div>
      );
    }

    switch (lyric.translation.status) {
      case "completed":
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
            <Check className="h-4 w-4 mr-1" />
            Translated
          </div>
        );
      case "approved":
        return (
          <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
            <Check className="h-4 w-4 mr-1" />
            Approved
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            Needs Revision
          </div>
        );
      default:
        return (
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-1" />
            In Progress
          </div>
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
        <div className="flex items-center">
          <Globe className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-800">
            Translate Lyrics
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left column - Original */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 flex items-center">
              Original Lyrics
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="original-title" className="text-gray-600">
                  Song Title
                </Label>
                <div className="mt-1 p-2 border border-gray-200 rounded-md bg-gray-50">
                  {lyric.title}
                </div>
              </div>

              <div>
                <Label htmlFor="original-lyrics" className="text-gray-600">
                  Lyrics
                </Label>
                <div className="mt-1 p-2 border border-gray-200 rounded-md bg-gray-50 min-h-[300px] whitespace-pre-line">
                  {lyric.lyrics}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Translation */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 flex items-center">
              Translation
              {lyric.translation?.translated_by && (
                <span className="ml-2 text-xs text-gray-500 font-normal">
                  by {lyric.translation.translated_by.name}
                </span>
              )}
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="translated-title" className="text-gray-600">
                  Translated Title
                </Label>
                <Input
                  id="translated-title"
                  value={translatedTitle}
                  onChange={(e) => setTranslatedTitle(e.target.value)}
                  className="mt-1"
                  placeholder="Enter translated title"
                  disabled={!isEditable}
                />
              </div>

              <div>
                <Label htmlFor="translated-lyrics" className="text-gray-600">
                  Translated Lyrics
                </Label>
                <Textarea
                  id="translated-lyrics"
                  value={translatedLyrics}
                  onChange={(e) => setTranslatedLyrics(e.target.value)}
                  className="mt-1 min-h-[300px]"
                  placeholder="Enter translated lyrics"
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          {isEditable && (
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Translation
                </>
              )}
            </Button>
          )}

          {showApproveButton && (
            <Button
              type="button"
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Approve Translation
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
