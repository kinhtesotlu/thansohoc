/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, User, ArrowRight, Info, Lock, Star, Moon, Sun, Settings, X, ExternalLink, Eye, EyeOff, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import { calculateLifePath, calculateNameNumbers, calculatePersonalYear, calculatePinnacles, calculateChallenges, calculateBirthChart } from './utils/numerology';
import { getNumerologyReading, NumerologyData } from './services/geminiService';
import { AI_PROVIDERS, AIProvider, AISettings, loadAISettings, saveAISettings } from './utils/aiProviders';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type System = 'pythagorean' | 'chaldean' | 'kabbalah';

// ─── Settings Panel ───────────────────────────────────────────────
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<AISettings>(loadAISettings);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentProvider = AI_PROVIDERS.find(p => p.id === settings.providerId)!;

  const handleProviderChange = (provider: AIProvider) => {
    setSettings({
      providerId: provider.id,
      apiKey: '',
      model: provider.defaultModel,
    });
    setSaved(false);
  };

  const handleSave = () => {
    saveAISettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-[#0f0e17] border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-serif">Cài đặt AI</h2>
              <p className="text-xs text-stone-500">Chọn nhà cung cấp và nhập API Key</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provider Selection */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-3">Chọn nhà cung cấp AI</label>
          <div className="grid grid-cols-3 gap-3">
            {AI_PROVIDERS.map(provider => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 text-center",
                  settings.providerId === provider.id
                    ? "border-orange-500 bg-orange-500/10 text-white"
                    : "border-white/10 bg-white/5 text-stone-400 hover:border-white/20 hover:text-stone-200"
                )}
              >
                <span className="text-2xl">{provider.logo}</span>
                <span className="text-xs font-medium leading-tight">{provider.name}</span>
                <span className="text-[10px] text-stone-500 leading-tight">{provider.freeInfo}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Provider Description */}
        <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-sm text-stone-400 leading-relaxed">{currentProvider.description}</p>
          <a
            href={currentProvider.getKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Lấy API Key miễn phí →
          </a>
        </div>

        {/* Model Selection */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Model AI</label>
          <select
            value={settings.model}
            onChange={e => setSettings(s => ({ ...s, model: e.target.value }))}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
          >
            {currentProvider.models.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={settings.apiKey}
              onChange={e => { setSettings(s => ({ ...s, apiKey: e.target.value })); setSaved(false); }}
              placeholder={currentProvider.keyPlaceholder}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm font-mono focus:outline-none focus:border-orange-500/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowKey(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-stone-600 mt-1.5 ml-1">Key được lưu trên trình duyệt của bạn, không gửi đi đâu.</p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={cn(
            "w-full rounded-2xl py-3.5 font-medium transition-all flex items-center justify-center gap-2",
            saved
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          )}
        >
          {saved ? (
            <><Check className="w-4 h-4" /> Đã lưu!</>
          ) : (
            "Lưu cài đặt"
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [targetYear, setTargetYear] = useState(new Date().getFullYear().toString());
  const [activeSystem, setActiveSystem] = useState<System>('pythagorean');
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [results, setResults] = useState<NumerologyData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>(loadAISettings);

  // Reload settings when modal closes
  const handleSettingsClose = () => {
    setShowSettings(false);
    setAiSettings(loadAISettings());
  };

  const currentProvider = AI_PROVIDERS.find(p => p.id === aiSettings.providerId);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthday) return;

    if (!aiSettings.apiKey) {
      setShowSettings(true);
      return;
    }

    setLoading(true);
    setReading(null);

    const lifePath = calculateLifePath(birthday);
    const nameNumbers = calculateNameNumbers(name);
    const personalYear = calculatePersonalYear(birthday, parseInt(targetYear));
    const pinnacles = calculatePinnacles(birthday, lifePath);
    const challenges = calculateChallenges(birthday);
    const birthChart = calculateBirthChart(birthday);

    const data: NumerologyData = {
      name,
      birthday,
      lifePath,
      personalYear,
      targetYear: parseInt(targetYear),
      pinnacles,
      challenges,
      birthChart,
      nameChart: nameNumbers.nameCounts,
      ...nameNumbers,
    };

    setResults(data);

    try {
      const aiReading = await getNumerologyReading(data, aiSettings);
      setReading(aiReading || "Không thể tải nội dung giải mã.");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Có lỗi xảy ra khi kết nối với AI.";
      setReading(`❌ **Lỗi:** ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && <SettingsPanel onClose={handleSettingsClose} />}
      </AnimatePresence>

      {/* Header */}
      <header className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-xs uppercase tracking-widest font-medium text-orange-200">Aura Numerology</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-4 bg-gradient-to-b from-white to-stone-500 bg-clip-text text-transparent">
          Giải Mã Bản Thể
        </h1>
        <p className="text-stone-400 max-w-lg mx-auto text-lg">
          Khám phá những rung động ẩn giấu qua các con số và thấu hiểu vận mệnh của bạn.
        </p>
      </header>

      {/* Navigation Menu */}
      <nav className="flex justify-center gap-2 mb-12">
        {(['pythagorean', 'chaldean', 'kabbalah'] as System[]).map((sys) => (
          <button
            key={sys}
            onClick={() => sys === 'pythagorean' && setActiveSystem(sys)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
              activeSystem === sys 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "glass text-stone-400 hover:text-stone-200",
              sys !== 'pythagorean' && "cursor-not-allowed opacity-60"
            )}
          >
            {sys.charAt(0).toUpperCase() + sys.slice(1)}
            {sys !== 'pythagorean' && <Lock className="w-3 h-3" />}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-8 sticky top-8"
          >
            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-orange-400" />
              Thông tin cá nhân
            </h2>
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 ml-1">Họ và tên đầy đủ</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyen Van A"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500/50 transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 ml-1">Ngày tháng năm sinh</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500/50 transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 ml-1">Xem cho năm nào?</label>
                <div className="relative">
                  <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="number"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    placeholder="VD: 2026"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500/50 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* AI Provider Badge */}
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currentProvider?.logo}</span>
                  <div className="text-left">
                    <div className="text-xs font-medium text-stone-300">{currentProvider?.name}</div>
                    <div className="text-[10px] text-stone-600">
                      {aiSettings.apiKey ? `Model: ${aiSettings.model.split('/').pop()?.replace(':free','')}` : '⚠️ Chưa có API Key'}
                    </div>
                  </div>
                </div>
                <Settings className="w-4 h-4 text-stone-500 group-hover:text-orange-400 transition-colors" />
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-4 font-medium transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? "Đang giải mã..." : "Bắt đầu giải mã"}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!results && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-3xl border-dashed"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-orange-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-serif mb-2">Sẵn sàng khám phá?</h3>
                <p className="text-stone-500">Nhập thông tin của bạn để bắt đầu hành trình tìm hiểu bản thân qua các con số.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 glass rounded-3xl"
              >
                <div className="relative w-24 h-24 mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-orange-500/20 border-t-orange-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Moon className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
                <h3 className="text-xl font-serif mb-2">Đang kết nối với các vì sao...</h3>
                <p className="text-stone-500">
                  {currentProvider?.logo} {currentProvider?.name} đang phân tích các tần số rung động của bạn.
                </p>
              </motion.div>
            )}

            {results && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[
                    { label: 'Chủ Đạo', value: results.lifePath, icon: Sun, desc: 'Tổng Ngày + Tháng + Năm sinh' },
                    { label: 'Sứ Mệnh', value: results.expression, icon: Star, desc: 'Tổng tất cả chữ cái trong tên' },
                    { label: 'Linh Hồn', value: results.soulUrge, icon: Moon, desc: 'Tổng các nguyên âm trong tên' },
                    { label: 'Nhân Cách', value: results.personality, icon: User, desc: 'Tổng các phụ âm trong tên' },
                    { label: `Năm ${results.targetYear}`, value: results.personalYear, icon: Calendar, desc: 'Ngày + Tháng sinh + Năm hiện tại' },
                  ].map((stat, i) => (
                    <div key={i} className="glass rounded-2xl p-4 text-center group relative">
                      <stat.icon className="w-4 h-4 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-serif text-white mb-1">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-stone-500">{stat.label}</div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-black/90 text-[9px] text-stone-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-20">
                        {stat.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Birth Chart */}
                  <div className="glass rounded-3xl p-8">
                    <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-400" />
                      Biểu Đồ Ngày Sinh
                    </h3>
                    <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto aspect-square border-2 border-white/5 p-2 rounded-xl">
                      {[3, 6, 9, 2, 5, 8, 1, 4, 7].map((num) => (
                        <div key={num} className="flex flex-col items-center justify-center border border-white/5 rounded-lg bg-white/5">
                          <span className="text-[10px] text-stone-600 mb-1">{num}</span>
                          <span className="text-sm font-bold text-orange-400">
                            {Array(results.birthChart[num] || 0).fill(num).join('')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Name Chart */}
                  <div className="glass rounded-3xl p-8">
                    <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-400" />
                      Biểu Đồ Tên
                    </h3>
                    <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto aspect-square border-2 border-white/5 p-2 rounded-xl">
                      {[3, 6, 9, 2, 5, 8, 1, 4, 7].map((num) => (
                        <div key={num} className="flex flex-col items-center justify-center border border-white/5 rounded-lg bg-white/5">
                          <span className="text-[10px] text-stone-600 mb-1">{num}</span>
                          <span className="text-sm font-bold text-orange-400">
                            {Array(results.nameChart[num] || 0).fill(num).join('')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pyramid Visualization */}
                <div className="glass rounded-3xl p-8 overflow-hidden">
                  <h3 className="text-xl font-serif mb-8 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    Bản Đồ Kim Tự Tháp
                  </h3>
                  
                  <div className="relative max-w-md mx-auto aspect-[4/3] mb-12">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                      <path d="M50 250 L200 50 L350 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                      <path d="M50 250 L200 150 L350 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                      
                      <g className="pinnacles">
                        <circle cx="200" cy="50" r="18" className="fill-orange-500/20 stroke-orange-500" />
                        <text x="200" y="55" textAnchor="middle" className="fill-white font-serif text-sm font-bold">{results.pinnacles[3].value}</text>
                        <text x="200" y="25" textAnchor="middle" className="fill-stone-500 text-[8px] uppercase">Đỉnh 4</text>

                        <circle cx="200" cy="150" r="18" className="fill-orange-500/20 stroke-orange-500" />
                        <text x="200" y="155" textAnchor="middle" className="fill-white font-serif text-sm font-bold">{results.pinnacles[2].value}</text>
                        <text x="200" y="125" textAnchor="middle" className="fill-stone-500 text-[8px] uppercase">Đỉnh 3</text>

                        <circle cx="125" cy="200" r="18" className="fill-orange-500/20 stroke-orange-500" />
                        <text x="125" y="205" textAnchor="middle" className="fill-white font-serif text-sm font-bold">{results.pinnacles[0].value}</text>
                        <text x="125" y="175" textAnchor="middle" className="fill-stone-500 text-[8px] uppercase">Đỉnh 1</text>

                        <circle cx="275" cy="200" r="18" className="fill-orange-500/20 stroke-orange-500" />
                        <text x="275" y="205" textAnchor="middle" className="fill-white font-serif text-sm font-bold">{results.pinnacles[1].value}</text>
                        <text x="275" y="175" textAnchor="middle" className="fill-stone-500 text-[8px] uppercase">Đỉnh 2</text>
                      </g>

                      <g className="challenges">
                        <rect x="110" y="235" width="30" height="20" rx="4" className="fill-red-500/10 stroke-red-500/40" />
                        <text x="125" y="249" textAnchor="middle" className="fill-red-400 text-xs font-bold">{results.challenges[0].value}</text>
                        <text x="125" y="265" textAnchor="middle" className="fill-stone-600 text-[7px] uppercase">Thử thách 1</text>

                        <rect x="260" y="235" width="30" height="20" rx="4" className="fill-red-500/10 stroke-red-500/40" />
                        <text x="275" y="249" textAnchor="middle" className="fill-red-400 text-xs font-bold">{results.challenges[1].value}</text>
                        <text x="275" y="265" textAnchor="middle" className="fill-stone-600 text-[7px] uppercase">Thử thách 2</text>

                        <rect x="185" y="235" width="30" height="20" rx="4" className="fill-red-500/10 stroke-red-500/40" />
                        <text x="200" y="249" textAnchor="middle" className="fill-red-400 text-xs font-bold">{results.challenges[2].value}</text>
                        <text x="200" y="265" textAnchor="middle" className="fill-stone-600 text-[7px] uppercase">Thử thách 3</text>

                        <rect x="185" y="80" width="30" height="20" rx="4" className="fill-red-500/10 stroke-red-500/40" />
                        <text x="200" y="94" textAnchor="middle" className="fill-red-400 text-xs font-bold">{results.challenges[3].value}</text>
                        <text x="200" y="110" textAnchor="middle" className="fill-stone-600 text-[7px] uppercase">Thử thách 4</text>
                      </g>
                    </svg>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-widest text-orange-400 font-bold">Cách tính Đỉnh cao</h4>
                      <ul className="text-[10px] text-stone-500 space-y-1">
                        <li>• Đỉnh 1: Tháng + Ngày sinh</li>
                        <li>• Đỉnh 2: Ngày + Năm sinh</li>
                        <li>• Đỉnh 3: Đỉnh 1 + Đỉnh 2</li>
                        <li>• Đỉnh 4: Tháng + Năm sinh</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-widest text-red-400 font-bold">Cách tính Thử thách</h4>
                      <ul className="text-[10px] text-stone-500 space-y-1">
                        <li>• Thử thách 1: |Tháng - Ngày sinh|</li>
                        <li>• Thử thách 2: |Ngày - Năm sinh|</li>
                        <li>• Thử thách 3: |Thử thách 1 - Thử thách 2|</li>
                        <li>• Thử thách 4: |Tháng - Năm sinh|</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Reading */}
                <div className="glass rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-lg">{currentProvider?.logo ?? '✨'}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif">Lời Giải Mã Từ AI</h3>
                      <p className="text-xs text-stone-500">Bởi {currentProvider?.name} • Hệ thống Pitago</p>
                    </div>
                  </div>
                  
                  <div className="markdown-body">
                    {reading ? (
                      <Markdown>{reading}</Markdown>
                    ) : (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                        <div className="h-4 bg-white/5 rounded w-full"></div>
                        <div className="h-4 bg-white/5 rounded w-5/6"></div>
                        <div className="h-4 bg-white/5 rounded w-2/3"></div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/5 text-center text-stone-600 text-sm">
        <p>© 2026 Aura Numerology. All rights reserved.</p>
        <p className="mt-1">Hệ thống Chaldean & Kabbalah đang được phát triển.</p>
      </footer>
    </div>
  );
}
