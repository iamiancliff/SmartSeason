import { useState, useEffect } from 'react';
import { userApi } from '../api/user.api';
import type { User } from '../types/api.types';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '../components/ui/dialog';
import { Users, Mail, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminAgents = () => {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentToDelete, setAgentToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAgents = async () => {
    try {
      const data = await userApi.getAgents();
      setAgents(data);
    } catch (error) {
      toast.error("Could not load agent roster.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;
    try {
      setIsDeleting(true);
      await userApi.deleteAgent(agentToDelete.id);
      setAgents(agents.filter(a => a.id !== agentToDelete.id));
      toast.success(`${agentToDelete.name} has been removed.`);
      setAgentToDelete(null);
    } catch (error) {
      toast.error('Failed to remove agent. They may have active dependencies.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading agents...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Agent Roster</h1>
        <p className="text-gray-500 text-sm mt-1">Manage personnel assigned to tracking operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="border-gray-200 shadow-sm relative overflow-hidden">
            <div className="h-16 bg-primary/5 border-b border-gray-100 absolute top-0 left-0 w-full"></div>
            <CardContent className="pt-8 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xl uppercase shadow-sm">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight">{agent.name}</h3>
                  <Badge variant="secondary" className="mt-1 font-normal text-[10px] uppercase tracking-wider">{agent.role}</Badge>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-100/60 text-sm">
                <div className="flex flex-col gap-1">
                   <span className="text-gray-500 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Address</span>
                   <span className="font-medium text-gray-900 truncate">{agent.email}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setAgentToDelete(agent)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs px-2 h-8"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {agents.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
             <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
             No active field personnel found.
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!agentToDelete} onOpenChange={(open) => !open && setAgentToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Remove Agent
            </DialogTitle>
            <DialogDescription className="pt-3 text-gray-600">
              Are you sure you want to remove <strong>{agentToDelete?.name}</strong>? 
              <br/><br/>
              This will permanently delete their account and remove all of their submitted field updates. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAgentToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAgent} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm Removal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
