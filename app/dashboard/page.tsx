"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Eye, Copy, Trash2, MoreVertical, Share } from 'lucide-react'
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFormsList, useDeleteForm, useDuplicateForm } from "@/hooks/use-forms"
import { ShareFormModal } from "@/components/share-form-modal"
import { useState } from "react"

export default function DashboardPage() {
  const { data: forms = [], isLoading } = useFormsList()
  const deleteFormMutation = useDeleteForm()
  const duplicateFormMutation = useDuplicateForm()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState<{ id: string; title: string } | null>(null)

  const handleDelete = (id: string) => {
    deleteFormMutation.mutate(id)
  }

  const handleDuplicate = (id: string) => {
    duplicateFormMutation.mutate(id)
  }

  const handleShare = (id: string, title: string) => {
    setSelectedForm({ id, title })
    setShareModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card/50 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FormFlow</h1>
          <Link href="/builder/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-12">
              <Plus className="w-4 h-4 mr-2" />
              New Form
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">Your Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {forms.map((form, index) => (
                  <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 hover:bg-accent/50 transition-all group h-full flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <h3 className="text-xl font-semibold">{form.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{form.description}</p>

                        <div className="flex items-center justify-between text-sm mb-4 pt-4 border-t border-border">
                          <span className="text-muted-foreground">Responses</span>
                          <span className="font-semibold">{form.responses}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/builder/${form.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full min-h-10"
                          >
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/analytics/${form.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 min-h-10"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="min-h-10 min-w-10"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-popover border-border">
                            <DropdownMenuItem
                              onClick={() => handleShare(form.id, form.title)}
                              className="focus:bg-accent"
                            >
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(form.id)}
                              className="focus:bg-accent"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(form.id)}
                              className="text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="text-xs text-muted-foreground mt-4">
                        Updated {new Date(form.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Link href="/builder/new">
                    <div className="bg-card backdrop-blur-xl border border-border border-dashed rounded-2xl p-6 hover:bg-accent/50 transition-all cursor-pointer h-full min-h-[240px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                          <Plus className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Create New Form</h3>
                        <p className="text-sm text-muted-foreground">Start building your next form</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </main>

      {selectedForm && (
        <ShareFormModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          formId={selectedForm.id}
          formTitle={selectedForm.title}
        />
      )}
    </div>
  )
}
