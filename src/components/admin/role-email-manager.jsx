import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Mail,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Shield,
  FileText,
  BookOpen,
  Users,
  Video,
  Music,
  DollarSign,
} from "lucide-react";
import {
  getAllRoleEmails,
  updateMultipleRoleEmails,
} from "../../services/roleEmailsService";

const roleConfigs = {
  liturgy: {
    name: "Liturgy Maker",
    icon: FileText,
    color: "bg-blue-500",
    textColor: "text-blue-700",
  },
  translation: {
    name: "Translator",
    icon: Users,
    color: "bg-green-500",
    textColor: "text-green-700",
  },
  beamer: {
    name: "Beamer Team",
    icon: Video,
    color: "bg-orange-500",
    textColor: "text-orange-700",
  },
  music: {
    name: "Musicians",
    icon: Music,
    color: "bg-pink-500",
    textColor: "text-pink-700",
  },
  treasurer: {
    name: "Treasurer",
    icon: DollarSign,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
  },
  admin: {
    name: "Administrator",
    icon: Shield,
    color: "bg-indigo-500",
    textColor: "text-indigo-700",
  },
};

export const RoleEmailManager = () => {
  const [roleEmails, setRoleEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editedEmails, setEditedEmails] = useState({});

  useEffect(() => {
    fetchRoleEmails();
  }, []);

  const fetchRoleEmails = async () => {
    try {
      setIsLoading(true);
      const data = await getAllRoleEmails();
      setRoleEmails(data);

      // Initialize edited emails state
      const emails = {};
      data.forEach((item) => {
        emails[item.role] = item.email || "";
      });
      setEditedEmails(emails);
    } catch (error) {
      console.error("Error fetching role emails:", error);
      setMessage({
        type: "error",
        text: "Failed to load role emails",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (role, email) => {
    setEditedEmails((prev) => ({
      ...prev,
      [role]: email,
    }));

    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSave = async () => {
    // Validate all emails
    for (const [role, email] of Object.entries(editedEmails)) {
      if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage({
          type: "error",
          text: `Invalid email format for ${roleConfigs[role]?.name || role}`,
        });
        return;
      }
    }

    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data for batch update
      const roleEmailsData = Object.entries(editedEmails).map(
        ([role, email]) => ({
          role,
          email: email || "",
        })
      );

      await updateMultipleRoleEmails(roleEmailsData);

      setMessage({
        type: "success",
        text: "Role emails updated successfully!",
      });

      // Refresh data
      await fetchRoleEmails();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating role emails:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update role emails",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const emails = {};
    roleEmails.forEach((item) => {
      emails[item.role] = item.email || "";
    });
    setEditedEmails(emails);
    setMessage({ type: "", text: "" });
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="pt-12">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <span className="text-lg font-medium text-gray-700">
              Loading role emails...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Mail className="w-6 h-6 text-gray-600" />
          Role Email Management
        </CardTitle>
        <CardDescription>
          Set email addresses for each role. All users in a role will share the
          same email for notifications. (Pastor emails are set per service
          assignment)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Message display */}
        {message.text && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg shadow-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-6 h-6 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Role Email Inputs */}
        <div className="space-y-4">
          {Object.entries(roleConfigs).map(([roleId, config]) => {
            const Icon = config.icon;
            return (
              <div key={roleId} className="space-y-2">
                <label
                  htmlFor={`email-${roleId}`}
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center shadow-sm`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  {config.name}
                </label>
                <input
                  type="email"
                  id={`email-${roleId}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white shadow-sm transition-all duration-200"
                  placeholder={`Enter email for ${config.name} role`}
                  value={editedEmails[roleId] || ""}
                  onChange={(e) => handleEmailChange(roleId, e.target.value)}
                />
              </div>
            );
          })}
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900 mb-1">Important</p>
              <p>
                Each role shares a single email address. When you update a
                role's email, it will be used for all users in that role. Leave
                blank if no email notifications are needed for a particular
                role.
              </p>
              <p className="mt-2">
                <strong>Note:</strong> Pastor (Voorganger) emails are managed
                through Service Assignments, as different pastors are assigned
                per service date.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save All Changes</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
            className="px-8 h-12 rounded-lg border-gray-300 hover:bg-gray-50 font-medium"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
