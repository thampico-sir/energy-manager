import React, { useState, useMemo, useEffect, useReducer } from 'react';
import { Plus, ChevronDown, ChevronRight, Trash2, CheckSquare, Square, Edit2, X, Download, Filter, BarChart3, Folder, Upload } from 'lucide-react';

// Deliverable Library with stable IDs
const DELIVERABLE_LIBRARY = {
  'chg-feas-1': { stage: 'Feasibility', area: 'Change Management', label: 'Stakeholder identification and mapping' },
  'chg-feas-2': { stage: 'Feasibility', area: 'Change Management', label: 'Initial change impact assessment' },
  'chg-feas-3': { stage: 'Feasibility', area: 'Change Management', label: 'Communication plan template' },
  'chg-feas-4': { stage: 'Feasibility', area: 'Change Management', label: 'Stakeholder engagement strategy' },
  'chg-pre-1': { stage: 'Pre-Construction', area: 'Change Management', label: 'Change management plan' },
  'chg-pre-2': { stage: 'Pre-Construction', area: 'Change Management', label: 'Training needs assessment' },
  'chg-pre-3': { stage: 'Pre-Construction', area: 'Change Management', label: 'Communication schedule' },
  'chg-pre-4': { stage: 'Pre-Construction', area: 'Change Management', label: 'Stakeholder feedback mechanisms' },
  'chg-pre-5': { stage: 'Pre-Construction', area: 'Change Management', label: 'Change readiness assessment' },
  'chg-con-1': { stage: 'Construction', area: 'Change Management', label: 'Weekly change updates' },
  'chg-con-2': { stage: 'Construction', area: 'Change Management', label: 'Training delivery plan' },
  'chg-con-3': { stage: 'Construction', area: 'Change Management', label: 'Change resistance management plan' },
  'chg-con-4': { stage: 'Construction', area: 'Change Management', label: 'Stakeholder communication logs' },
  'chg-com-1': { stage: 'Commissioning', area: 'Change Management', label: 'Go-live readiness assessment' },
  'chg-com-2': { stage: 'Commissioning', area: 'Change Management', label: 'Post-implementation review plan' },
  'chg-com-3': { stage: 'Commissioning', area: 'Change Management', label: 'Knowledge transfer documentation' },
  'chg-com-4': { stage: 'Commissioning', area: 'Change Management', label: 'Lessons learned register' },
  'chg-ops-1': { stage: 'Operations', area: 'Change Management', label: 'Change sustainability plan' },
  'chg-ops-2': { stage: 'Operations', area: 'Change Management', label: 'Ongoing training schedule' },
  'chg-ops-3': { stage: 'Operations', area: 'Change Management', label: 'Performance metrics tracking' },
  'chg-ops-4': { stage: 'Operations', area: 'Change Management', label: 'Continuous improvement process' },
  'risk-feas-1': { stage: 'Feasibility', area: 'Risk Management', label: 'Risk identification workshop results' },
  'risk-feas-2': { stage: 'Feasibility', area: 'Risk Management', label: 'Initial risk register' },
  'risk-feas-3': { stage: 'Feasibility', area: 'Risk Management', label: 'Risk appetite statement' },
  'risk-feas-4': { stage: 'Feasibility', area: 'Risk Management', label: 'Risk management strategy' },
  'risk-pre-1': { stage: 'Pre-Construction', area: 'Risk Management', label: 'Detailed risk register with mitigation plans' },
  'risk-pre-2': { stage: 'Pre-Construction', area: 'Risk Management', label: 'Risk matrix and heat map' },
  'risk-pre-3': { stage: 'Pre-Construction', area: 'Risk Management', label: 'Risk ownership assignments' },
  'risk-pre-4': { stage: 'Pre-Construction', area: 'Risk Management', label: 'Contingency planning documentation' },
  'risk-pre-5': { stage: 'Pre-Construction', area: 'Risk Management', label: 'Insurance requirements analysis' },
  'risk-con-1': { stage: 'Construction', area: 'Risk Management', label: 'Monthly risk review reports' },
  'risk-con-2': { stage: 'Construction', area: 'Risk Management', label: 'Updated risk register' },
  'risk-con-3': { stage: 'Construction', area: 'Risk Management', label: 'Incident reporting logs' },
  'risk-con-4': { stage: 'Construction', area: 'Risk Management', label: 'Safety risk assessments' },
  'risk-con-5': { stage: 'Construction', area: 'Risk Management', label: 'Environmental risk monitoring' },
  'risk-com-1': { stage: 'Commissioning', area: 'Risk Management', label: 'Commissioning risk assessment' },
  'risk-com-2': { stage: 'Commissioning', area: 'Risk Management', label: 'Safety protocols verification' },
  'risk-com-3': { stage: 'Commissioning', area: 'Risk Management', label: 'Emergency response procedures' },
  'risk-com-4': { stage: 'Commissioning', area: 'Risk Management', label: 'Risk handover documentation' },
  'risk-ops-1': { stage: 'Operations', area: 'Risk Management', label: 'Operational risk register' },
  'risk-ops-2': { stage: 'Operations', area: 'Risk Management', label: 'Ongoing safety audits' },
  'risk-ops-3': { stage: 'Operations', area: 'Risk Management', label: 'Risk monitoring dashboard' },
  'risk-ops-4': { stage: 'Operations', area: 'Risk Management', label: 'Annual risk review report' },
  'fin-feas-1': { stage: 'Feasibility', area: 'Financial Management', label: 'Preliminary cost estimates' },
  'fin-feas-2': { stage: 'Feasibility', area: 'Financial Management', label: 'Funding options analysis' },
  'fin-feas-3': { stage: 'Feasibility', area: 'Financial Management', label: 'Economic feasibility study' },
  'fin-feas-4': { stage: 'Feasibility', area: 'Financial Management', label: 'Financial model (high-level)' },
  'fin-feas-5': { stage: 'Feasibility', area: 'Financial Management', label: 'Grant and incentive opportunities list' },
  'fin-pre-1': { stage: 'Pre-Construction', area: 'Financial Management', label: 'Detailed project budget' },
  'fin-pre-2': { stage: 'Pre-Construction', area: 'Financial Management', label: 'Financial model (detailed)' },
  'fin-pre-3': { stage: 'Pre-Construction', area: 'Financial Management', label: 'Funding agreements' },
  'fin-pre-4': { stage: 'Pre-Construction', area: 'Financial Management', label: 'Procurement strategy' },
  'fin-pre-5': { stage: 'Pre-Construction', area: 'Financial Management', label: 'Cost-benefit analysis' },
  'fin-pre-6': { stage: 'Pre-Construction', area: 'Financial Management', label: 'Cash flow projections' },
  'fin-con-1': { stage: 'Construction', area: 'Financial Management', label: 'Monthly budget variance reports' },
  'fin-con-2': { stage: 'Construction', area: 'Financial Management', label: 'Change order tracking' },
  'fin-con-3': { stage: 'Construction', area: 'Financial Management', label: 'Payment schedules and invoices' },
  'fin-con-4': { stage: 'Construction', area: 'Financial Management', label: 'Expenditure forecasts' },
  'fin-con-5': { stage: 'Construction', area: 'Financial Management', label: 'Financial status reports' },
  'fin-com-1': { stage: 'Commissioning', area: 'Financial Management', label: 'Final cost reconciliation' },
  'fin-com-2': { stage: 'Commissioning', area: 'Financial Management', label: 'As-spent vs budget analysis' },
  'fin-com-3': { stage: 'Commissioning', area: 'Financial Management', label: 'Financial closeout documentation' },
  'fin-com-4': { stage: 'Commissioning', area: 'Financial Management', label: 'Warranty and maintenance cost provisions' },
  'fin-ops-1': { stage: 'Operations', area: 'Financial Management', label: 'Operational budget' },
  'fin-ops-2': { stage: 'Operations', area: 'Financial Management', label: 'Revenue tracking' },
  'fin-ops-3': { stage: 'Operations', area: 'Financial Management', label: 'Operating cost analysis' },
  'fin-ops-4': { stage: 'Operations', area: 'Financial Management', label: 'Annual financial statements' },
  'fin-ops-5': { stage: 'Operations', area: 'Financial Management', label: 'ROI performance tracking' },
  'tech-feas-1': { stage: 'Feasibility', area: 'Technical Management', label: 'Technology assessment report' },
  'tech-feas-2': { stage: 'Feasibility', area: 'Technical Management', label: 'Site selection criteria and analysis' },
  'tech-feas-3': { stage: 'Feasibility', area: 'Technical Management', label: 'Preliminary engineering study' },
  'tech-feas-4': { stage: 'Feasibility', area: 'Technical Management', label: 'Feedstock availability assessment' },
  'tech-feas-5': { stage: 'Feasibility', area: 'Technical Management', label: 'Production capacity analysis' },
  'tech-feas-6': { stage: 'Feasibility', area: 'Technical Management', label: 'Utility requirements assessment' },
  'tech-pre-1': { stage: 'Pre-Construction', area: 'Technical Management', label: 'Detailed engineering design' },
  'tech-pre-2': { stage: 'Pre-Construction', area: 'Technical Management', label: 'Equipment specifications' },
  'tech-pre-3': { stage: 'Pre-Construction', area: 'Technical Management', label: 'Process flow diagrams' },
  'tech-pre-4': { stage: 'Pre-Construction', area: 'Technical Management', label: 'Site layout plans' },
  'tech-pre-5': { stage: 'Pre-Construction', area: 'Technical Management', label: 'Permitting and regulatory compliance documentation' },
  'tech-pre-6': { stage: 'Pre-Construction', area: 'Technical Management', label: 'HAZOP study results' },
  'tech-pre-7': { stage: 'Pre-Construction', area: 'Technical Management', label: 'Environmental impact assessment' },
  'tech-con-1': { stage: 'Construction', area: 'Technical Management', label: 'Construction drawings (as-built)' },
  'tech-con-2': { stage: 'Construction', area: 'Technical Management', label: 'Quality control reports' },
  'tech-con-3': { stage: 'Construction', area: 'Technical Management', label: 'Equipment installation records' },
  'tech-con-4': { stage: 'Construction', area: 'Technical Management', label: 'Safety data sheets' },
  'tech-con-5': { stage: 'Construction', area: 'Technical Management', label: 'Inspection and testing reports' },
  'tech-con-6': { stage: 'Construction', area: 'Technical Management', label: 'Progress photographs and documentation' },
  'tech-com-1': { stage: 'Commissioning', area: 'Technical Management', label: 'Commissioning plan' },
  'tech-com-2': { stage: 'Commissioning', area: 'Technical Management', label: 'System integration testing results' },
  'tech-com-3': { stage: 'Commissioning', area: 'Technical Management', label: 'Performance testing data' },
  'tech-com-4': { stage: 'Commissioning', area: 'Technical Management', label: 'Operations and maintenance manuals' },
  'tech-com-5': { stage: 'Commissioning', area: 'Technical Management', label: 'As-built documentation package' },
  'tech-com-6': { stage: 'Commissioning', area: 'Technical Management', label: 'Warranty documentation' },
  'tech-ops-1': { stage: 'Operations', area: 'Technical Management', label: 'Standard operating procedures' },
  'tech-ops-2': { stage: 'Operations', area: 'Technical Management', label: 'Maintenance schedules' },
  'tech-ops-3': { stage: 'Operations', area: 'Technical Management', label: 'Production performance data' },
  'tech-ops-4': { stage: 'Operations', area: 'Technical Management', label: 'Equipment maintenance logs' },
  'tech-ops-5': { stage: 'Operations', area: 'Technical Management', label: 'Process optimization reports' },
  'tech-ops-6': { stage: 'Operations', area: 'Technical Management', label: 'Annual technical audits' },
  'stake-feas-1': { stage: 'Feasibility', area: 'Stakeholder Management', label: 'Stakeholder register' },
  'stake-feas-2': { stage: 'Feasibility', area: 'Stakeholder Management', label: 'Stakeholder analysis matrix' },
  'stake-feas-3': { stage: 'Feasibility', area: 'Stakeholder Management', label: 'Initial consultation records' },
  'stake-feas-4': { stage: 'Feasibility', area: 'Stakeholder Management', label: 'Community engagement plan outline' },
  'stake-pre-1': { stage: 'Pre-Construction', area: 'Stakeholder Management', label: 'Stakeholder engagement plan' },
  'stake-pre-2': { stage: 'Pre-Construction', area: 'Stakeholder Management', label: 'Communication matrix' },
  'stake-pre-3': { stage: 'Pre-Construction', area: 'Stakeholder Management', label: 'Community consultation records' },
  'stake-pre-4': { stage: 'Pre-Construction', area: 'Stakeholder Management', label: 'Partnership agreements' },
  'stake-pre-5': { stage: 'Pre-Construction', area: 'Stakeholder Management', label: 'Regulatory stakeholder correspondence' },
  'stake-pre-6': { stage: 'Pre-Construction', area: 'Stakeholder Management', label: 'Public information materials' },
  'stake-con-1': { stage: 'Construction', area: 'Stakeholder Management', label: 'Stakeholder meeting minutes' },
  'stake-con-2': { stage: 'Construction', area: 'Stakeholder Management', label: 'Community update newsletters' },
  'stake-con-3': { stage: 'Construction', area: 'Stakeholder Management', label: 'Issue and complaint log' },
  'stake-con-4': { stage: 'Construction', area: 'Stakeholder Management', label: 'Stakeholder satisfaction surveys' },
  'stake-con-5': { stage: 'Construction', area: 'Stakeholder Management', label: 'Media and public relations materials' },
  'stake-com-1': { stage: 'Commissioning', area: 'Stakeholder Management', label: 'Stakeholder notification plan' },
  'stake-com-2': { stage: 'Commissioning', area: 'Stakeholder Management', label: 'Community open house documentation' },
  'stake-com-3': { stage: 'Commissioning', area: 'Stakeholder Management', label: 'Final stakeholder report' },
  'stake-com-4': { stage: 'Commissioning', area: 'Stakeholder Management', label: 'Handover stakeholder briefings' },
  'stake-ops-1': { stage: 'Operations', area: 'Stakeholder Management', label: 'Ongoing stakeholder engagement schedule' },
  'stake-ops-2': { stage: 'Operations', area: 'Stakeholder Management', label: 'Community benefit reporting' },
  'stake-ops-3': { stage: 'Operations', area: 'Stakeholder Management', label: 'Annual stakeholder meetings' },
  'stake-ops-4': { stage: 'Operations', area: 'Stakeholder Management', label: 'Stakeholder feedback mechanism' },
  'stake-ops-5': { stage: 'Operations', area: 'Stakeholder Management', label: 'Corporate social responsibility reports' },
};

