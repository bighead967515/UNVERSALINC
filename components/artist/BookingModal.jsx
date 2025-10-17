import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Loader2, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

const BookingModal = ({ isOpen, onClose, artist }) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCoverUp, setIsCoverUp] = useState(false);
  const [coverUpImage, setCoverUpImage] = useState(null);
  const [coverUpPreview, setCoverUpPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverUpImage(file);
      setCoverUpPreview(URL.createObjectURL(file));
    }
  };

  const uploadCoverUpImage = async () => {
    if (!coverUpImage) return null;

    const fileExt = coverUpImage.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('cover-up-photos')
      .upload(filePath, coverUpImage);

    if (error) {
      console.error('Error uploading cover-up image:', error);
      toast({
        variant: "destructive",
        title: "Image Upload Failed",
        description: "Could not upload your cover-up photo. Please try again.",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('cover-up-photos')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to book an appointment. Please sign up or log in.",
      });
      setLoading(false);
      return;
    }

    let existingTattooUrl = null;
    if (isCoverUp && coverUpImage) {
      existingTattooUrl = await uploadCoverUpImage();
      if (!existingTattooUrl) {
        setLoading(false);
        return;
      }
    }

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    const { error } = await supabase
      .from('bookings')
      .insert([
        { 
          artist_id: artist.id,
          client_id: user.id,
          tattoo_style: formValues.style,
          tattoo_description: formValues.description,
          booking_date: date,
          is_cover_up: isCoverUp,
          existing_tattoo_url: existingTattooUrl,
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Error creating booking:', error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Could not submit your booking request. Please try again.",
      });
    } else {
      toast({
        title: "✅ Booking Request Sent!",
        description: "The artist has received your request and will get back to you soon to confirm.",
      });
      e.target.reset();
      setDate(null);
      setIsCoverUp(false);
      setCoverUpImage(null);
      setCoverUpPreview(null);
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-card border-border p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold gradient-text">Book with {artist.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill out the form below to request an appointment. Your name and email will be sent from your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="style">Desired Tattoo Style</Label>
            <Input id="style" name="style" placeholder="e.g., Neo-Traditional, Realism" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Brief Description</Label>
            <Textarea id="description" name="description" placeholder="Describe your tattoo idea, placement, and size." required />
          </div>
          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(day) => day < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="is_cover_up" checked={isCoverUp} onCheckedChange={setIsCoverUp} />
              <Label htmlFor="is_cover_up" className="font-semibold text-base">Is this a cover-up?</Label>
            </div>

            {isCoverUp && (
              <div>
                <Label>Photo of Existing Tattoo</Label>
                <div 
                  className="mt-2 flex justify-center items-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {coverUpPreview ? (
                    <div className="relative w-full h-full">
                      <img src={coverUpPreview} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
                       <Button 
                         type="button" 
                         variant="destructive" 
                         size="icon" 
                         className="absolute top-1 right-1 h-7 w-7"
                         onClick={(e) => { 
                            e.stopPropagation();
                            setCoverUpImage(null); 
                            setCoverUpPreview(null);
                            if(fileInputRef.current) fileInputRef.current.value = "";
                          }}
                       >
                         <X className="h-4 w-4" />
                       </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload className="mx-auto h-8 w-8" />
                      <p>Click to upload a photo</p>
                      <p className="text-xs">PNG, JPG, or GIF up to 10MB</p>
                    </div>
                  )}
                </div>
                <Input 
                  ref={fileInputRef} 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {loading ? 'Submitting...' : 'Request Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;