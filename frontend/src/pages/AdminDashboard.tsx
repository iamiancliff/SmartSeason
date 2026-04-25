import { useState, useEffect } from 'react';
import { fieldApi } from '../api/field.api';
import type { CreateFieldInput, UpdateFieldInput } from '../api/field.api';
import { userApi } from '../api/user.api';
import type { Field, User } from '../types/api.types';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Leaf, AlertTriangle, CheckCircle2, Clock, Plus, ArrowRight, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // Create dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newField, setNewField] = useState<CreateFieldInput>({ name: '', cropType: '', location: '', plantingDate: '' });

  // Edit dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTarget, setEditTarget] = useState<Field | null>(null);
  const [editData, setEditData] = useState<UpdateFieldInput>({});

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Field | null>(null);

  const fetchData = async () => {
    try {
      setFetchError(false);
      const [fieldsData, agentsData] = await Promise.all([
        fieldApi.getFields(),
        userApi.getAgents()
      ]);
      setFields(fieldsData);
      setAgents(agentsData);
    } catch {
      setFetchError(true);
      toast.error("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Create ---
  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await fieldApi.createField(newField);
      toast.success("Field created successfully");
      setIsCreateOpen(false);
      setNewField({ name: '', cropType: '', location: '', plantingDate: '' });
      fetchData();
    } catch {
      toast.error("Failed to create field");
    } finally {
      setIsCreating(false);
    }
  };

  // --- Edit ---
  const openEditDialog = (field: Field) => {
    setEditTarget(field);
    setEditData({
      name: field.name,
      cropType: field.cropType,
      location: field.location || '',
      plantingDate: field.plantingDate ? field.plantingDate.substring(0, 10) : '',
    });
    setIsEditOpen(true);
  };

  const handleEditField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setIsEditing(true);
    try {
      await fieldApi.updateField(editTarget.id, editData);
      toast.success("Field updated successfully");
      setIsEditOpen(false);
      setEditTarget(null);
      fetchData();
    } catch {
      toast.error("Failed to update field. Changes were not saved.");
    } finally {
      setIsEditing(false);
    }
  };

  // --- Delete ---
  const openDeleteDialog = (field: Field) => {
    setDeleteTarget(field);
    setIsDeleteOpen(true);
  };

  const handleDeleteField = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await fieldApi.deleteField(deleteTarget.id);
      toast.success("Field deleted successfully");
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast.error("Failed to delete field. It may have associated data.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Assign ---
  const handleAssignAgent = async (fieldId: string, agentId: string) => {
    try {
      await fieldApi.assignAgent(fieldId, agentId);
      toast.success("Agent assigned successfully");
      fetchData();
    } catch {
      toast.error("Failed to assign agent");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border-0">Active</Badge>;
      case 'AT_RISK': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-0">At Risk</Badge>;
      case 'COMPLETED': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-0">Completed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '—';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
        <span className="text-gray-500 text-sm">Loading dashboard...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="w-8 h-8 text-orange-400" />
        <p className="text-gray-500">Failed to load dashboard data.</p>
        <Button variant="outline" onClick={() => { setLoading(true); fetchData(); }}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">System Coordinator</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time overview of agricultural operations.</p>
        </div>

        {/* Create Field Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <form onSubmit={handleCreateField}>
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
                <DialogDescription>
                  Register a new field in the system. You can assign an agent later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="create-name">Field Name</Label>
                  <Input
                    id="create-name"
                    value={newField.name}
                    onChange={e => setNewField({...newField, name: e.target.value})}
                    placeholder="Eastern Ridge"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-crop">Crop Type</Label>
                  <Input
                    id="create-crop"
                    value={newField.cropType}
                    onChange={e => setNewField({...newField, cropType: e.target.value})}
                    placeholder="Soybeans"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-location">Location</Label>
                  <Input
                    id="create-location"
                    value={newField.location}
                    onChange={e => setNewField({...newField, location: e.target.value})}
                    placeholder="Nyandarua County"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-date">Planting Date</Label>
                  <Input
                    id="create-date"
                    type="date"
                    value={newField.plantingDate}
                    onChange={e => setNewField({...newField, plantingDate: e.target.value})}
                    required
                    disabled={isCreating}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Field'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Fields', value: fields.length, icon: Leaf, color: 'text-gray-400' },
          { label: 'Active', value: fields.filter(f => f.status === 'ACTIVE').length, icon: Clock, color: 'text-green-500' },
          { label: 'At Risk', value: fields.filter(f => f.status === 'AT_RISK').length, icon: AlertTriangle, color: 'text-orange-500' },
          { label: 'Completed', value: fields.filter(f => f.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-gray-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Fields Table */}
      <Card className="border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[180px]">Field</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Planting Date</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {fields.map((field, index) => (
                <TableRow key={field.id} className="group hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-gray-400 text-sm">{index + 1}</TableCell>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>{field.cropType}</TableCell>
                  <TableCell className="text-gray-600">{field.location || <span className="text-gray-300">—</span>}</TableCell>
                  <TableCell className="text-gray-600">{formatDate(field.plantingDate)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal capitalize">{field.currentStage.toLowerCase()}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(field.status)}</TableCell>
                  <TableCell>
                    <Select
                      value={field.assignedToId || "none"}
                      onValueChange={(val) => handleAssignAgent(field.id, val)}
                    >
                      <SelectTrigger className="w-[200px] h-8 border-gray-200">
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name} ({agent.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(field)} title="Edit field">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => openDeleteDialog(field)} title="Delete field">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Link to={`/admin/fields/${field.id}`}>
                        <Button variant="ghost" size="sm" title="View details">
                          Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        </div>
        {fields.length === 0 && (
          <div className="text-center py-12 text-gray-500">No fields registered in the system.</div>
        )}
      </Card>

      {/* Edit Field Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { if (!open) { setIsEditOpen(false); setEditTarget(null); } else { setIsEditOpen(true); } }}>
        <DialogContent className="sm:max-w-[520px]">
          <form onSubmit={handleEditField}>
            <DialogHeader>
              <DialogTitle>Edit Field</DialogTitle>
              <DialogDescription>
                Update the details for <span className="font-medium">{editTarget?.name}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Field Name</Label>
                <Input
                  id="edit-name"
                  value={editData.name || ''}
                  onChange={e => setEditData({...editData, name: e.target.value})}
                  placeholder="Eastern Ridge"
                  required
                  disabled={isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-crop">Crop Type</Label>
                <Input
                  id="edit-crop"
                  value={editData.cropType || ''}
                  onChange={e => setEditData({...editData, cropType: e.target.value})}
                  placeholder="Soybeans"
                  required
                  disabled={isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editData.location || ''}
                  onChange={e => setEditData({...editData, location: e.target.value})}
                  placeholder="Nyandarua County"
                  disabled={isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Planting Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editData.plantingDate || ''}
                  onChange={e => setEditData({...editData, plantingDate: e.target.value})}
                  disabled={isEditing}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isEditing}>Cancel</Button>
              <Button type="submit" disabled={isEditing}>
                {isEditing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={(open) => { if (!open) { setIsDeleteOpen(false); setDeleteTarget(null); } else { setIsDeleteOpen(true); } }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium">{deleteTarget?.name}</span>? This action cannot be undone and all associated updates will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteField} disabled={isDeleting}>
              {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : 'Delete Field'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
