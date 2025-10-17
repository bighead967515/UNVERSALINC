import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Upload, X, FileImage as ImageIcon } from 'lucide-react';
import InspirationGallery from '@/components/home/InspirationGallery';

const DreamTattooForm = ({ isOpen, onClose, onPostSuccess, inspirationUrl }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showInspiration, setShowInspiration] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (inspirationUrl) {
        setImagePreview(inspirationUrl);
        setImageFile(null); // Ensure no file is selected
      } else {
        // Reset when opening without inspiration
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [isOpen, inspirationUrl]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image smaller than 5MB.' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setShowInspiration(false);
    }
  };

  const handleInspirationSelect = (imageUrl) => {
    setImagePreview(imageUrl);
    setImageFile(null); // Clear file if inspiration is chosen
    setShowInspiration(false);
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
      toast({ variant: 'destructive', title: 'Please log in', description: 'You need to be logged in to post a dream tattoo.' });
      navigate('/login');
      onClose(); // Close the form when redirecting
      return;
    }

    setLoading(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    let finalImageUrl = imagePreview; 

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tattoo-request-photos')
        .upload(fileName, imageFile);

      if (uploadError) {
        toast({ variant: 'destructive', title: 'Image upload failed', description: uploadError.message });
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('tattoo-request-photos').getPublicUrl(uploadData.path);
      finalImageUrl = publicUrl;
    } else if (imagePreview && !imagePreview.startsWith('blob:')) {
      // If it's an inspiration URL or pre-existing URL, use it directly
      finalImageUrl = imagePreview;
    }


    const { error } = await supabase.from('tattoo_requests').insert({
      client_id: user.id,
      title: formValues.title,
      description: formValues.description,
      body_placement: formValues.placement,
      style_tags: formValues.styles.split(',').map(s => s.trim()).filter(Boolean),
      image_url: finalImageUrl,
      is_public: true,
      status: 'open',
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to post', description: error.message });
    } else {
      toast({ title: 'Success!', description: 'Your dream tattoo has been posted for artists to see.' });
      if (onPostSuccess) onPostSuccess();
    }
    setLoading(false);
  };

  if (showInspiration) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[725px] bg-card border-border p-0">
           <DialogHeader className="p-6 pb-0">
             <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2"><ImageIcon className="w-6 h-6" /> Choose Inspiration</DialogTitle>
             <DialogDescription>Select an image to use as a reference for your dream tattoo.</DialogDescription>
           </DialogHeader>
           <InspirationGallery onSelect={handleInspirationSelect} onBack={() => setShowInspiration(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-card border-border p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2"><Sparkles className="w-6 h-6" /> Post Your Dream Tattoo</DialogTitle>
          <DialogDescription>Describe your ideal tattoo and let artists find you.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[80vh] overflow-y-auto">
          <Input name="title" placeholder="Catchy Title (e.g., 'Cosmic Wolf Sleeve')" required />
          <Textarea name="description" placeholder="Describe your vision in detail. Mention size, colors, and any specific elements." required />
          <Input name="placement" placeholder="Body Placement (e.g., 'Left Forearm')" />
          <Input name="styles" placeholder="Style Tags (e.g., Realism, Blackwork, Neo-Traditional)" />
          
          <div>
            <div 
              className="mt-2 flex justify-center items-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() => imagePreview ? null : fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
                   <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={clearImage}>
                     <X className="h-4 w-4" />
                   </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <Upload className="mx-auto h-8 w-8 mb-2" />
                  <p>Upload a reference image or...</p>
                   <Button type="button" variant="link" className="p-0 h-auto" onClick={(e) => { e.stopPropagation(); setShowInspiration(true); }}>
                    Choose from our gallery
                  </Button>
                </div>
              )}
            </div>
            <Input ref={fileInputRef} name="image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Post Idea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DreamTattooForm;