'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Upload, 
  FileBox, 
  Search, 
  Filter,
  Grid,
  List,
  File,
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  X,
  Download,
  Trash2,
  Eye,
  Calendar,
  Tag,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react'
import type { Evidence, Case, EvidenceCategory } from '@/lib/types'

const categoryLabels: Record<EvidenceCategory, string> = {
  contract: 'Contract',
  email: 'Email',
  letter: 'Letter',
  policy: 'Policy',
  payslip: 'Payslip',
  medical: 'Medical',
  witness_statement: 'Witness Statement',
  et3_response: 'ET3 Response',
  photo: 'Photo',
  recording: 'Recording',
  other: 'Other'
}

const categoryColors: Record<EvidenceCategory, string> = {
  contract: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  email: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  letter: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  policy: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  payslip: 'bg-green-500/10 text-green-500 border-green-500/20',
  medical: 'bg-red-500/10 text-red-500 border-red-500/20',
  witness_statement: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  et3_response: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  photo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  recording: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  other: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return ImageIcon
  if (fileType.startsWith('video/')) return FileVideo
  if (fileType.startsWith('audio/')) return FileAudio
  if (fileType.includes('pdf')) return FileText
  return File
}

export default function EvidenceVaultPage() {
  const searchParams = useSearchParams()
  const caseId = searchParams.get('case')
  
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EvidenceCategory | 'all'>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadCaseId, setUploadCaseId] = useState(caseId || '')
  const [uploadCategory, setUploadCategory] = useState<EvidenceCategory>('other')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadDate, setUploadDate] = useState('')
  const [uploadIsFavorable, setUploadIsFavorable] = useState<boolean | null>(null)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const [evidenceResult, casesResult] = await Promise.all([
      caseId 
        ? supabase.from('evidence').select('*').eq('user_id', user.id).eq('case_id', caseId).order('created_at', { ascending: false })
        : supabase.from('evidence').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('cases').select('*').eq('user_id', user.id).order('case_name')
    ])

    setEvidence((evidenceResult.data || []) as Evidence[])
    setCases((casesResult.data || []) as Case[])
    setLoading(false)
  }, [caseId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Max 100MB
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB')
        return
      }
      setUploadFile(file)
    }
  }

  const handleUpload = async () => {
    if (!uploadFile || !uploadCaseId) return

    setUploading(true)
    setUploadProgress(0)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setUploading(false)
      return
    }

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    const fileExt = uploadFile.name.split('.').pop()
    const fileName = `${user.id}/${uploadCaseId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(fileName, uploadFile)

    clearInterval(progressInterval)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      setUploading(false)
      return
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('evidence').getPublicUrl(fileName)

    // Create evidence record
    const { error: insertError } = await supabase.from('evidence').insert({
      user_id: user.id,
      case_id: uploadCaseId,
      file_name: uploadFile.name,
      file_type: uploadFile.type,
      file_size: uploadFile.size,
      file_url: urlData.publicUrl,
      storage_path: fileName,
      category: uploadCategory,
      description: uploadDescription || null,
      date_of_document: uploadDate || null,
      is_favorable: uploadIsFavorable
    })

    if (insertError) {
      console.error('Insert error:', insertError)
    }

    setUploadProgress(100)
    
    // Reset and close
    setTimeout(() => {
      setShowUploadModal(false)
      setUploading(false)
      setUploadProgress(0)
      setUploadFile(null)
      setUploadDescription('')
      setUploadDate('')
      setUploadIsFavorable(null)
      loadData()
    }, 500)
  }

  const handleDelete = async (evidenceId: string) => {
    if (!confirm('Are you sure you want to delete this evidence?')) return

    const supabase = createClient()
    await supabase.from('evidence').delete().eq('id', evidenceId)
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evidence Vault</h1>
          <p className="text-muted-foreground mt-1">
            {caseId 
              ? `Evidence for ${cases.find(c => c.id === caseId)?.case_name || 'case'}`
              : 'All your case evidence in one secure place'
            }
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all gold-glow-sm"
        >
          <Upload className="w-5 h-5" />
          Upload Evidence
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as EvidenceCategory | 'all')}
          className="px-4 py-2.5 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 ${viewMode === 'grid' ? 'bg-gold text-black' : 'bg-card text-foreground hover:bg-secondary'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 ${viewMode === 'list' ? 'bg-gold text-black' : 'bg-card text-foreground hover:bg-secondary'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Evidence Grid/List */}
      {filteredEvidence.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border text-center">
          <FileBox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No evidence found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start uploading documents, emails, and other evidence'
            }
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all"
          >
            <Upload className="w-5 h-5" />
            Upload Your First Evidence
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEvidence.map((item) => {
            const FileIcon = getFileIcon(item.file_type)
            return (
              <div key={item.id} className="p-4 rounded-xl bg-card border border-border card-hover group">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <FileIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-medium text-foreground truncate mb-1">{item.file_name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[item.category]}`}>
                    {categoryLabels[item.category]}
                  </span>
                  {item.is_favorable !== null && (
                    item.is_favorable 
                      ? <ThumbsUp className="w-4 h-4 text-success" />
                      : <ThumbsDown className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(item.file_size / 1024).toFixed(1)} KB • {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEvidence.map((item) => {
            const FileIcon = getFileIcon(item.file_type)
            return (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border card-hover group">
                <div className="p-2 rounded-lg bg-secondary">
                  <FileIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{item.file_name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{(item.file_size / 1024).toFixed(1)} KB</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${categoryColors[item.category]}`}>
                  {categoryLabels[item.category]}
                </span>
                {item.is_favorable !== null && (
                  item.is_favorable 
                    ? <ThumbsUp className="w-4 h-4 text-success" />
                    : <ThumbsDown className="w-4 h-4 text-destructive" />
                )}
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !uploading && setShowUploadModal(false)} />
          <div className="relative w-full max-w-lg bg-card rounded-xl border border-border shadow-xl animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Upload Evidence</h2>
              <button
                onClick={() => !uploading && setShowUploadModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* File Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  uploadFile ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'
                }`}
              >
                {uploadFile ? (
                  <div>
                    <FileBox className="w-10 h-10 text-gold mx-auto mb-2" />
                    <p className="font-medium text-foreground">{uploadFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="mt-2 text-sm text-gold hover:text-gold-light"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-foreground mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">Max file size: 100MB</p>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.wav"
                    />
                  </label>
                )}
              </div>

              {/* Case Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Case *</label>
                <select
                  value={uploadCaseId}
                  onChange={(e) => setUploadCaseId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select a case</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>{c.case_name}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category *</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as EvidenceCategory)}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Brief description of this evidence..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                />
              </div>

              {/* Date and Favorable */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Document Date</label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={(e) => setUploadDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Favorable?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadIsFavorable(true)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-colors ${
                        uploadIsFavorable === true 
                          ? 'bg-success/10 border-success/50 text-success' 
                          : 'border-border text-muted-foreground hover:border-success/30'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadIsFavorable(false)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-colors ${
                        uploadIsFavorable === false 
                          ? 'bg-destructive/10 border-destructive/50 text-destructive' 
                          : 'border-border text-muted-foreground hover:border-destructive/30'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className="h-full bg-gold transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFile || !uploadCaseId || uploading}
                className="px-6 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