const STAGES = ['Feasibility', 'Pre-Construction', 'Construction', 'Commissioning', 'Operations'];
const FUEL_TYPES = ['Hydrogen', 'Methanol', 'Ammonia', 'RNG', 'LNG', 'Geothermal'];
const MANAGEMENT_AREAS = ['Change Management', 'Risk Management', 'Financial Management', 'Technical Management', 'Stakeholder Management'];

const STORAGE_KEY = 'renewable-energy-portfolio-v1';

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;
    
    case 'PROJECT_ADD':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    
    case 'PROJECT_DELETE':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        selectedProjectId: state.selectedProjectId === action.payload ? null : state.selectedProjectId,
        deliverables: Object.fromEntries(
          Object.entries(state.deliverables).filter(([key]) => !key.startsWith(`${action.payload}-`))
        )
      };
    
    case 'PROJECT_UPDATE':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        )
      };
    
    case 'PROJECT_SELECT':
      return {
        ...state,
        selectedProjectId: action.payload
      };
    
    case 'DELIVERABLE_UPDATE':
      return {
        ...state,
        deliverables: {
          ...state.deliverables,
          [`${action.payload.projectId}-${action.payload.deliverableId}`]: {
            ...state.deliverables[`${action.payload.projectId}-${action.payload.deliverableId}`],
            ...action.payload.updates
          }
        }
      };
    
    case 'DELIVERABLE_TOGGLE':
      const key = `${action.payload.projectId}-${action.payload.deliverableId}`;
      const current = state.deliverables[key] || {};
      return {
        ...state,
        deliverables: {
          ...state.deliverables,
          [key]: {
            ...current,
            completed: !current.completed,
            status: !current.completed ? 'DONE' : (current.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'NOT_STARTED')
          }
        }
      };
    
    case 'FILTERS_SET':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case 'FILTERS_CLEAR':
      return {
        ...state,
        filters: {
          owner: '',
          stage: '',
          group: '',
          minDuration: '',
          maxDuration: '',
          inProgressOnly: false,
          completedOnly: false
        }
      };
    
    case 'UI_TOGGLE_STAGE':
      return {
        ...state,
        ui: {
          ...state.ui,
          expandedStages: {
            ...state.ui.expandedStages,
            [action.payload]: !state.ui.expandedStages[action.payload]
          }
        }
      };
    
    case 'UI_TOGGLE_AREA':
      return {
        ...state,
        ui: {
          ...state.ui,
          expandedAreas: {
            ...state.ui.expandedAreas,
            [action.payload]: !state.ui.expandedAreas[action.payload]
          }
        }
      };
    
    case 'UI_SET_EDITING':
      return {
        ...state,
        ui: { ...state.ui, editingItem: action.payload }
      };
    
    case 'UI_TOGGLE_PANEL':
      return {
        ...state,
        ui: {
          ...state.ui,
          [action.payload]: !state.ui[action.payload]
        }
      };
    
    default:
      return state;
  }
}

