import { useState, useEffect, useMemo } from 'react';
import { fieldApi } from '../api/field.api';
import type { FieldUpdate, FieldStage } from '../types/api.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, Filter, History } from 'lucide-react';
import { toast } from 'sonner';

interface FlattenedUpdate extends FieldUpdate {
  fieldName: string;
  fieldCrop: string;
}

export const AgentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<FlattenedUpdate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await fieldApi.getFields();
        // Flatten all updates across all assigned fields
        const allUpdates: FlattenedUpdate[] = [];
        data.forEach(field => {
          if (field.updates) {
            field.updates.forEach(update => {
              allUpdates.push({
                ...update,
                fieldName: field.name,
                fieldCrop: field.cropType
              });
            });
          }
        });

        // Sort chronologically (Newest first)
        allUpdates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUpdates(allUpdates);
      } catch (error) {
        toast.error("Could not load your recent updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredUpdates = useMemo(() => {
    let result = updates;
    
    if (stageFilter !== 'ALL') {
      result = result.filter(u => u.stage === stageFilter);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.fieldName.toLowerCase().includes(q) || 
        (u.note && u.note.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [updates, searchQuery, stageFilter]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).format(d);
  };

  const STAGES: FieldStage[] = ['PLANTED', 'GROWING', 'READY', 'HARVESTED'];

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Loading history...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* 1. Creative & Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
           <div className="inline-flex items-center gap-2 mb-2">
             <div className="p-1.5 bg-[#a3e635]/20 rounded-md">
                <History className="w-4 h-4 text-[#84cc16]" />
             </div>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Audit Trail</span>
           </div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Update History</h1>
           <p className="text-gray-500 text-sm mt-1.5 font-medium max-w-2xl">
             Review the chronological log of all field reports and stage transitions you've submitted.
           </p>
        </div>
      </div>

      {/* 2. High-end Search & Filter Controls */}
      <div className="bg-gray-50/50 border border-gray-200 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row gap-4 mb-6 transition-all duration-300 hover:shadow-md hover:bg-white">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[#a3e635]" />
          <Input 
            type="text" 
            placeholder="Search field names or notes..." 
            className="pl-10 h-11 bg-white border-gray-200 transition-all rounded-xl focus-visible:ring-2 focus-visible:ring-[#a3e635]/30 focus-visible:border-[#a3e635] shadow-sm text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="w-full sm:w-[220px]">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="h-11 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a3e635]/30 focus:border-[#a3e635] shadow-sm font-medium">
              <Filter className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
              <SelectValue placeholder="Filter by Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Stages</SelectItem>
              {STAGES.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3. History Data Table */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-600 w-1/4">Date & Time</TableHead>
              <TableHead className="font-semibold text-gray-600">Field</TableHead>
              <TableHead className="font-semibold text-gray-600">Reported Stage</TableHead>
              <TableHead className="font-semibold text-gray-600 w-[45%]">Observation Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUpdates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-500 font-medium">
                  {searchQuery || stageFilter !== 'ALL' 
                    ? 'No updates match your filters.' 
                    : 'No historical updates found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUpdates.map((update) => (
                <TableRow key={update.id} className="group">
                  <TableCell className="text-gray-500 text-sm font-medium">
                    {formatDate(update.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{update.fieldName}</div>
                    <div className="text-xs text-gray-400">{update.fieldCrop}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 capitalize font-medium">
                      {update.stage.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 italic text-sm">
                    "{update.note || `Stage automatically advanced to ${update.stage}`}"
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
};
