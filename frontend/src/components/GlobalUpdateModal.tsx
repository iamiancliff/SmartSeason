import { useState, useEffect, useMemo } from 'react';
import { fieldApi } from '../api/field.api';
import type { Field, FieldStage } from '../types/api.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Search, Map, MoveRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface GlobalUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalUpdateModal = ({ isOpen, onClose }: GlobalUpdateModalProps) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Step 2 State
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [updateStage, setUpdateStage] = useState<FieldStage | ''>('');
  const [updateNote, setUpdateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch fields when modal opens
  useEffect(() => {
    if (isOpen) {
      const getFields = async () => {
        setLoading(true);
        try {
          const data = await fieldApi.getFields();
          // Hide completed fields from the rapid update queue
          setFields(data.filter(f => f.status !== 'COMPLETED'));
        } catch (error) {
          toast.error("Failed to load your fields. Try again.");
        } finally {
          setLoading(false);
        }
      };
      getFields();
      
      // Reset state perfectly on every open
      setStep(1);
      setSearchQuery('');
      setSelectedField(null);
      setUpdateStage('');
      setUpdateNote('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const filteredFields = useMemo(() => {
    if (!searchQuery.trim()) return fields;
    const q = searchQuery.toLowerCase();
    return fields.filter(f => f.name.toLowerCase().includes(q) || f.cropType.toLowerCase().includes(q));
  }, [fields, searchQuery]);

  const handleSelectField = (field: Field) => {
    setSelectedField(field);
    setUpdateStage(field.currentStage);
    setStep(2);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedField || !updateStage) return;
    
    setIsSubmitting(true);
    try {
      await fieldApi.addUpdate(selectedField.id, { 
        stage: updateStage as FieldStage, 
        note: updateNote.trim() 
      });
      toast.success(`Successfully updated ${selectedField.name}`);
      
      // Trigger a window refresh event so the AgentDashboard triggers if it's currently mounted
      window.dispatchEvent(new CustomEvent('field_update_submitted'));
      
      onClose();
    } catch (error) {
      toast.error("Failed to submit the update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const STAGES: FieldStage[] = ['PLANTED', 'GROWING', 'READY', 'HARVESTED'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-6 bg-white overflow-hidden">
        
        {step === 1 ? (
          <>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900">Which field are you updating?</DialogTitle>
              <DialogDescription className="text-gray-500 font-medium">
                Search and select an active location.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#a3e635]" />
                <Input 
                  type="text" 
                  autoFocus
                  placeholder="E.g. North Orchard..." 
                  className="pl-10 h-12 bg-gray-50/50 border-gray-200 text-base focus-visible:ring-2 focus-visible:ring-[#a3e635]/30 focus-visible:border-[#a3e635]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="h-64 overflow-y-auto pr-2 space-y-2">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-gray-400">
                     <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : filteredFields.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 font-medium text-sm">
                     No matches found.
                  </div>
                ) : (
                  filteredFields.map(field => (
                    <div 
                      key={field.id}
                      onClick={() => handleSelectField(field)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white hover:border-[#a3e635] hover:bg-[#a3e635]/5 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">
                          <Map className="w-5 h-5 text-gray-400 group-hover:text-[#a3e635]" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-gray-900 leading-tight">{field.name}</div>
                          <div className="text-xs text-gray-500">{field.cropType}</div>
                        </div>
                      </div>
                      <MoveRight className="w-4 h-4 text-gray-300 group-hover:text-[#a3e635] transition-transform group-hover:translate-x-1" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                Field Update
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs h-7 px-2 text-gray-500 font-semibold hover:bg-gray-100">
                  Change Field
                </Button>
              </DialogTitle>
              <DialogDescription className="text-gray-500 font-medium">
                Submit a new report for <strong className="text-gray-900">{selectedField?.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <Label htmlFor="stage" className="text-gray-900 font-semibold">New Stage</Label>
                <Select value={updateStage} onValueChange={(val: FieldStage) => setUpdateStage(val)}>
                  <SelectTrigger id="stage" className="w-full bg-white border-gray-200">
                    <SelectValue placeholder="Select stage..." />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                       <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="notes" className="text-gray-900 font-semibold">Field Observation Notes</Label>
                  <span className="text-xs text-gray-400 font-medium">Required</span>
                </div>
                <Textarea 
                  id="notes" 
                  autoFocus
                  placeholder="E.g. Crops are growing well despite the recent rain..."
                  className="resize-none h-28 bg-white border-gray-200 text-sm"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-8">
              <Button variant="outline" onClick={onClose} className="font-medium text-gray-600 bg-white">
                Cancel
              </Button>
              <Button 
                 className="bg-[#a3e635] hover:bg-[#84cc16] text-gray-900 font-bold px-6 border border-[#84cc16]/20 shadow-sm disabled:opacity-50"
                 onClick={handleUpdateSubmit}
                 disabled={isSubmitting || !updateNote.trim() || !updateStage}
              >
                {isSubmitting ? 'Recording...' : 'Submit Update'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
