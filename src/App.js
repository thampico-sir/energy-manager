import React, { useState, useMemo, useEffect, useReducer, useCallback, useRef } from 'react';
import { Plus, ChevronDown, ChevronRight, Trash2, CheckSquare, Square, Edit2, X, Download, Filter, BarChart3, Folder, Upload, AlertCircle } from 'lucide-react';

const STAGES = ['Feasibility', 'Pre-Construction', 'Construction', 'Commissioning', 'Operations'];
const FUEL_TYPES = ['Hydrogen', 'Methanol', 'Ammonia', 'RNG', 'LNG', 'Geothermal'];
const STORAGE_KEY = 'renewable-energy-portfolio-v1';
const SCHEMA_VERSION = 1;

// Stable deliverable IDs (won't break if labels change)
const DELIVERABLES_BY_STAGE = {
  'Feasibility': {
    'Change Management': [
      { id: 'feas-chg-01', label: 'Stakeholder identification' },
      { id: 'feas-chg-02', label: 'Change impact assessment' },
      { id: 'feas-chg-03', label: 'Communication plan' }
    ],
    'Risk Management': [
      { id: 'feas-risk-01', label: 'Risk identification' },
      { id: 'feas-risk-02', label: 'Initial risk register' },
      { id: 'feas-risk-03', label: 'Risk strategy' }
    ],
    'Financial Management': [
      { id: 'feas-fin-01', label: 'Cost estimates' },
      { id: 'feas-fin-02', label: 'Funding analysis' },
      { id: 'feas-fin-03', label: 'Feasibility study' }
    ],
    'Technical Management': [
      { id: 'feas-tech-01', label: 'Technology assessment' },
      { id: 'feas-tech-02', label: 'Site selection' },
      { id: 'feas-tech-03', label: 'Engineering study' }
    ],
    'Stakeholder Management': [
      { id: 'feas-stake-01', label: 'Stakeholder register' },
      { id: 'feas-stake-02', label: 'Analysis matrix' },
      { id: 'feas-stake-03', label: 'Consultation records' }
    ]
  },
  'Pre-Construction': {
    'Change Management': [
      { id: 'pre-chg-01', label: 'Change plan' },
      { id: 'pre-chg-02', label: 'Training assessment' },
      { id: 'pre-chg-03', label: 'Communication schedule' }
    ],
    'Risk Management': [
      { id: 'pre-risk-01', label: 'Risk register with mitigations' },
      { id: 'pre-risk-02', label: 'Risk matrix' },
      { id: 'pre-risk-03', label: 'Ownership assignments' }
    ],
    'Financial Management': [
      { id: 'pre-fin-01', label: 'Detailed budget' },
      { id: 'pre-fin-02', label: 'Financial model' },
      { id: 'pre-fin-03', label: 'Funding agreements' }
    ],
    'Technical Management': [
      { id: 'pre-tech-01', label: 'Engineering design' },
      { id: 'pre-tech-02', label: 'Equipment specs' },
      { id: 'pre-tech-03', label: 'Regulatory compliance' }
    ],
    'Stakeholder Management': [
      { id: 'pre-stake-01', label: 'Engagement plan' },
      { id: 'pre-stake-02', label: 'Communication matrix' },
      { id: 'pre-stake-03', label: 'Partnership agreements' }
    ]
  },
  'Construction': {
    'Change Management': [
      { id: 'con-chg-01', label: 'Weekly updates' },
      { id: 'con-chg-02', label: 'Training delivery' },
      { id: 'con-chg-03', label: 'Communication logs' }
    ],
    'Risk Management': [
      { id: 'con-risk-01', label: 'Risk reviews' },
      { id: 'con-risk-02', label: 'Incident logs' },
      { id: 'con-risk-03', label: 'Safety assessments' }
    ],
    'Financial Management': [
      { id: 'con-fin-01', label: 'Budget reports' },
      { id: 'con-fin-02', label: 'Change orders' },
      { id: 'con-fin-03', label: 'Payment schedules' }
    ],
    'Technical Management': [
      { id: 'con-tech-01', label: 'As-built drawings' },
      { id: 'con-tech-02', label: 'Quality reports' },
      { id: 'con-tech-03', label: 'Testing records' }
    ],
    'Stakeholder Management': [
      { id: 'con-stake-01', label: 'Meeting minutes' },
      { id: 'con-stake-02', label: 'Newsletters' },
      { id: 'con-stake-03', label: 'Complaint log' }
    ]
  },
  'Commissioning': {
    'Change Management': [
      { id: 'com-chg-01', label: 'Readiness assessment' },
      { id: 'com-chg-02', label: 'Review plan' },
      { id: 'com-chg-03', label: 'Knowledge transfer' }
    ],
    'Risk Management': [
      { id: 'com-risk-01', label: 'Commissioning assessment' },
      { id: 'com-risk-02', label: 'Safety verification' },
      { id: 'com-risk-03', label: 'Emergency procedures' }
    ],
    'Financial Management': [
      { id: 'com-fin-01', label: 'Cost reconciliation' },
      { id: 'com-fin-02', label: 'Budget analysis' },
      { id: 'com-fin-03', label: 'Closeout docs' }
    ],
    'Technical Management': [
      { id: 'com-tech-01', label: 'Commissioning plan' },
      { id: 'com-tech-02', label: 'Testing results' },
      { id: 'com-tech-03', label: 'O&M manuals' }
    ],
    'Stakeholder Management': [
      { id: 'com-stake-01', label: 'Notification plan' },
      { id: 'com-stake-02', label: 'Open house docs' },
      { id: 'com-stake-03', label: 'Final report' }
    ]
  },
  'Operations': {
    'Change Management': [
      { id: 'ops-chg-01', label: 'Sustainability plan' },
      { id: 'ops-chg-02', label: 'Training schedule' },
      { id: 'ops-chg-03', label: 'Performance tracking' }
    ],
    'Risk Management': [
      { id: 'ops-risk-01', label: 'Operational register' },
      { id: 'ops-risk-02', label: 'Safety audits' },
      { id: 'ops-risk-03', label: 'Risk monitoring' }
    ],
    'Financial Management': [
      { id: 'ops-fin-01', label: 'Operating budget' },
      { id: 'ops-fin-02', label: 'Revenue tracking' },
      { id: 'ops-fin-03', label: 'Financial statements' }
    ],
    'Technical Management': [
      { id: 'ops-tech-01', label: 'SOPs' },
      { id: 'ops-tech-02', label: 'Maintenance schedules' },
      { id: 'ops-tech-03', label: 'Performance data' }
    ],
    'Stakeholder Management': [
      { id: 'ops-stake-01', label: 'Engagement schedule' },
      { id: 'ops-stake-02', label: 'Benefit reporting' },
      { id: 'ops-stake-03', label: 'Annual meetings' }
    ]
  }
};

