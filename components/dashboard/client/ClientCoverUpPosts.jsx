import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Edit, PlusCircle, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import CoverUpPostForm from '@/components/dashboard/client/CoverUpPostForm';

const ClientCoverUpPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('cover_up_posts')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching posts', description: error.message });
    } else {
      setPosts(data);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const handleEditClick = (post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    const imagePath = new URL(postToDelete.image_url).pathname.split('/cover-up-photos/')[1];

    const { error: storageError } = await supabase.storage
      .from('cover-up-photos')
      .remove([imagePath]);

    const { error: dbError } = await supabase
      .from('cover_up_posts')
      .delete()
      .match({ id: postToDelete.id });

    if (dbError || storageError) {
      toast({ variant: 'destructive', title: 'Error deleting post', description: dbError?.message || storageError?.message });
    } else {
      toast({ title: 'Post Deleted', description: 'Your cover-up post has been successfully removed.' });
      fetchPosts();
    }

    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };
  
  const handleAddNewClick = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  }

  const onPostSuccess = () => {
    fetchPosts();
    setIsFormOpen(false);
    setEditingPost(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">My <span className="gradient-text">Cover-Up Posts</span></h1>
          <p className="text-muted-foreground font-mono">Manage the photos of tattoos you want covered.</p>
        </div>
        <Button onClick={handleAddNewClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Post
        </Button>
      </div>

      <CoverUpPostForm isOpen={isFormOpen} onClose={() => {setIsFormOpen(false); setEditingPost(null);}} onPostSuccess={onPostSuccess} post={editingPost} />

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
             <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
             <h3 className="text-xl font-semibold mt-4">No Posts Found</h3>
             <p className="text-muted-foreground mt-2">You haven't posted any cover-up photos yet.</p>
             <Button className="mt-4" onClick={handleAddNewClick}>Create Your First Post</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Card key={post.id} className="overflow-hidden art-card">
              <CardHeader className="p-0">
                <img src={post.image_url} alt="Cover-up tattoo" className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground italic truncate">"{post.description || 'No description'}"</p>
                <p className="text-xs text-muted-foreground mt-2">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
                <p className={`text-xs mt-1 font-bold ${post.is_public ? 'text-green-400' : 'text-yellow-400'}`}>
                  {post.is_public ? 'Public' : 'Private'}
                </p>
              </CardContent>
              <CardFooter className="p-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(post)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(post)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your cover-up post and remove the image from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>Delete Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientCoverUpPosts;