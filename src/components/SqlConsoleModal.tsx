import React, { useState } from 'react';
import { db, MYSQL_SCHEMA_DEFINITIONS } from '../db/sqlDatabase';
import {
  Database,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Table as TableIcon,
  Code2,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

interface SqlConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataModified?: () => void;
}

const PRESET_QUERIES = [
  {
    name: 'Farmer & Crop Join',
    desc: 'Retrieve crops with farmer and farm location details',
    sql: `SELECT 
  c.id, 
  c.crop_name, 
  c.category, 
  c.price_per_kg, 
  c.stock_quantity_kg, 
  f.farm_name, 
  f.farm_location, 
  f.rating
FROM crops c
JOIN farmers f ON c.farmer_id = f.id
ORDER BY c.price_per_kg ASC;`
  },
  {
    name: 'Orders & Escrow Status',
    desc: 'Audit orders, payment methods, and escrow lock status',
    sql: `SELECT 
  o.order_number, 
  o.consumer_name, 
  o.farmer_name, 
  o.total_amount, 
  o.status, 
  o.payment_status, 
  o.payment_method, 
  o.order_date
FROM orders o
ORDER BY o.id DESC;`
  },
  {
    name: 'APMC Mandi Comparison',
    desc: 'Compare direct farmer price against wholesale APMC Mandi benchmark',
    sql: `SELECT 
  c.crop_name, 
  c.price_per_kg AS direct_farmer_price, 
  m.modal_price AS apmc_mandi_price, 
  (c.price_per_kg - m.modal_price) AS price_delta, 
  m.mandi_name
FROM crops c
LEFT JOIN market_prices m ON c.crop_name LIKE ('%' + m.crop_name + '%');`
  },
  {
    name: 'High-Stock Inventory',
    desc: 'Query organic harvest batches with >200kg available',
    sql: `SELECT 
  crop_name, 
  category, 
  variety, 
  stock_quantity_kg, 
  price_per_kg, 
  harvest_date
FROM crops
WHERE stock_quantity_kg >= 200 AND organic_certified = TRUE
ORDER BY stock_quantity_kg DESC;`
  },
  {
    name: 'Customer Reviews & Ratings',
    desc: 'Query verified consumer 1-5 star ratings and written reviews',
    sql: `SELECT 
  r.id, 
  r.farmer_name, 
  r.consumer_name, 
  r.rating, 
  r.comment, 
  r.created_at
FROM reviews r
ORDER BY r.id DESC;`
  },
  {
    name: 'Insert New Crop Listing',
    desc: 'Add a new harvest row into crops table via SQL INSERT',
    sql: `INSERT INTO crops (farmer_id, farmer_name, farm_name, location, crop_name, category, variety, price_per_kg, stock_quantity_kg, harvest_date, shelf_life_days, organic_certified, image_url, description, min_order_kg, status)
VALUES (1, 'Ramesh Patel', 'GreenValley Organic Sanctuary', 'Karjat, Maharashtra', 'Organic Red Onions', 'Vegetables', 'Nasik Red Globe', 28, 500, '2026-10-29', 30, TRUE, '/src/assets/images/crop_fresh_produce_basket_1793338568630.jpg', 'Pungent, dry-cured organic red onions directly from Nasik organic cooperative.', 5, 'available');`
  }
];

export const SqlConsoleModal: React.FC<SqlConsoleModalProps> = ({
  isOpen,
  onClose,
  onDataModified
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'schema' | 'dump'>('console');
  const [query, setQuery] = useState(PRESET_QUERIES[0].sql);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [results, setResults] = useState<{
    success: boolean;
    data?: any[];
    columns?: string[];
    error?: string;
    executionTimeMs: number;
    affectedRows?: number;
  } | null>(() => db.executeRawSQL(PRESET_QUERIES[0].sql));

  const [copied, setCopied] = useState(false);
  const [selectedSchemaTable, setSelectedSchemaTable] = useState('crops');

  if (!isOpen) return null;

  const handleRunQuery = () => {
    const res = db.executeRawSQL(query);
    setResults(res);
    if (res.success && onDataModified) {
      onDataModified();
    }
  };

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    const chosen = PRESET_QUERIES[index].sql;
    setQuery(chosen);
    const res = db.executeRawSQL(chosen);
    setResults(res);
  };

  const handleExportSQL = () => {
    const dump = db.exportMySQLDump();
    const blob = new Blob([dump], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agriconnect_schema_dump_${new Date().toISOString().substring(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!results?.data || results.data.length === 0) return;
    const cols = results.columns || Object.keys(results.data[0]);
    let csv = cols.join(',') + '\n';
    results.data.forEach(row => {
      const line = cols.map(c => `"${String(row[c] ?? '').replace(/"/g, '""')}"`).join(',');
      csv += line + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agriconnect_query_result_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between gap-4 bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-white">
                  MySQL Relational Database Console & Inspector
                </h2>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-800">
                  Engine: MySQL 8.0 DDL Compatible
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Execute structured queries, inspect schemas, and verify real-time data persistence.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSQL}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download MySQL .sql schema and seed file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .sql</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-stone-950 border-b border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'console'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Interactive SQL Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'schema'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Relational Schema & Foreign Keys</span>
          </button>
          <button
            onClick={() => setActiveTab('dump')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'dump'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Full MySQL Dump Preview</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'console' && (
            <div className="space-y-5">
              {/* Preset Queries Bar */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Sample SQL Queries:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_QUERIES.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetSelect(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        selectedPreset === idx
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* SQL Editor Area */}
              <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-500" />
                    SQL Editor (SELECT, INSERT, UPDATE, DELETE, JOIN)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyQuery}
                      className="text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      title="Copy SQL"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleRunQuery}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Execute Query (Ctrl+Enter)</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      handleRunQuery();
                    }
                  }}
                  rows={6}
                  className="w-full p-4 bg-stone-950 font-mono text-sm text-emerald-300 focus:outline-none resize-y selection:bg-emerald-900"
                  spellCheck={false}
                />
              </div>

              {/* Execution Feedback Bar */}
              {results && (
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-3">
                    {results.success ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        Query OK ({results.affectedRows ?? results.data?.length ?? 0} rows affected)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        Execution Error
                      </span>
                    )}
                    <span className="text-stone-400 flex items-center gap-1 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      {results.executionTimeMs} ms
                    </span>
                  </div>

                  {results.success && results.data && results.data.length > 0 && (
                    <button
                      onClick={handleExportCSV}
                      className="text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV</span>
                    </button>
                  )}
                </div>
              )}

              {/* Error Box if any */}
              {results && !results.success && (
                <div className="bg-rose-950/40 border border-rose-800 rounded-xl p-4 text-xs font-mono text-rose-300">
                  {results.error}
                </div>
              )}

              {/* Results Table */}
              {results && results.success && results.data && (
                <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden shadow-inner">
                  <div className="max-h-80 overflow-auto">
                    {results.data.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-500 font-mono">
                        Empty set (0 records returned)
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs font-mono border-collapse">
                        <thead className="bg-stone-900 text-stone-300 sticky top-0 border-b border-stone-800">
                          <tr>
                            {(results.columns || Object.keys(results.data[0])).map((col, cIdx) => (
                              <th key={cIdx} className="px-4 py-2.5 font-semibold text-emerald-400 whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800 text-stone-200">
                          {results.data.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-stone-900/60 transition-colors">
                              {(results.columns || Object.keys(row)).map((col, cIdx) => (
                                <td key={cIdx} className="px-4 py-2 whitespace-nowrap tabular-nums max-w-xs truncate">
                                  {typeof row[col] === 'boolean'
                                    ? row[col] ? 'TRUE' : 'FALSE'
                                    : row[col] === null || row[col] === undefined
                                    ? <span className="text-stone-600">NULL</span>
                                    : String(row[col])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Tables List */}
              <div className="lg:col-span-4 space-y-2">
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Relational Tables (MySQL Database `agriconnect`):
                </label>
                <div className="space-y-1.5">
                  {MYSQL_SCHEMA_DEFINITIONS.map(tbl => (
                    <button
                      key={tbl.tableName}
                      onClick={() => setSelectedSchemaTable(tbl.tableName)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        selectedSchemaTable === tbl.tableName
                          ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200 shadow-sm'
                          : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <div>
                        <div className="font-mono font-bold text-stone-100 flex items-center gap-1.5">
                          <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
                          {tbl.tableName}
                        </div>
                        <div className="text-[11px] text-stone-400 truncate max-w-[200px] mt-0.5">
                          {tbl.description}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Table Column Inspector */}
              <div className="lg:col-span-8 bg-stone-950 rounded-xl border border-stone-800 p-5 space-y-4">
                {(() => {
                  const table = MYSQL_SCHEMA_DEFINITIONS.find(t => t.tableName === selectedSchemaTable);
                  if (!table) return null;
                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-mono text-base font-bold text-emerald-400 flex items-center gap-2">
                          <span>{table.tableName}</span>
                          <span className="text-xs text-stone-400 font-sans font-normal">
                            ({table.columns.length} columns)
                          </span>
                        </h3>
                        <p className="text-xs text-stone-300 mt-1">{table.description}</p>
                      </div>

                      <div className="overflow-x-auto border border-stone-800 rounded-lg">
                        <table className="w-full text-left text-xs font-mono border-collapse">
                          <thead className="bg-stone-900 text-stone-400 border-b border-stone-800">
                            <tr>
                              <th className="px-3 py-2 font-semibold">Column</th>
                              <th className="px-3 py-2 font-semibold">Data Type</th>
                              <th className="px-3 py-2 font-semibold">Key Constraints</th>
                              <th className="px-3 py-2 font-semibold font-sans">Semantic Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800/80 text-stone-300">
                            {table.columns.map((c, idx) => (
                              <tr key={idx} className="hover:bg-stone-900/40">
                                <td className="px-3 py-2 font-bold text-stone-100">{c.name}</td>
                                <td className="px-3 py-2 text-emerald-400">{c.type}</td>
                                <td className="px-3 py-2">
                                  {c.isPrimary && (
                                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded mr-1">
                                      PRIMARY KEY
                                    </span>
                                  )}
                                  {c.isForeign && (
                                    <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded">
                                      FK → {c.references}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-stone-400 font-sans">{c.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {activeTab === 'dump' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  Ready-to-use MySQL 8.0 schema and data statements (can be imported directly via `mysql -u root -p agriconnect &lt; dump.sql`):
                </span>
                <button
                  onClick={handleExportSQL}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql File</span>
                </button>
              </div>
              <div className="bg-stone-950 rounded-xl border border-stone-800 p-4 font-mono text-xs text-emerald-300/90 max-h-96 overflow-auto">
                <pre>{db.exportMySQLDump()}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