const initialState = {
  projects: [],
  selectedProjectId: null,
  deliverables: {},
  filters: { owner: '', stage: '', group: '', inProgressOnly: false, completedOnly: false },
  ui: { expandedStages: {}, expandedAreas: {}, editingItem: null, showFilters: false, showAnalytics: false }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA': {
      const { projects = [], deliverables = {} } = action.payload;
      // Validate data structure
      if (!Array.isArray(projects)) return state;
      if (typeof deliverables !== 'object') return state;
      
      return {
        ...initialState,
        projects: projects.filter(p => p.id && p.name),
        deliverables,
        ui: initialState.ui
      };
    }
    
    case 'PROJECT_ADD':
      return { ...state, projects: [...state.projects, action.payload] };
    
    case 'PROJECT_DELETE':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        selectedProjectId: state.selectedProjectId === action.payload ? null : state.selectedProjectId,
        deliverables: Object.fromEntries(Object.entries(state.deliverables).filter(([k]) => !k.startsWith(`${action.payload}-`)))
      };
    
    case 'PROJECT_UPDATE':
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? { ...p, ...action.payload.updates } : p) };
    
    case 'PROJECT_SELECT':
      return { ...state, selectedProjectId: action.payload };
    
    case 'DELIVERABLE_UPDATE': {
      const key = `${action.payload.projectId}-${action.payload.deliverableId}`;
      return { ...state, deliverables: { ...state.deliverables, [key]: { ...state.deliverables[key], ...action.payload.updates } } };
    }
    
    case 'DELIVERABLE_TOGGLE': {
      const k = `${action.payload.projectId}-${action.payload.deliverableId}`;
      const current = state.deliverables[k] || {};
      return { ...state, deliverables: { ...state.deliverables, [k]: { ...current, status: current.status === 'DONE' ? 'NOT_STARTED' : 'DONE' } } };
    }
    
    case 'FILTERS_SET':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'FILTERS_CLEAR':
      return { ...state, filters: initialState.filters };
    
    case 'UI_TOGGLE':
      return { ...state, ui: { ...state.ui, [action.payload.key]: { ...state.ui[action.payload.key], [action.payload.value]: !state.ui[action.payload.key]?.[action.payload.value] } } };
    
    case 'UI_SET':
      return { ...state, ui: { ...state.ui, [action.payload.key]: action.payload.value } };
    
    case 'RESET_ALL':
      return initialState;
    
    default:
      return state;
  }
}

