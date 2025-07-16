import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, X, Music, Save } from "lucide-react";

export function LyricsInputModal({ isOpen, onClose, onSubmit, initialData }) {
  const [songs, setSongs] = useState([]);

  // Reset form when modal opens with initial data
  useEffect(() => {
    if (isOpen) {
      setSongs(initialData?.songs || [{ title: "", lyrics: "" }]);
    }
  }, [isOpen, initialData]);

  // Handle song changes
  const handleSongChange = (index, field, value) => {
    const updatedSongs = [...songs];
    updatedSongs[index][field] = value;
    setSongs(updatedSongs);
  };

  // Add a new song
  const handleAddSong = () => {
    setSongs([...songs, { title: "", lyrics: "" }]);
  };

  // Remove a song
  const handleRemoveSong = (index) => {
    const updatedSongs = [...songs];
    updatedSongs.splice(index, 1);
    setSongs(updatedSongs);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out empty songs
    const validSongs = songs.filter(
      (song) => song.title.trim() || song.lyrics.trim()
    );

    if (validSongs.length === 0) {
      alert("Please add at least one song with title or lyrics");
      return;
    }

    onSubmit({
      songs: validSongs,
      timestamp: new Date().toISOString(),
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
            <Music className="w-5 h-5 text-blue-600" />
            Song Lyrics Input
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Add songs and lyrics that will need translation
              </p>
              <Button
                type="button"
                onClick={handleAddSong}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Song
              </Button>
            </div>

            {songs.map((song, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">
                    Song {index + 1}
                  </h3>
                  {songs.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveSong(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 p-1 h-auto"
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor={`song-title-${index}`}
                      className="text-gray-700"
                    >
                      Song Title
                    </Label>
                    <Input
                      id={`song-title-${index}`}
                      value={song.title}
                      onChange={(e) =>
                        handleSongChange(index, "title", e.target.value)
                      }
                      className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      placeholder="Enter song title"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor={`song-lyrics-${index}`}
                      className="text-gray-700"
                    >
                      Lyrics
                    </Label>
                    <Textarea
                      id={`song-lyrics-${index}`}
                      rows={6}
                      value={song.lyrics}
                      onChange={(e) =>
                        handleSongChange(index, "lyrics", e.target.value)
                      }
                      className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      placeholder="Enter song lyrics"
                    />
                  </div>
                </div>
              </div>
            ))}
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Lyrics
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
