
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, PenTool, Loader2, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const tattooSchema = z.object({
  image: z.any().refine(files => files?.length > 0, 'Image is required.'),
  artist_name: z.string().optional(),
  shop_name: z.string().optional(),
  tattoo_date: z.date().optional(),
  notes: z.string().optional(),
});

const ClientPastTattoos = () => {
  const [tattoos, setTattoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(tattooSchema),
  });

  const fetchTattoos = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('past_tattoos')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching tattoos', description: error.message });
    } else {
      setTattoos(data);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchTattoos();
  }, [fetchTattoos]);

  const onSubmit = async (formData) => {
    if (!user) return;
    setIsSubmitting(true);

    const file = formData.image[0];
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('past-tattoos')
      .upload(filePath, file);

    if (uploadError) {
      toast({ variant: 'destructive', title: 'Image upload failed', description: uploadError.message });
      setIsSubmitting(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('past-tattoos').getPublicUrl(uploadData.path);

    const { error: insertError } = await supabase.from('past_tattoos').insert({
      client_id: user.id,
      image_url: urlData.publicUrl,
      artist_name: formData.artist_name,
      shop_name: formData.shop_name,
      tattoo_date: formData.tattoo_date,
      notes: formData.notes,
    });

    if (insertError) {
      toast({ variant: 'destructive', title: 'Failed to save tattoo', description: insertError.message });
    } else {
      toast({ title: 'Success!', description: 'Your tattoo has been added to your gallery.' });
      reset();
      setIsDialogOpen(false);
      fetchTattoos();
    }
    setIsSubmitting(false);
  };

  const deleteTattoo = async (tattooId, imageUrl) => {
    const { error } = await supabase.from('past_tattoos').delete().eq('id', tattooId);
    if (error) {
      toast({ variant: 'destructive', title: 'Failed to delete tattoo', description: error.message });
    } else {
      const path = new URL(imageUrl).pathname.split('/past-tattoos/')[1];
      await supabase.storage.from('past-tattoos').remove([path]);
      toast({ title: 'Tattoo deleted.' });
      fetchTattoos();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">Your <span className="gradient-text">Ink</span></h1>
          <p className="text-muted-foreground font-mono">A personal gallery of your tattoo journey.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Tattoo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Your Ink Gallery</DialogTitle>
              <DialogDescription>
                Keep a record of your personal tattoos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div>
                <Label htmlFor="image">Tattoo Photo</Label>
                <Input id="image" type="file" {...register('image')} accept="image/*" />
                {errors.image && <p className="text-destructive text-sm mt-1">{errors.image.message}</p>}
              </div>
              <div>
                <Label htmlFor="artist_name">Artist Name</Label>
                <Input id="artist_name" {...register('artist_name')} placeholder="e.g., Jane Doe" />
              </div>
              <div>
                <Label htmlFor="shop_name">Shop Name</Label>
                <Input id="shop_name" {...register('shop_name')} placeholder="e.g., Inked Up" />
              </div>
              <div>
                <Controller
                  name="tattoo_date"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...register('notes')} placeholder="Any story or details about this piece?" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Tattoo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : tattoos.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <PenTool className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold mt-4">Your Gallery Awaits</h3>
            <p className="text-muted-foreground mt-2">You haven't added any tattoos yet. Click the button to add your first one!</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Add a Tattoo</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tattoos.map((tattoo) => (
            <Card key={tattoo.id} className="overflow-hidden group">
              <CardHeader className="p-0">
                <div className="aspect-square relative">
                  <img src={tattoo.image_url} alt="Past tattoo" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => deleteTattoo(tattoo.id, tattoo.image_url)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {tattoo.artist_name && <CardTitle className="text-lg">{tattoo.artist_name}</CardTitle>}
                {tattoo.shop_name && <CardDescription>{tattoo.shop_name}</CardDescription>}
                {tattoo.tattoo_date && <p className="text-sm text-muted-foreground mt-2">{format(new Date(tattoo.tattoo_date), 'MMMM d, yyyy')}</p>}
                {tattoo.notes && <p className="text-sm mt-2">{tattoo.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientPastTattoos;
