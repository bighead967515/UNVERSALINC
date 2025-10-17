import React, { useState, useEffect, useCallback } from 'react';
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import * as z from 'zod';
    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Upload, PlusCircle, Trash2, Loader2, Edit, X, Image as Images } from 'lucide-react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
    import { motion, AnimatePresence } from 'framer-motion';

    const tattooStyles = [
      'Cover-Up', 'Neo-Traditional', 'Blackwork', 'Watercolor', 'Realism', 'Traditional', 
      'Japanese', 'Minimalist', 'Dotwork', 'Tribal', 'Geometric', 'Biomechanical', 'Glitch Art', 'Holographic'
    ];

    const portfolioSchema = z.object({
      title: z.string().min(3, 'Title must be at least 3 characters.'),
      category: z.string().min(1, 'Please select a style.'),
      description: z.string().optional(),
      image: z.any().refine(files => files?.length > 0, 'Image is required.'),
    });

    const editPortfolioSchema = z.object({
        title: z.string().min(3, 'Title must be at least 3 characters.'),
        category: z.string().min(1, 'Please select a style.'),
        description: z.string().optional(),
    });

    const PortfolioForm = ({ onFormSubmit, submitting }) => {
      const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(portfolioSchema),
      });

      const onSubmit = (data) => {
        onFormSubmit(data, reset);
      };

      return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} placeholder="e.g., Cosmic Serpent" />
            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="category">Style/Category</Label>
            <Select onValueChange={(value) => control.setValue('category', value)} name="category">
                <SelectTrigger>
                    <SelectValue placeholder="Select a tattoo style" />
                </SelectTrigger>
                <SelectContent>
                    {tattooStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                </SelectContent>
            </Select>
            {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register('description')} placeholder="A brief description of the piece..." />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input id="image" type="file" {...register('image')} accept="image/png, image/jpeg, image/webp" />
            {errors.image && <p className="text-destructive text-sm mt-1">{errors.image.message}</p>}
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
            Add to Portfolio
          </Button>
        </form>
      );
    };

    const EditPortfolioForm = ({ piece, onFormSubmit, submitting, onCancel }) => {
        const { register, handleSubmit, control, formState: { errors } } = useForm({
          resolver: zodResolver(editPortfolioSchema),
          defaultValues: {
            title: piece.title,
            category: piece.category,
            description: piece.description || '',
          }
        });
      
        return (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" {...register('title')} />
              {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="edit-category">Style/Category</Label>
              <Select onValueChange={(value) => control.setValue('category', value)} defaultValue={piece.category}>
                  <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select a tattoo style" />
                  </SelectTrigger>
                  <SelectContent>
                      {tattooStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                  </SelectContent>
              </Select>
              {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea id="edit-description" {...register('description')} />
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin mr-2" />}
                    Save Changes
                </Button>
            </DialogFooter>
          </form>
        );
      };

    const ArtistPortfolioManager = () => {
      const { profile } = useAuth();
      const { toast } = useToast();
      const [portfolio, setPortfolio] = useState([]);
      const [loading, setLoading] = useState(true);
      const [submitting, setSubmitting] = useState(false);
      const [artistId, setArtistId] = useState(null);
      const [editingPiece, setEditingPiece] = useState(null);

      const fetchArtistId = useCallback(async () => {
        if (profile?.id) {
          const { data, error } = await supabase
            .from('artists')
            .select('id')
            .eq('user_id', profile.id)
            .single();
          
          if (error) {
            console.error('Error fetching artist ID:', error);
          } else if (data) {
            setArtistId(data.id);
          }
        }
      }, [profile]);

      const fetchPortfolio = useCallback(async () => {
        if (!artistId) return;
        setLoading(true);
        const { data, error } = await supabase
          .from('portfolio_pieces')
          .select('*')
          .eq('artist_id', artistId)
          .order('created_at', { ascending: false });

        if (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch portfolio.' });
        } else {
          setPortfolio(data);
        }
        setLoading(false);
      }, [artistId, toast]);

      useEffect(() => {
        fetchArtistId();
      }, [fetchArtistId]);

      useEffect(() => {
        if (artistId) {
          fetchPortfolio();
        }
      }, [artistId, fetchPortfolio]);

      const handleFormSubmit = async (data, resetForm) => {
        if (!artistId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Artist profile not found.' });
            return;
        }
        setSubmitting(true);
        const imageFile = data.image[0];
        const fileName = `${profile.id}/${Date.now()}-${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-pieces')
          .upload(fileName, imageFile);

        if (uploadError) {
          toast({ variant: 'destructive', title: 'Upload Error', description: uploadError.message });
          setSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage.from('portfolio-pieces').getPublicUrl(fileName);

        const { error: insertError } = await supabase.from('portfolio_pieces').insert({
          artist_id: artistId,
          title: data.title,
          category: data.category,
          description: data.description,
          image_url: publicUrl,
        });

        if (insertError) {
          toast({ variant: 'destructive', title: 'Database Error', description: insertError.message });
        } else {
          toast({ title: 'Success!', description: 'New piece added to your portfolio.' });
          fetchPortfolio();
          resetForm();
        }
        setSubmitting(false);
      };

      const handleEditSubmit = async (data) => {
        setSubmitting(true);
        const { error } = await supabase
          .from('portfolio_pieces')
          .update({
            title: data.title,
            category: data.category,
            description: data.description,
          })
          .eq('id', editingPiece.id);

        if (error) {
          toast({ variant: 'destructive', title: 'Update Error', description: error.message });
        } else {
          toast({ title: 'Success!', description: 'Portfolio piece updated.' });
          setEditingPiece(null);
          fetchPortfolio();
        }
        setSubmitting(false);
      };

      const handleDelete = async (pieceId, imageUrl) => {
        const { error: dbError } = await supabase.from('portfolio_pieces').delete().eq('id', pieceId);
        if (dbError) {
          toast({ variant: 'destructive', title: 'Database Error', description: dbError.message });
          return;
        }

        const imagePath = imageUrl.split('/portfolio-pieces/')[1];
        if (imagePath) {
            const { error: storageError } = await supabase.storage.from('portfolio-pieces').remove([imagePath]);
            if (storageError) {
                toast({ variant: 'destructive', title: 'Storage Error', description: `Could not delete image, but DB entry removed: ${storageError.message}` });
            }
        }

        toast({ title: 'Deleted!', description: 'Portfolio piece removed.' });
        fetchPortfolio();
      };

      return (
        <div>
          <h1 className="text-4xl font-black mb-2">Portfolio <span className="gradient-text">Manager</span></h1>
          <p className="text-muted-foreground font-mono mb-8">Add, edit, or remove pieces from your public portfolio.</p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload New Work</CardTitle>
              <CardDescription>Showcase your latest tattoos to attract new clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioForm onFormSubmit={handleFormSubmit} submitting={submitting} />
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Current Portfolio ({portfolio.length})</h2>
          {loading ? (
            <div className="flex justify-center items-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {portfolio.map(piece => (
                  <motion.div key={piece.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card>
                      <CardContent className="p-0">
                        <img className="w-full h-48 object-cover" alt={piece.title} src={piece.image_url} />
                        <div className="p-4">
                          <h3 className="font-bold truncate">{piece.title}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{piece.category}</p>
                          <div className="flex gap-2 mt-4">
                            <Dialog open={editingPiece?.id === piece.id} onOpenChange={(isOpen) => !isOpen && setEditingPiece(null)}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => setEditingPiece(piece)}>
                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit "{piece.title}"</DialogTitle>
                                    </DialogHeader>
                                    <EditPortfolioForm 
                                        piece={editingPiece} 
                                        onFormSubmit={handleEditSubmit} 
                                        submitting={submitting}
                                        onCancel={() => setEditingPiece(null)}
                                    />
                                </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="w-full"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure?</DialogTitle>
                                        <DialogDescription>
                                            This will permanently delete "{piece.title}" from your portfolio. This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="ghost">Cancel</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button variant="destructive" onClick={() => handleDelete(piece.id, piece.image_url)}>Confirm Delete</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          { !loading && portfolio.length === 0 && (
            <Card>
                <CardContent className="p-12 text-center">
                    <Images className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold">Your Portfolio is Empty</h3>
                    <p className="text-muted-foreground">Upload your first piece of work to get started!</p>
                </CardContent>
            </Card>
          )}
        </div>
      );
    };

    export default ArtistPortfolioManager;