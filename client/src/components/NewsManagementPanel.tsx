
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';
import type { NewsArticle, InsertNewsArticle } from '@shared/schema';

interface NewsManagementPanelProps {
  className?: string;
}

export default function NewsManagementPanel({ className }: NewsManagementPanelProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState<Partial<InsertNewsArticle>>({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    source: 'Admin',
    sourceUrl: '',
    publishedAt: new Date()
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
    fetchAnalytics();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch news articles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/news/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'News article created successfully'
        });
        setIsCreateDialogOpen(false);
        resetForm();
        fetchArticles();
        fetchAnalytics();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to create news article',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedArticle) return;

    try {
      const response = await fetch(`/api/news/${selectedArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'News article updated successfully'
        });
        setIsEditDialogOpen(false);
        resetForm();
        fetchArticles();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to update news article',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/news/${articleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'News article deleted successfully'
        });
        fetchArticles();
        fetchAnalytics();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete news article',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      source: 'Admin',
      sourceUrl: '',
      publishedAt: new Date()
    });
    setSelectedArticle(null);
  };

  const openEditDialog = (article: NewsArticle) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content || '',
      excerpt: article.excerpt || '',
      imageUrl: article.imageUrl || '',
      source: article.source,
      sourceUrl: article.sourceUrl || '',
      publishedAt: article.publishedAt
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            News Management
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create News Article</DialogTitle>
                  <DialogDescription>
                    Create a new news article for the platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Article title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Article content"
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="News source"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Create Article</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage news articles and platform updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Total Articles</p>
                      <p className="text-2xl font-bold">{analytics.totalArticles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div className="ml-2">
                      <p className="text-sm font-medium">This Week</p>
                      <p className="text-2xl font-bold">{analytics.recentArticles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Sources</p>
                      <p className="text-2xl font-bold">{analytics.articlesBySource?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Articles List */}
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{article.source}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(article)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit News Article</DialogTitle>
            <DialogDescription>
              Update the news article details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Article title"
              />
            </div>
            <div>
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Textarea
                id="edit-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Article content"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="edit-imageUrl">Image URL</Label>
              <Input
                id="edit-imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="edit-source">Source</Label>
              <Input
                id="edit-source"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="News source"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
