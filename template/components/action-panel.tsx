import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload, MessageSquare, Send, CheckCircle, Edit } from "lucide-react"

interface ActionPanelProps {
  role: {
    id: string
    name: string
    color: string
  }
  service?: any
}

const roleActions = {
  liturgy: [
    {
      id: "create-concept",
      title: "Create Concept Document",
      icon: FileText,
      description: "Start new liturgy concept",
    },
    { id: "update-document", title: "Update Document", icon: Edit, description: "Apply pastor feedback" },
    { id: "finalize", title: "Create Final Version", icon: CheckCircle, description: "Prepare final document" },
    { id: "send-translation", title: "Send to Translation", icon: Send, description: "Forward to translation team" },
  ],
  pastor: [
    { id: "review", title: "Review Document", icon: FileText, description: "Review liturgy concept" },
    { id: "add-comments", title: "Add Comments", icon: MessageSquare, description: "Provide feedback" },
    { id: "approve", title: "Approve Document", icon: CheckCircle, description: "Approve for next step" },
  ],
  translation: [
    { id: "translate", title: "Translate Document", icon: FileText, description: "Translate liturgy content" },
    {
      id: "upload-translation",
      title: "Upload Translation",
      icon: Upload,
      description: "Upload completed translation",
    },
    { id: "send-beamer", title: "Send to Beamer Team", icon: Send, description: "Forward to beamer team" },
  ],
  beamer: [
    { id: "prepare-slides", title: "Prepare Slides", icon: FileText, description: "Create presentation slides" },
    { id: "upload-slides", title: "Upload Slides", icon: Upload, description: "Upload completed slides" },
    { id: "mark-complete", title: "Mark Complete", icon: CheckCircle, description: "Mark workflow as complete" },
  ],
  music: [
    { id: "review-music", title: "Review Music List", icon: FileText, description: "Review selected music" },
    { id: "prepare-music", title: "Prepare Music", icon: FileText, description: "Prepare musical arrangements" },
    { id: "confirm-ready", title: "Confirm Ready", icon: CheckCircle, description: "Confirm music is ready" },
  ],
}

export function ActionPanel({ role, service }: ActionPanelProps) {
  const actions = roleActions[role.id as keyof typeof roleActions] || []

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${role.color}`} />
        <span className="font-medium">{role.name}</span>
      </div>

      {actions.map((action) => (
        <Card key={action.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <action.icon className="w-5 h-5 mt-0.5 text-gray-600" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{action.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
              </div>
              <Button size="sm" variant="outline">
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-sm text-blue-900 mb-2">Quick Actions</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs bg-transparent">
            <Send className="w-3 h-3 mr-1" />
            Send Email
          </Button>
          <Button size="sm" variant="outline" className="text-xs bg-transparent">
            <FileText className="w-3 h-3 mr-1" />
            View Docs
          </Button>
        </div>
      </div>
    </div>
  )
}
