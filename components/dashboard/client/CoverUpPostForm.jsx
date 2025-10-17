import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

const CoverUpPostForm = ({ isOpen, onClose, onPostSuccess, post }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (post) {
      setDescription(post.description || '');
      setIsPublic(post.is_public);
      setImagePreview(post.image_url);
      setImageFile(null); // Not editing the file itself, just metadata
    } else {
      resetForm();
    }
  }, [post]);

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setDescription('');
    setIsPublic(true);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if(file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image smaller than 5MB.' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to post.' });
      return;
    }
    if (!imageFile && !post) {
      toast({ variant: 'destructive', title: 'Image Required', description: 'Please select an image of the tattoo.' });
      return;
    }

    setLoading(true);

    if (post) { // Editing existing post
        const { error } = await supabase
            .from('cover_up_posts')
            .update({ description, is_public: isPublic })
            .eq('id', post.id);

        if (error) {
            toast({ variant: 'destructive', title: 'Failed to update post', description: error.message });
        } else {
            toast({ title: 'Success!', description: 'Your cover-up post has been updated.' });
            onPostSuccess();
        }
    } else { // Creating new post
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cover-up-photos')
          .upload(filePath, imageFile);

        if (uploadError) {
          toast({ variant: 'destructive', title: 'Image upload failed', description: uploadError.message });
          setLoading(false);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage.from('cover-up-photos').getPublicUrl(filePath);

        const { error: insertError } = await supabase.from('cover_up_posts').insert({
          client_id: user.id,
          description,
          image_url: publicUrl,
          is_public: isPublic,
        });

        if (insertError) {
          toast({ variant: 'destructive', title: 'Failed to create post', description: insertError.message });
        } else {
          toast({ title: 'Success!', description: 'Your cover-up post has been created.' });
          onPostSuccess();
        }
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px] bg-card border-border p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2"><ImageIcon className="w-6 h-6" /> {post ? 'Edit' : 'Post'} a Cover-Up Request</DialogTitle>
          <DialogDescription>{post ? 'Update the details for your cover-up request.' : 'Show artists what you\'re working with. Upload a clear photo of the tattoo you want covered.'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
          <div>
            <Label htmlFor="image-upload">Tattoo Image</Label>
            <div 
              className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() => !post && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} alt="Tattoo preview" className="w-full h-full object-contain rounded-lg p-2" />
                  {!post && (
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={clearImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-8 w-8" />
                  <p>Click to upload an image</p>
                  <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
            <Input ref={fileInputRef} id="image-upload" name="image" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} disabled={!!post} />
            {!!post && <p className="text-xs text-muted-foreground mt-1">To change the image, please delete this post and create a new one.</p>}
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description"
              name="description" 
              placeholder="Tell artists a bit about what you're looking for, any ideas you have, or challenges with the piece." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="isPublic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Make this post public
            </Label>
          </div>
           <p className="text-xs text-muted-foreground -mt-2">If public, artists can see this post in the public Cover-Up Gallery.</p>


          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={loading || (!imageFile && !post)}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {post ? 'Save Changes' : 'Create Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CoverUpPostForm;