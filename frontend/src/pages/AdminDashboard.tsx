import { useState, useEffect } from 'react';
import { fieldApi } from '../api/field.api';
import type { CreateFieldInput } from '../api/field.api';
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
import { Leaf, AlertTriangle, CheckCircle2, Clock, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newField, setNewField] = useState<CreateFieldInput>({ name: '', cropType: '', plantingDate: '' });
  
  const fetchData = async () => {
    try {
      const [fieldsData, agentsData] = await Promise.all([
        fieldApi.getFields(),
        userApi.getAgents()
      ]);
      setFields(fieldsData);
      setAgents(agentsData);
    } catch (error) {
      toast.error("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fieldApi.createField(newField);
      toast.success("Field created successfully");
      setIsDialogOpen(false);
      setNewField({ name: '', cropType: '', plantingDate: '' });
      fetchData();
    } catch (error) {
      toast.error("Failed to create field");
    }
  };

  const handleAssignAgent = async (fieldId: string, agentId: string) => {
    try {
      await fieldApi.assignAgent(fieldId, agentId);
      toast.success("Agent assigned successfully");
      fetchData();
    } catch (error) {
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">System Coordinator</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time overview of agricultural operations.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateField}>
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
                <DialogDescription>
                  Register a new field in the system. You can assign an agent later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Field Name</Label>
                  <Input 
                    id="name" 
                    value={newField.name} 
                    onChange={e => setNewField({...newField, name: e.target.value})} 
                    placeholder="Eastern Ridge"
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="crop">Crop Type</Label>
                  <Input 
                    id="crop" 
                    value={newField.cropType} 
                    onChange={e => setNewField({...newField, cropType: e.target.value})} 
                    placeholder="Soybeans"
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Planting Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newField.plantingDate} 
                    onChange={e => setNewField({...newField, plantingDate: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Field</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      <Card className="border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[200px]">Field</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {fields.map((field) => (
                <TableRow key={field.id} className="group">
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>{field.cropType}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal capitalize">{field.currentStage.toLowerCase()}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(field.status)}</TableCell>
                  <TableCell>
                    <Select 
                      value={field.assignedToId || "none"} 
                      onValueChange={(val) => handleAssignAgent(field.id, val)}
                    >
                      <SelectTrigger className="w-[180px] h-8 border-gray-200">
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/fields/${field.id}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {fields.length === 0 && (
          <div className="text-center py-12 text-gray-500">No fields registered in the system.</div>
        )}
      </Card>
    </div>
  );
};