const initialState = {
  projects: [],
  selectedProjectId: null,
  deliverables: {},
  filters: {
    owner: '',
    stage: '',
    group: '',
    minDuration: '',
    maxDuration: '',
    inProgressOnly: false,
    completedOnly: false
  },
  ui: {
    expandedStages: {},
    expandedAreas: {},
    editingItem: null,
    showFilters: false,
    showAnalytics: false
  }
};

const AltFuelsProgramManager = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', fuelType: 'Hydrogen', stage: 'Feasibility', group: '' });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        dispatch({ type: 'LOAD_DATA', payload: { ...initialState, ...data } });
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const toSave = {
        projects: state.projects,
        deliverables: state.deliverables,
        selectedProjectId: state.selectedProjectId
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }, [state.projects, state.deliverables, state.selectedProjectId]);

  const selectedProject = useMemo(() => 
    state.projects.find(p => p.id === state.selectedProjectId) || null,
    [state.projects, state.selectedProjectId]
  );

  const getDeliverablesByStage = useMemo(() => {
    const byStage = {};
    Object.entries(DELIVERABLE_LIBRARY).forEach(([id, del]) => {
      if (!byStage[del.stage]) byStage[del.stage] = {};
      if (!byStage[del.stage][del.area]) byStage[del.stage][del.area] = [];
      byStage[del.stage][del.area].push({ id, ...del });
    });
    return byStage;
  }, []);

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return -1; // Invalid
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    return diffDays;
  };

  const getAllItems = useMemo(() => {
    const items = [];
    state.projects.forEach(project => {
      Object.entries(DELIVERABLE_LIBRARY).forEach(([delivId, delivDef]) => {
        const key = `${project.id}-${delivId}`;
        const details = state.deliverables[key] || {};
        const duration = calculateDuration(details.startDate, details.endDate);
        
        items.push({
          projectId: project.id,
          projectName: project.name,
          projectGroup: project.group || 'Ungrouped',
          fuelType: project.fuelType,
          deliverableId: delivId,
          stage: delivDef.stage,
          area: delivDef.area,
          label: delivDef.label,
          owner: details.owner || '',
          startDate: details.startDate || '',
          endDate: details.endDate || '',
          duration,
          status: details.status || 'NOT_STARTED',
          completed: details.completed || false,
          comments: details.comments || ''
        });
      });
    });
    return items;
  }, [state.projects, state.deliverables]);

  const filteredItems = useMemo(() => {
    return getAllItems.filter(item => {
      const f = state.filters;
      if (f.owner && !item.owner.toLowerCase().includes(f.owner.toLowerCase())) return false;
      if (f.stage && item.stage !== f.stage) return false;
      if (f.group && item.projectGroup !== f.group) return false;
      if (f.inProgressOnly && item.status !== 'IN_PROGRESS') return false;
      if (f.completedOnly && !item.completed) return false;
      
      if (f.minDuration && item.duration !== null && item.duration >= 0) {
        if (item.duration < parseInt(f.minDuration)) return false;
      }
      if (f.maxDuration && item.duration !== null && item.duration >= 0) {
        if (item.duration > parseInt(f.maxDuration)) return false;
      }
      
      return true;
    });
  }, [getAllItems, state.filters]);

  const uniqueGroups = useMemo(() => {
    const groups = new Set(state.projects.map(p => p.group || 'Ungrouped'));
    return Array.from(groups).sort();
  }, [state.projects]);

  const analyticsData = useMemo(() => {
    const byStage = {};
    const byOwner = {};
    const byGroup = {};
    const byArea = {};
    
    filteredItems.forEach(item => {
      byStage[item.stage] = (byStage[item.stage] || 0) + 1;
      if (item.owner) byOwner[item.owner] = (byOwner[item.owner] || 0) + 1;
      byGroup[item.projectGroup] = (byGroup[item.projectGroup] || 0) + 1;
      byArea[item.area] = (byArea[item.area] || 0) + 1;
    });

    const completed = filteredItems.filter(i => i.completed).length;
    const inProgress = filteredItems.filter(i => i.status === 'IN_PROGRESS').length;
    const notStarted = filteredItems.length - completed - inProgress;

    return { total: filteredItems.length, completed, inProgress, notStarted, byStage, byOwner, byGroup, byArea };
  }, [filteredItems]);

  const exportToCSV = () => {
    const headers = ['Project Name', 'Project Group', 'Fuel Type', 'Stage', 'Management Area', 'Deliverable', 'Owner', 'Start Date', 'End Date', 'Duration Days', 'Status', 'Completed', 'Comments'];
    const escape = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
    
    const rows = filteredItems.map(item => [
      escape(item.projectName),
      escape(item.projectGroup),
      escape(item.fuelType),
      escape(item.stage),
      escape(item.area),
      escape(item.label),
      escape(item.owner),
      item.startDate,
      item.endDate,
      item.duration >= 0 ? item.duration : '',
      escape(item.status),
      item.completed ? 'Yes' : 'No',
      escape(item.comments)
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const data = { projects: state.projects, deliverables: state.deliverables, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `portfolio_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.projects && data.deliverables) {
          dispatch({ type: 'LOAD_DATA', payload: { ...state, ...data } });
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format');
        }
      } catch (err) {
        alert('Error importing file: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const addProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: `proj-${Date.now()}`,
        name: newProject.name,
        fuelType: newProject.fuelType,
        stage: newProject.stage,
        group: newProject.group || 'Ungrouped',
        dateCreated: new Date().toISOString().split('T')[0]
      };
      dispatch({ type: 'PROJECT_ADD', payload: project });
      setNewProject({ name: '', fuelType: 'Hydrogen', stage: 'Feasibility', group: '' });
      setShowAddProject(false);
    }
  };

  const getCompletionStats = (projectId, stage) => {
    const items = Object.entries(DELIVERABLE_LIBRARY)
      .filter(([id, def]) => def.stage === stage)
      .map(([id]) => id);
    
    const completed = items.filter(id => state.deliverables[`${projectId}-${id}`]?.completed).length;
    const total = items.length;
    
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getOverallCompletion = (projectId) => {
    const allItems = Object.keys(DELIVERABLE_LIBRARY);
    const completed = allItems.filter(id => state.deliverables[`${projectId}-${id}`]?.completed).length;
    return allItems.length > 0 ? Math.round((completed / allItems.length) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Renewable Energy Program Manager</h1>
              <p className="text-slate-600">Checklist for Portfolio Management</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'UI_TOGGLE_PANEL', payload: 'showFilters' })}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${state.ui.showFilters ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                <Filter size={20} />
                Filters
              </button>
              <button
                onClick={() => dispatch({ type: 'UI_TOGGLE_PANEL', payload: 'showAnalytics' })}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${state.ui.showAnalytics ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                <BarChart3 size={20} />
                Analytics
              </button>
              <button onClick={exportToCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Download size={20} />
                CSV
              </button>
              <button onClick={exportToJSON} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download size={20} />
                JSON
              </button>
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 cursor-pointer">
                <Upload size={20} />
                Import
                <input type="file" accept=".json" onChange={importFromJSON} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {state.ui.showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Filters</h2>
              <button onClick={() => dispatch({ type: 'FILTERS_CLEAR' })} className="text-sm text-blue-600 hover:text-blue-700">
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                <input
                  type="text"
                  value={state.filters.owner}
                  onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { owner: e.target.value } })}
                  placeholder="Search owner"
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
                <select
                  value={state.filters.stage}
                  onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { stage: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  <option value="">All Stages</option>
                  {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Group</label>
                <select
                  value={state.filters.group}
                  onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { group: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                >
                  <option value="">All Groups</option>
                  {uniqueGroups.map(group => <option key={group} value={group}>{group}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Min Days</label>
                <input
                  type="number"
                  value={state.filters.minDuration}
                  onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { minDuration: e.target.value } })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Days</label>
                <input
                  type="number"
                  value={state.filters.maxDuration}
                  onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { maxDuration: e.target.value } })}
                  placeholder="365"
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.filters.inProgressOnly}
                  onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { inProgressOnly: e.target.checked } })}
                />
                <span className="text-sm">In Progress Only</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.filters.completedOnly}
                  onChange={(e) => dispatch({ type: 'FILTERS_SET', payload: { completedOnly: e.target.checked } })}
                />
                <span className="text-sm">Completed Only</span>
              </label>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              Showing {filteredItems.length} of {getAllItems.length} items
            </div>
          </div>
        )}

        {state.ui.showAnalytics && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Portfolio Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total Items</div>
                <div className="text-3xl font-bold text-blue-900">{analyticsData.total}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Completed</div>
                <div className="text-3xl font-bold text-green-900">{analyticsData.completed}</div>
                <div className="text-xs text-green-600">
                  {analyticsData.total > 0 ? Math.round((analyticsData.completed / analyticsData.total) * 100) : 0}%
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">In Progress</div>
                <div className="text-3xl font-bold text-orange-900">{analyticsData.inProgress}</div>
                <div className="text-xs text-orange-600">
                  {analyticsData.total > 0 ? Math.round((analyticsData.inProgress / analyticsData.total) * 100) : 0}%
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-slate-600 font-medium">Not Started</div>
                <div className="text-3xl font-bold text-slate-900">{analyticsData.notStarted}</div>
                <div className="text-xs text-slate-600">
                  {analyticsData.total > 0 ? Math.round((analyticsData.notStarted / analyticsData.total) * 100) : 0}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">By Project Group</h3>
                <div className="space-y-2">
                  {Object.entries(analyticsData.byGroup).map(([group, count]) => (
                    <div key={group} className="flex justify-between">
                      <span className="text-sm text-slate-700">{group}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-3">By Stage</h3>
                <div className="space-y-2">
                  {Object.entries(analyticsData.byStage).map(([stage, count]) => (
                    <div key={stage} className="flex justify-between">
                      <span className="text-sm text-slate-700">{stage}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-3">By Management Area</h3>
                <div className="space-y-2">
                  {Object.entries(analyticsData.byArea).map(([area, count]) => (
                    <div key={area} className="flex justify-between">
                      <span className="text-sm text-slate-700">{area}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-3">By Owner</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(analyticsData.byOwner).length > 0 ? (
                    Object.entries(analyticsData.byOwner).map(([owner, count]) => (
                      <div key={owner} className="flex justify-between">
                        <span className="text-sm text-slate-700">{owner}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500 italic">No owners assigned</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Projects</h2>
                <button
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus size={20} />
                </button>
              </div>

              {showAddProject && (
                <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder="Project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
                  />
                  <select
                    value={newProject.fuelType}
                    onChange={(e) => setNewProject({ ...newProject, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
                  >
                    {FUEL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  <select
                    value={newProject.stage}
                    onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
                  >
                    {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder="Project group (optional)"
                    value={newProject.group}
                    onChange={(e) => setNewProject({ ...newProject, group: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={addProject} className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                      Add
                    </button>
                    <button onClick={() => setShowAddProject(false)} className="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded hover:bg-slate-400">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {state.projects.map(project => {
                  const completion = getOverallCompletion(project.id);
                  return (
                    <div
                      key={project.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer ${state.selectedProjectId === project.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                      onClick={() => dispatch({ type: 'PROJECT_SELECT', payload: project.id })}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Folder size={14} className="text-slate-500" />
                            <span className="text-xs text-slate-500">{project.group}</span>
                          </div>
                          <h3 className="font-semibold text-slate-800">{project.name}</h3>
                          <p className="text-sm text-slate-600">{project.fuelType}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); dispatch({ type: 'PROJECT_DELETE', payload: project.id }); }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-sm font-medium text-slate-700 mb-2">
                        Stage: {project.stage}
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${completion}%` }} />
                      </div>
                      <div className="text-xs text-slate-600 mt-1">{completion}% complete</div>
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
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedProject.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="font-medium">{selectedProject.fuelType}</span>
                    <span>•</span>
                    <select
                      value={selectedProject.stage}
                      onChange={(e) => dispatch({ type: 'PROJECT_UPDATE', payload: { id: selectedProject.id, updates: { stage: e.target.value } } })}
                      className="px-3 py-1 border border-slate-300 rounded font-medium"
                    >
                      {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {STAGES.map(stage => {
                    const stats = getCompletionStats(selectedProject.id, stage);
                    const isExpanded = state.ui.expandedStages[stage];
                    
                    return (
                      <div key={stage} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => dispatch({ type: 'UI_TOGGLE_STAGE', payload: stage })}
                          className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            <span className="font-semibold text-slate-800">{stage}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">{stats.completed}/{stats.total}</span>
                            <div className="w-24 bg-slate-300 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.percentage}%` }} />
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-4 space-y-3">
                            {MANAGEMENT_AREAS.map(area => {
                              const items = getDeliverablesByStage[stage]?.[area] || [];
                              if (items.length === 0) return null;
                              
                              const areaKey = `${stage}-${area}`;
                              const isAreaExpanded = state.ui.expandedAreas[areaKey];
                              const completedItems = items.filter(item => 
                                state.deliverables[`${selectedProject.id}-${item.id}`]?.completed
                              ).length;

                              return (
                                <div key={area} className="border border-slate-200 rounded">
                                  <button
                                    onClick={() => dispatch({ type: 'UI_TOGGLE_AREA', payload: areaKey })}
                                    className="w-full px-3 py-2 bg-white hover:bg-slate-50 flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      {isAreaExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                      <span className="font-medium text-slate-700">{area}</span>
                                    </div>
                                    <span className="text-sm text-slate-600">{completedItems}/{items.length}</span>
                                  </button>

                                  {isAreaExpanded && (
                                    <div className="px-3 py-2 bg-slate-50 space-y-3">
                                      {items.map(item => {
                                        const itemKey = `${selectedProject.id}-${item.id}`;
                                        const details = state.deliverables[itemKey] || {};
                                        const isEditing = state.ui.editingItem === itemKey;

                                        return (
                                          <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3">
                                            <div className="flex items-start gap-2 mb-2">
                                              <button
                                                onClick={() => dispatch({ type: 'DELIVERABLE_TOGGLE', payload: { projectId: selectedProject.id, deliverableId: item.id } })}
                                                className="mt-0.5"
                                              >
                                                {details.completed ? (
                                                  <CheckSquare size={18} className="text-green-600" />
                                                ) : (
                                                  <Square size={18} className="text-slate-400" />
                                                )}
                                              </button>
                                              <div className="flex-1">
                                                <span className={`text-sm font-medium ${details.completed ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                                                  {item.label}
                                                </span>
                                              </div>
                                              <button
                                                onClick={() => dispatch({ type: 'UI_SET_EDITING', payload: isEditing ? null : itemKey })}
                                                className="text-blue-600 hover:text-blue-700"
                                              >
                                                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                                              </button>
                                            </div>

                                            {isEditing && (
                                              <div className="mt-3 space-y-2 pl-6">
                                                <div>
                                                  <label className="block text-xs font-medium text-slate-600 mb-1">Owner</label>
                                                  <input
                                                    type="text"
                                                    value={details.owner || ''}
                                                    onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: item.id, updates: { owner: e.target.value } } })}
                                                    className="w-full px-2 py-1 text-sm border rounded"
                                                  />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                  <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                                                    <input
                                                      type="date"
                                                      value={details.startDate || ''}
                                                      onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: item.id, updates: { startDate: e.target.value } } })}
                                                      className="w-full px-2 py-1 text-sm border rounded"
                                                    />
                                                  </div>

                                                  <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                                                    <input
                                                      type="date"
                                                      value={details.endDate || ''}
                                                      onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: item.id, updates: { endDate: e.target.value } } })}
                                                      className="w-full px-2 py-1 text-sm border rounded"
                                                    />
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="flex items-center gap-2">
                                                    <input
                                                      type="checkbox"
                                                      checked={details.status === 'IN_PROGRESS'}
                                                      onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: item.id, updates: { status: e.target.checked ? 'IN_PROGRESS' : 'NOT_STARTED' } } })}
                                                    />
                                                    <span className="text-sm">In Progress</span>
                                                  </label>
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-medium text-slate-600 mb-1">Comments</label>
                                                  <textarea
                                                    value={details.comments || ''}
                                                    onChange={(e) => dispatch({ type: 'DELIVERABLE_UPDATE', payload: { projectId: selectedProject.id, deliverableId: item.id, updates: { comments: e.target.value } } })}
                                                    rows={2}
                                                    className="w-full px-2 py-1 text-sm border rounded resize-none"
                                                  />
                                                </div>
                                              </div>
                                            )}

                                            {!isEditing && (details.owner || details.startDate || details.endDate || details.status === 'IN_PROGRESS' || details.comments) && (
                                              <div className="mt-2 pl-6 text-xs text-slate-600 space-y-1">
                                                {details.owner && <div><span className="font-medium">Owner:</span> {details.owner}</div>}
                                                {(details.startDate || details.endDate) && (
                                                  <div><span className="font-medium">Dates:</span> {details.startDate || 'N/A'} to {details.endDate || 'N/A'}</div>
                                                )}
                                                {details.status === 'IN_PROGRESS' && <div className="text-orange-600 font-medium">⚡ In Progress</div>}
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