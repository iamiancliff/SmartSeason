import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fieldApi } from '../api/field.api';
import type { Field, FieldUpdate } from '../types/api.types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, MapPin, Sprout, Calendar, User, Clock, Loader2, AlertTriangle } from 'lucide-react';

export const AdminFieldDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [field, setField] = useState<Field | null>(null);
  const [updates, setUpdates] = useState<FieldUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchFieldDetails = async () => {
      try {
        setError(false);
        const [fieldData, updatesData] = await Promise.all([
          fieldApi.getField(id),
          fieldApi.getFieldUpdates(id),
        ]);
        setField(fieldData);
        setUpdates(updatesData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFieldDetails();
  }, [id]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>;
      case 'AT_RISK': return <Badge className="bg-orange-100 text-orange-700 border-0">At Risk</Badge>;
      case 'COMPLETED': return <Badge className="bg-gray-100 text-gray-700 border-0">Completed</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStageBadge = (stage: string) => {
    const colors: Record<string, string> = {
      PLANTED: 'bg-blue-100 text-blue-700',
      GROWING: 'bg-emerald-100 text-emerald-700',
      READY: 'bg-amber-100 text-amber-700',
      HARVESTED: 'bg-gray-100 text-gray-600',
    };
    return <Badge className={`${colors[stage] || ''} border-0 capitalize`}>{stage.toLowerCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
        <span className="text-gray-500 text-sm">Loading field details...</span>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="w-8 h-8 text-orange-400" />
        <p className="text-gray-500">Failed to load field details.</p>
        <Link to="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{field.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5">Field details and update history</p>
        </div>
      </div>

      {/* Field Info + Agent Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Info */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-medium">Field Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-5 gap-x-8">
              <div className="flex items-start gap-3">
                <Sprout className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Crop Type</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{field.cropType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{field.location || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Planting Date</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{formatDate(field.plantingDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Current Stage</p>
                  <div className="mt-1">{getStageBadge(field.currentStage)}</div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status</p>
                <div className="mt-1">{getStatusBadge(field.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Agent Card */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-medium">Assigned Agent</CardTitle>
          </CardHeader>
          <CardContent>
            {field.assignedTo ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{field.assignedTo.name}</p>
                  <p className="text-xs text-gray-500">{field.assignedTo.email}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No agent assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Updates Timeline */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-medium">Update Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No updates have been recorded for this field.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update.id} className="relative flex gap-4 pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-[11px] top-1.5 w-[9px] h-[9px] rounded-full bg-primary border-2 border-white ring-2 ring-gray-100" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStageBadge(update.stage)}
                        <span className="text-xs text-gray-400">{formatDateTime(update.createdAt)}</span>
                      </div>
                      {update.note && (
                        <p className="text-sm text-gray-600 mt-1.5">{update.note}</p>
                      )}
                      {update.agent && (
                        <p className="text-xs text-gray-400 mt-1">by {update.agent.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
