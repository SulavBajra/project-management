import axios from "axios"
import { Upload } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import api from "@/lib/axios"

export default function ImportExpense({ projectId }: { projectId: number }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async () => {
    if (!file) return toast.error("Please select a file.")
    const formData = new FormData()
    formData.append("file", file)
    formData.append("project_id", String(projectId))
    try {
      setLoading(true)
      await api.post("/api/expenses/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Expenses imported successfully.")
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      setOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Import failed. Please check the file and try again."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4" />
          Add expenses from Excel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Expenses</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="file">Select File</FieldLabel>
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Field>
          <Button onClick={handleImport} disabled={loading || !file}>
            {loading ? "Importing..." : "Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
