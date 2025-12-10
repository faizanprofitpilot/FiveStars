'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'
import { Trash2, Plus, Key } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  last_used_at: string | null
  created_at: string
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKey, setNewKey] = useState<string | null>(null)
  const [showNewKey, setShowNewKey] = useState(false)

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const data = await response.json()
        setKeys(data.keys || [])
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const createKey = async () => {
    if (!newKeyName.trim()) return

    setCreating(true)
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewKey(data.key)
        setShowNewKey(true)
        setNewKeyName('')
        fetchKeys()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create API key')
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      alert('Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const deleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchKeys()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete API key')
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      alert('Failed to delete API key')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading API keys...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Manage API keys for Zapier and other integrations. Keep your keys secure and never share them publicly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Key Creation */}
        <div className="space-y-4 border-b pb-6">
          <div className="space-y-2">
            <Label htmlFor="key-name">Create New API Key</Label>
            <div className="flex gap-2">
              <Input
                id="key-name"
                placeholder="e.g., Zapier Integration"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                disabled={creating}
              />
              <Button onClick={createKey} disabled={creating || !newKeyName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          {/* Show new key once (user must copy it) */}
          {showNewKey && newKey && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <Key className="h-5 w-5" />
                <span>Important: Copy your API key now. You won't be able to see it again!</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newKey}
                  readOnly
                  className="font-mono text-sm bg-white"
                />
                <CopyToClipboard text={newKey} />
              </div>
              <p className="text-xs text-amber-800">
                Store this key securely. It will be used to authenticate requests from Zapier.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowNewKey(false)
                  setNewKey(null)
                }}
              >
                I've copied it
              </Button>
            </div>
          )}
        </div>

        {/* Existing Keys */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Existing API Keys</h3>
          {keys.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No API keys yet. Create one above to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{key.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <p>Created: {formatDate(key.created_at)}</p>
                      <p>Last used: {formatDate(key.last_used_at)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteKey(key.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

