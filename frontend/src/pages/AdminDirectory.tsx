import { useState, useEffect } from 'react';
import { fieldApi } from '../api/field.api';
import type { Field } from '../types/api.types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Search, FolderKanban } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDirectory = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFields = async () => {
    try {
      const data = await fieldApi.getFields();
      setFields(data);
    } catch (error) {
      toast.error("Could not load directory data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>;
      case 'AT_RISK': return <Badge className="bg-orange-100 text-orange-700 border-0">At Risk</Badge>;
      case 'COMPLETED': return <Badge className="bg-gray-100 text-gray-700 border-0">Completed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredFields = fields.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.cropType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading directory...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Agricultural Directory</h1>
        <p className="text-gray-500 text-sm mt-1">Complete system ledger of all recorded fields.</p>
      </div>

      <Card className="border-gray-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg flex items-center">
            <FolderKanban className="w-5 h-5 mr-2 text-primary" />
            Active Records
          </CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search by field or crop..." 
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white border-b border-gray-100">
                <TableRow>
                  <TableHead className="w-[200px]">Field Name</TableHead>
                  <TableHead>Crop Type</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>System Status</TableHead>
                  <TableHead>Planting Date</TableHead>
                  <TableHead className="text-right">Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFields.map((field) => (
                  <TableRow key={field.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>{field.cropType}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal capitalize">{field.currentStage.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(field.status)}</TableCell>
                    <TableCell>{new Date(field.plantingDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right text-gray-500">
                      {field.assignedTo?.name || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredFields.length === 0 && (
              <div className="text-center py-16 px-4">
                <FolderKanban className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No records found</h3>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
