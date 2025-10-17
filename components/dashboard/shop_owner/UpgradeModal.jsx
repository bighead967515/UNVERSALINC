import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, title, description }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/dashboard/shop/subscription');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="text-primary w-6 h-6" />
            {title || 'Upgrade Your Plan'}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {description || "Unlock more features and grow your business by upgrading your subscription plan."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Maybe Later</Button>
          <Button onClick={handleUpgrade}>
            <Sparkles className="mr-2 h-4 w-4" />
            View Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;