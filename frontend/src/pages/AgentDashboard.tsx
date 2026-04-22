import { useState, useEffect } from 'react';
import { fieldApi } from '../api/field.api';
import type { Field, FieldStage } from '../types/api.types';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertTriangle, CheckCircle2, Check, MessageSquare, Target, Leaf } from 'lucide-react';
import { toast } from 'sonner';

export const AgentDashboard = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [updateStage, setUpdateStage] = useState<FieldStage | ''>('');
  const [updateNote, setUpdateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFields = async () => {
    try {
      const data = await fieldApi.getFields(); 
      setFields(data);
    } catch (error) {
      toast.error("Could not load your assigned fields.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
    
    const handleGlobalUpdate = () => {
      fetchFields();
    };
    
    window.addEventListener('field_update_submitted', handleGlobalUpdate);
    return () => window.removeEventListener('field_update_submitted', handleGlobalUpdate);
  }, []);

  const handleUpdateField = async () => {
    if (!selectedField || !updateStage) {
      toast.error("Please select a valid stage to proceed.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await fieldApi.addUpdate(selectedField.id, { 
        stage: updateStage as FieldStage, 
        note: updateNote.trim() 
      });
      toast.success("Update submitted successfully");
      await fetchFields(); 
      closeModal();
    } catch (error) {
      toast.error("Failed to submit the update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (field: Field) => {
    setSelectedField(field);
    setUpdateStage(field.currentStage);
    setUpdateNote('');
  };

  const closeModal = () => {
    setSelectedField(null);
    setUpdateStage('');
    setUpdateNote('');
  };

  const getGranularTimeAgo = (dateString: string) => {
    const diffInMs = new Date().getTime() - new Date(dateString).getTime();
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Updated just now';
    if (minutes < 60) return `Updated ${minutes} min${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `Updated ${hours} hr${hours === 1 ? '' : 's'} ago`;
    if (days === 1) return 'Updated yesterday';
    return `Updated ${days} days ago`;
  };

  const STAGES: FieldStage[] = ['PLANTED', 'GROWING', 'READY', 'HARVESTED'];

  // Calculate generic active metrics
  const activeFieldsCount = fields.filter(f => f.status === 'ACTIVE').length;
  const atRiskFieldsCount = fields.filter(f => f.status === 'AT_RISK').length;
  const completedFieldsCount = fields.filter(f => f.status === 'COMPLETED').length;
  
  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 uppercase text-[10px]">Active</Badge>;
    if (status === 'AT_RISK') return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 uppercase text-[10px]">At Risk</Badge>;
    return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 uppercase text-[10px]">Completed</Badge>;
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Loading workspace...</div>;
  }

  return (
    <div className="space-y-10 pb-12 max-w-7xl mx-auto">
      
      {/* 1. Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assigned Fields</h1>
        <p className="text-gray-500 text-sm mt-1.5 font-medium">Track and update the fields assigned to you.</p>
      </div>

      {/* 2. 4 Summary Cards Restored */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Assigned', value: fields.length, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50/50', border: 'border-blue-100' },
          { label: 'Active', value: activeFieldsCount, icon: Leaf, color: 'text-green-500', bg: 'bg-green-50/50', border: 'border-green-100' },
          { label: 'At Risk', value: atRiskFieldsCount, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50/50', border: 'border-orange-100' },
          { label: 'Completed', value: completedFieldsCount, icon: CheckCircle2, color: 'text-gray-400', bg: 'bg-gray-50/50', border: 'border-gray-100' },
        ].map((stat) => (
          <Card key={stat.label} className={`border ${stat.border} shadow-sm rounded-2xl ${stat.bg} hover:scale-[1.02] transition-transform duration-200 cursor-default`}>
            <CardContent className="p-5 flex justify-between items-center h-full">
              <div className="flex flex-col justify-center">
                <span className="text-3xl font-bold text-gray-900 leading-none">{stat.value}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wilder mt-2">{stat.label}</span>
              </div>
              <div className={`p-2.5 rounded-xl bg-white/60 shadow-sm ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



      {/* 4. Main Section: Assigned Fields Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Assigned Roster</h2>
        
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 text-center font-semibold text-gray-400 uppercase text-xs">#</TableHead>
                <TableHead className="font-semibold text-gray-600">Field Name</TableHead>
                <TableHead className="font-semibold text-gray-600">Crop</TableHead>
                <TableHead className="font-semibold text-gray-600">Stage</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="font-semibold text-gray-600">Last Update</TableHead>
                <TableHead className="text-right font-semibold text-gray-600 pr-5">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-500 font-medium">
                    No fields assigned yet.
                  </TableCell>
                </TableRow>
              ) : (
                fields.map((field, index) => (
                  <TableRow key={field.id} className="group">
                    <TableCell className="text-center font-medium text-gray-400">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-gray-900">{field.name}</TableCell>
                    <TableCell className="text-gray-600 font-medium">{field.cropType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 capitalize font-medium">
                        {field.currentStage.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(field.status)}</TableCell>
                    <TableCell className="text-gray-500 text-sm font-medium">
                      {getGranularTimeAgo(field.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      {field.status !== 'COMPLETED' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-200 hover:border-[#a3e635] hover:bg-[#a3e635]/10 hover:text-gray-900 font-medium text-gray-600 shadow-sm"
                          onClick={() => openModal(field)}
                        >
                          Update
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-gray-400 font-medium cursor-default hover:bg-transparent" disabled>
                          <Check className="w-4 h-4 mr-1.5" />
                          Done
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 5. Update Modal Dialog */}
      <Dialog open={!!selectedField} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[450px] p-6">
          {selectedField && (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl font-bold text-gray-900">Update Field</DialogTitle>
                <DialogDescription className="text-gray-500 font-medium">
                  Submit a new report for {selectedField.name}.
                </DialogDescription>
              </DialogHeader>

              {/* Context Block */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 space-y-3">
                 <div className="flex justify-between items-center">
                   <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wilder">Current Stage</Label>
                   <Badge variant="outline" className="bg-white">
                     {selectedField.currentStage}
                   </Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wilder">Last Overview</Label>
                   <span className="text-sm font-medium text-gray-700">
                     {getGranularTimeAgo(selectedField.updatedAt)}
                   </span>
                 </div>
              </div>

              <div className="space-y-5">
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
                    placeholder="E.g. Crops are growing well despite the recent rain..."
                    className="resize-none h-24 bg-white border-gray-200"
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    required
                  />
                </div>

                {/* 6. Minimal History Log */}
                {selectedField.updates && selectedField.updates.length > 0 && (
                  <div className="pt-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center mb-3">
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> Recent History
                    </Label>
                    <div className="space-y-3 pl-1">
                      {selectedField.updates.slice(-2).reverse().map((update, idx) => (
                         <div key={idx} className="relative pl-4 border-l-2 border-gray-200">
                           <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[5px] top-1.5"></div>
                           <p className="text-sm text-gray-800 font-medium">"{update.note || `Stage updated to ${update.stage}`}"</p>
                           <span className="text-xs text-gray-500 block mt-0.5">{getGranularTimeAgo(update.createdAt)}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-8">
                <Button variant="outline" onClick={closeModal} className="font-medium text-gray-600 bg-white">
                  Cancel
                </Button>
                <Button 
                   className="bg-[#a3e635] hover:bg-[#84cc16] text-gray-900 font-bold px-6 border border-[#84cc16]/20 shadow-sm disabled:opacity-50"
                   onClick={handleUpdateField}
                   disabled={isSubmitting || !updateNote.trim() || !updateStage}
                >
                  {isSubmitting ? 'Recording...' : 'Submit Update'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