const AltFuelsProgramManager = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', fuelType: 'Hydrogen', stage: 'Feasibility', group: '' });
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.schemaVersion === SCHEMA_VERSION) dispatch({ type: 'LOAD_DATA', payload: data });
      }
    } catch (e) { console.error('Load failed:', e); }
  }, []);

  const debouncedSave = useCallback((data) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, projects: data.projects, deliverables: data.deliverables, selectedProjectId: data.selectedProjectId, lastSaved: new Date().toISOString() }));
      } catch (e) { console.error('Save failed:', e); }
    }, 500);
  }, []);

  useEffect(() => {
    debouncedSave({ projects: state.projects, deliverables: state.deliverables, selectedProjectId: state.selectedProjectId });
  }, [state.projects, state.deliverables, state.selectedProjectId, debouncedSave]);

  // Cleanup timer on unmount
  useEffect(() => () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
  }, []);

  const selectedProject = useMemo(() => state.projects.find(p => p.id === state.selectedProjectId), [state.projects, state.selectedProjectId]);

  // Convert getAllItems to useMemo instead of useCallback
  const allItems = useMemo(() => {
    const items = [];
    state.projects.forEach(project => {
      Object.entries(DELIVERABLES_BY_STAGE).forEach(([stage, areas]) => {
        Object.entries(areas).forEach(([area, delivs]) => {
          delivs.forEach((deliv) => {
            const key = `${project.id}-${deliv.id}`;
            const details = state.deliverables[key] || { status: 'NOT_STARTED' };
            items.push({ 
              projectId: project.id, 
              projectName: project.name, 
              projectGroup: project.group || 'Ungrouped', 
              fuelType: project.fuelType, 
              deliverableId: deliv.id, 
              stage, 
              area, 
              label: deliv.label, 
              owner: details.owner || '', 
              startDate: details.startDate || '',
              endDate: details.endDate || '',
              status: details.status, 
              comments: details.comments || '' 
            });
          });
        });
      });
    });
    return items;
  }, [state.projects, state.deliverables]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const f = state.filters;
      if (f.owner && !item.owner.toLowerCase().includes(f.owner.toLowerCase())) return false;
      if (f.stage && item.stage !== f.stage) return false;
      if (f.group && item.projectGroup !== f.group) return false;
      if (f.inProgressOnly && item.status !== 'IN_PROGRESS') return false;
      if (f.completedOnly && item.status !== 'DONE') return false;
      return true;
    });
  }, [allItems, state.filters]);

  const analyticsData = useMemo(() => {
    if (!state.ui.showAnalytics) return null;
    
    const byStage = {}, byOwner = {}, byGroup = {}, byArea = {};
    
    filteredItems.forEach(item => {
      byStage[item.stage] = (byStage[item.stage] || 0) + 1;
      if (item.owner) byOwner[item.owner] = (byOwner[item.owner] || 0) + 1;
      byGroup[item.projectGroup] = (byGroup[item.projectGroup] || 0) + 1;
      byArea[item.area] = (byArea[item.area] || 0) + 1;
    });
    
    const completed = filteredItems.filter(i => i.status === 'DONE').length;
    const inProgress = filteredItems.filter(i => i.status === 'IN_PROGRESS').length;
    
    return { 
      total: filteredItems.length, 
      completed, 
      inProgress, 
      notStarted: filteredItems.length - completed - inProgress, 
      byStage, 
      byOwner, 
      byGroup, 
      byArea
    };
  }, [state.ui.showAnalytics, filteredItems]);

  const uniqueGroups = useMemo(() => Array.from(new Set(state.projects.map(p => p.group || 'Ungrouped'))).sort(), [state.projects]);

  const exportCSV = () => {
    const headers = ['Project', 'Group', 'Fuel Type', 'Stage', 'Area', 'Deliverable', 'Owner', 'Start Date', 'End Date', 'Status', 'Completed', 'Comments'];
    const escape = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
    const csv = [headers.join(','), ...allItems.map(i => [
      escape(i.projectName), 
      escape(i.projectGroup), 
      escape(i.fuelType), 
      escape(i.stage), 
      escape(i.area), 
      escape(i.label), 
      escape(i.owner), 
      i.startDate || '',
      i.endDate || '',
      escape(i.status === 'DONE' ? 'Completed' : i.status === 'IN_PROGRESS' ? 'In Process' : 'Not Started'),
      i.status === 'DONE' ? 'Yes' : 'No',
      escape(i.comments)
    ].join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `portfolio_complete_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportJSON = () => {
    const data = { 
      schemaVersion: SCHEMA_VERSION, 
      exportDate: new Date().toISOString(),
      projects: state.projects,
      deliverables: state.deliverables
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `portfolio_complete_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        
        if (!data.schemaVersion || data.schemaVersion !== SCHEMA_VERSION) {
          if (!window.confirm('This file may be from a different version. Import anyway?')) return;
        }
        
        if (data.projects && data.deliverables) {
          dispatch({ type: 'LOAD_DATA', payload: data });
          alert('Import successful!');
        } else {
          alert('Invalid file format');
        }
      } catch (err) { alert('Import error: ' + err.message); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addProject = () => {
    if (newProject.name.trim()) {
      dispatch({ type: 'PROJECT_ADD', payload: { id: `proj-${Date.now()}`, ...newProject, group: newProject.group || 'Ungrouped', dateCreated: new Date().toISOString().split('T')[0] } });
      setNewProject({ name: '', fuelType: 'Hydrogen', stage: 'Feasibility', group: '' });
      setShowAddProject(false);
    }
  };

  const getCompletion = useCallback((projectId, stage = null) => {
    let total = 0, completed = 0;
    Object.entries(DELIVERABLES_BY_STAGE).forEach(([s, areas]) => {
      if (stage && s !== stage) return;
      Object.entries(areas).forEach(([area, delivs]) => {
        delivs.forEach((deliv) => {
          total++;
          const key = `${projectId}-${deliv.id}`;
          if (state.deliverables[key]?.status === 'DONE') completed++;
        });
      });
    });
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [state.deliverables]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Renewable Energy Program Manager</h1>
              <p className="text-slate-600">Checklist for Portfolio Management</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => dispatch({ type: 'UI_SET', payload: { key: 'showFilters', value: !state.ui.showFilters } })} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${state.ui.showFilters ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`} aria-label="Toggle filters"><Filter size={20} />Filters</button>
              <button onClick={() => dispatch({ type: 'UI_SET', payload: { key: 'showAnalytics', value: !state.ui.showAnalytics } })} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${state.ui.showAnalytics ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`} aria-label="Toggle analytics"><BarChart3 size={20} />Analytics</button>
              <button onClick={exportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2" aria-label="Export to CSV"><Download size={20} />CSV</button>
              <button onClick={exportJSON} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2" aria-label="Export to JSON"><Download size={20} />JSON</button>
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 cursor-pointer"><Upload size={20} />Import<input type="file" accept=".json" onChange={importJSON} className="hidden" aria-label="Import JSON file" /></label>
              <button onClick={() => { if (window.confirm('Delete all data?')) { dispatch({ type: 'RESET_ALL' }); localStorage.removeItem(STORAGE_KEY); } }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2" aria-label="Reset all data"><AlertCircle size={20} />Reset</button>
            </div>
          </div>
        </div>

        {state.ui.showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Filters</h2><button onClick={() => dispatch({ type: 'FILTERS_CLEAR' })} className="text-blue-600">Clear</button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={state.filters.owner} onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { owner: e.target.value } })} placeholder="Owner" className="px-3 py-2 border rounded" />
              <select value={state.filters.stage} onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { stage: e.target.value } })} className="px-3 py-2 border rounded"><option value="">All Stages</option>{STAGES.map(s => <option key={s} value={s}>{s}</option>)}</select>
              <select value={state.filters.group} onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { group: e.target.value } })} className="px-3 py-2 border rounded"><option value="">All Groups</option>{uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}</select>
            </div>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={state.filters.inProgressOnly} onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { inProgressOnly: e.target.checked } })} /><span className="text-sm">In Process Only</span></label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={state.filters.completedOnly} onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { completedOnly: e.target.checked } })} /><span className="text-sm">Completed Only</span></label>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              Showing {filteredItems.length} of {allItems.length} items
            </div>
          </div>
        )}

        {state.ui.showAnalytics && analyticsData && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg"><div className="text-sm text-blue-600">Total</div><div className="text-3xl font-bold text-blue-900">{analyticsData.total}</div></div>
              <div className="bg-green-50 p-4 rounded-lg"><div className="text-sm text-green-600">Completed</div><div className="text-3xl font-bold text-green-900">{analyticsData.completed}</div></div>
              <div className="bg-orange-50 p-4 rounded-lg"><div className="text-sm text-orange-600">In Process</div><div className="text-3xl font-bold text-orange-900">{analyticsData.inProgress}</div></div>
              <div className="bg-slate-50 p-4 rounded-lg"><div className="text-sm text-slate-600">Not Started</div><div className="text-3xl font-bold text-slate-900">{analyticsData.notStarted}</div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><h3 className="font-semibold mb-3">By Group</h3><div className="space-y-2">{Object.entries(analyticsData.byGroup).map(([g, c]) => <div key={g} className="flex justify-between"><span className="text-sm">{g}</span><span className="text-sm font-medium">{c}</span></div>)}</div></div>
              <div><h3 className="font-semibold mb-3">By Stage</h3><div className="space-y-2">{Object.entries(analyticsData.byStage).map(([s, c]) => <div key={s} className="flex justify-between"><span className="text-sm">{s}</span><span className="text-sm font-medium">{c}</span></div>)}</div></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Projects</h2>
                <button onClick={() => setShowAddProject(!showAddProject)} className="p-2 bg-green-600 text-white rounded-lg" aria-label="Add new project"><Plus size={20} /></button>
              </div>

              {showAddProject && (
                <div className="mb-4 p-4 bg-slate-50 rounded border">
                  <input type="text" placeholder="Project name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className="w-full px-3 py-2 border rounded mb-2" />
                  <select value={newProject.fuelType} onChange={(e) => setNewProject({ ...newProject, fuelType: e.target.value })} className="w-full px-3 py-2 border rounded mb-2">{FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
                  <select value={newProject.stage} onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })} className="w-full px-3 py-2 border rounded mb-2">{STAGES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                  <input type="text" placeholder="Group (optional)" value={newProject.group} onChange={(e) => setNewProject({ ...newProject, group: e.target.value })} className="w-full px-3 py-2 border rounded mb-3" />
                  <div className="flex gap-2">
                    <button onClick={addProject} className="flex-1 px-4 py-2 bg-green-600 text-white rounded">Add</button>
                    <button onClick={() => setShowAddProject(false)} className="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {state.projects.map(project => {
                  const completion = getCompletion(project.id);
                  return (
                    <div key={project.id} className={`p-4 rounded-lg border-2 cursor-pointer ${state.selectedProjectId === project.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`} onClick={() => dispatch({ type: 'PROJECT_SELECT', payload: project.id })}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><Folder size={14} className="text-slate-500" /><span className="text-xs text-slate-500">{project.group}</span></div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-slate-600">{project.fuelType}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'PROJECT_DELETE', payload: project.id }); }} className="text-red-500" aria-label="Delete project"><Trash2 size={16} /></button>
                      </div>
                      <div className="text-sm mb-2">Stage: {project.stage}</div>
                      <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${completion.percentage}%` }} /></div>
                      <div className="text-xs text-slate-600 mt-1">{completion.percentage}% complete</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedProject ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedProject.name}</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{selectedProject.fuelType}</span>
                    <span>•</span>
                    <select value={selectedProject.stage} onChange={(e) => dispatch({ type: 'PROJECT_UPDATE', payload: { id: selectedProject.id, updates: { stage: e.target.value } } })} className="px-3 py-1 border rounded">{STAGES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                  </div>
                </div>

                <div className="space-y-4">
                  {STAGES.map(stage => {
                    const stats = getCompletion(selectedProject.id, stage);
                    const isExpanded = state.ui.expandedStages[stage];
                    
                    return (
                      <div key={stage} className="border rounded-lg">
                        <button onClick={() => dispatch({ type: 'UI_TOGGLE', payload: { key: 'expandedStages', value: stage } })} className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 flex items-center justify-between" aria-expanded={isExpanded}>
                          <div className="flex items-center gap-2">{isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}<span className="font-semibold">{stage}</span></div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm">{stats.completed}/{stats.total}</span>
                            <div className="w-24 bg-slate-300 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.percentage}%` }} /></div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-4 space-y-3">
                            {Object.entries(DELIVERABLES_BY_STAGE[stage]).map(([area, items]) => {
                              const areaKey = `${stage}-${area}`;
                              const isAreaExpanded = state.ui.expandedAreas[areaKey];
                              const completedCount = items.filter((item) => state.deliverables[`${selectedProject.id}-${item.id}`]?.status === 'DONE').length;

                              return (
                                <div key={area} className="border rounded">
                                  <button onClick={() => dispatch({ type: 'UI_TOGGLE', payload: { key: 'expandedAreas', value: areaKey } })} className="w-full px-3 py-2 bg-white hover:bg-slate-50 flex items-center justify-between" aria-expanded={isAreaExpanded}>
                                    <div className="flex items-center gap-2">{isAreaExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}<span className="font-medium">{area}</span></div>
                                    <span className="text-sm">{completedCount}/{items.length}</span>
                                  </button>

                                  {isAreaExpanded && (
                                    <div className="px-3 py-2 bg-slate-50 space-y-3">
                                      {items.map((deliv) => {
                                        const itemKey = `${selectedProject.id}-${deliv.id}`;
                                        const details = state.deliverables[itemKey] || { status: 'NOT_STARTED' };
                                        const isEditing = state.ui.editingItem === itemKey;

                                        return (
                                          <div key={deliv.id} className="bg-white border rounded-lg p-3">
                                            <div className="flex items-start gap-2 mb-2">
                                              <button onClick={() => dispatch({ type: 'DELIVERABLE_TOGGLE', payload: { projectId: selectedProject.id, deliverableId: deliv.id } })} className="mt-0.5" aria-label={`Toggle ${deliv.label}`}>
                                                {details.status === 'DONE' ? <CheckSquare size={18} className="text-green-600" /> : <Square size={18} className="text-slate-400" />}
                                              </button>
                                              <div className="flex-1"><span className={`text-sm font-medium ${details.status === 'DONE' ? 'line-through text-slate-500' : ''}`}>{deliv.label}</span></div>
                                              <button onClick={() => dispatch({ type: 'UI_SET', payload: { key: 'editingItem', value: isEditing ? null : itemKey } })} className="text-blue-600" aria-label={`Edit ${deliv.label}`}>{isEditing ? <X size={16} /> : <Edit2 size={16} />}</button>
                                            </div>

                                            {isEditing && (
                                              <div className="mt-3 space-y-2 pl-6">
                                                <div><label className="block text-xs font-medium mb-1">Owner</label><input type="text" value={details.owner || ''} onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: deliv.id, updates: { owner: e.target.value } } })} className="w-full px-2 py-1 text-sm border rounded" /></div>
                                                
                                                <div className="grid grid-cols-2 gap-2">
                                                  <div><label className="block text-xs font-medium mb-1">Start Date</label><input type="date" value={details.startDate || ''} onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: deliv.id, updates: { startDate: e.target.value } } })} className="w-full px-2 py-1 text-sm border rounded" /></div>
                                                  <div><label className="block text-xs font-medium mb-1">End Date</label><input type="date" value={details.endDate || ''} onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: deliv.id, updates: { endDate: e.target.value } } })} className="w-full px-2 py-1 text-sm border rounded" /></div>
                                                </div>
                                                
                                                <div><label className="block text-xs font-medium mb-1">Status</label>
                                                  <select value={details.status} onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: deliv.id, updates: { status: e.target.value } } })} className="w-full px-2 py-1 text-sm border rounded">
                                                    <option value="NOT_STARTED">Not Started</option>
                                                    <option value="IN_PROGRESS">In Process</option>
                                                    <option value="DONE">Completed</option>
                                                  </select>
                                                </div>
                                                
                                                <div><label className="block text-xs font-medium mb-1">Comments</label><textarea value={details.comments || ''} onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: deliv.id, updates: { comments: e.target.value } } })} rows={2} className="w-full px-2 py-1 text-sm border rounded resize-none" /></div>
                                              </div>
                                            )}

                                            {!isEditing && (details.owner || details.startDate || details.endDate || details.status !== 'NOT_STARTED' || details.comments) && (
                                              <div className="mt-2 pl-6 text-xs text-slate-600 space-y-1">
                                                {details.owner && <div><span className="font-medium">Owner:</span> {details.owner}</div>}
                                                {(details.startDate || details.endDate) && (
                                                  <div><span className="font-medium">Dates:</span> {details.startDate || 'N/A'} to {details.endDate || 'N/A'}</div>
                                                )}
                                                {details.status === 'IN_PROGRESS' && <div className="text-orange-600 font-medium">⚡ In Process</div>}
                                                {details.status === 'DONE' && <div className="text-green-600 font-medium">✓ Completed</div>}
                                                {details.comments && <div><span className="font-medium">Comments:</span> {details.comments}</div>}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <CheckSquare size={64} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Project Selected</h3>
                <p className="text-slate-500">Select a project to view deliverables</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltFuelsProgramManager;