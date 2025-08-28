import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, Check, Lock, Shield } from "lucide-react";
import passcodeService from "../services/passcodeService";
import authService from "../services/authService";

export function PasscodeManager() {
  const [passcodes, setPasscodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [updateStatus, setUpdateStatus] = useState({ success: false, message: "" });
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch passcodes on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    if (user && user.role === "treasurer") {
      fetchPasscodes();
    } else {
      setError("You don't have permission to access this page");
      setLoading(false);
    }
  }, []);

  // Fetch passcodes from API
  const fetchPasscodes = async () => {
    try {
      setLoading(true);
      const data = await passcodeService.getAllPasscodes();
      setPasscodes(data);
      setError(null);
    } catch (err) {
      setError("Failed to load passcodes: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Start editing a role's passcode
  const startEditing = (role) => {
    setEditingRole(role);
    setNewPasscode("");
    setConfirmPasscode("");
    setUpdateStatus({ success: false, message: "" });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRole(null);
    setNewPasscode("");
    setConfirmPasscode("");
    setUpdateStatus({ success: false, message: "" });
  };

  // Update a role's passcode
  const updatePasscode = async (role) => {
    // Validate passcodes match
    if (newPasscode !== confirmPasscode) {
      setUpdateStatus({ success: false, message: "Passcodes don't match" });
      return;
    }

    // Validate passcode is not empty
    if (!newPasscode.trim()) {
      setUpdateStatus({ success: false, message: "Passcode cannot be empty" });
      return;
    }

    try {
      await passcodeService.updatePasscode(role, newPasscode);
      setUpdateStatus({ success: true, message: "Passcode updated successfully" });
      
      // Reset form after successful update
      setTimeout(() => {
        setEditingRole(null);
        setNewPasscode("");
        setConfirmPasscode("");
        setUpdateStatus({ success: false, message: "" });
      }, 2000);
    } catch (err) {
      setUpdateStatus({ success: false, message: "Failed to update passcode: " + (err.message || "Unknown error") });
    }
  };

  // If user doesn't have permission
  if (!currentUser || currentUser.role !== "treasurer") {
    return (
      <Card className="border border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-700">
            <Shield className="h-5 w-5" />
            <p>You don't have permission to access this page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="border border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Role Passcode Management
        </CardTitle>
        <CardDescription>
          Update passcodes for different roles in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {passcodes.map((passcode) => (
            <div
              key={passcode.id}
              className="border rounded-md p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium capitalize">{passcode.role}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(passcode.updated_at).toLocaleString()}
                  </p>
                </div>
                {editingRole === passcode.role ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(passcode.role)}
                  >
                    Change Passcode
                  </Button>
                )}
              </div>

              {editingRole === passcode.role && (
                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor={`new-passcode-${passcode.role}`}>New Passcode</Label>
                    <Input
                      id={`new-passcode-${passcode.role}`}
                      type="password"
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Enter new passcode"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`confirm-passcode-${passcode.role}`}>Confirm Passcode</Label>
                    <Input
                      id={`confirm-passcode-${passcode.role}`}
                      type="password"
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Confirm new passcode"
                    />
                  </div>
                  
                  {updateStatus.message && (
                    <div className={`text-sm p-2 rounded-md ${
                      updateStatus.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        {updateStatus.success ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {updateStatus.message}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button
                      onClick={() => updatePasscode(passcode.role)}
                      disabled={!newPasscode || !confirmPasscode}
                    >
                      Update Passcode
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
