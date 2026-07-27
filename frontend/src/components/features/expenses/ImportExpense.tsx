import axios from "axios"
import { Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { useImportStatus } from "@/hooks/useImportStatus"

export default function ImportExpense({ projectId }: { projectId: number }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [importId, setImportId] = useState<number | null>(null)
  const {data: importStatus} = useImportStatus(importId)

  useEffect(() => {
      if (!importStatus) return

      if (importStatus.status === "completed") {
        toast.success(
          `Import complete — ${importStatus.rows_processed} expense(s) imported.`
        )
        setImportId(null)
        setOpen(false)
        navigate(`/projects/${projectId}/expenses`)
      }

      if (importStatus.status === "failed") {
        toast.error(importStatus.error_message ?? "Import failed.")
        setImportId(null)
      }
    }, [importStatus, navigate, projectId])

  const handleImport = async () => {
    if (!file) return toast.error("Please select a file.")
    const formData = new FormData()
    formData.append("file", file)
    formData.append("project_id", String(projectId))
    try {
      setLoading(true)
      const response = await api.post("/api/expenses/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      setImportId(response.data.import_id)
      toast.info("File uploaded — processing expenses...")
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
      <DialogContent className="w-3/8">
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
