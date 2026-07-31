import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Mail, Tag, Users, Bell, Star } from 'lucide-react';
import { useMail } from '../../context/MailContext';

const getCategoryIcon = (iconName) => {
  const icons = {
    Inbox,
    Mail,
    Tag,
    Users,
    Bell,
    Star
  };
  return icons[iconName] || Inbox;
};

const getCategoryColor = (categoryId) => {
  const colors = {
    all: 'text-slate-350',
    primary: 'text-[#3CB4FF]',
    important: 'text-amber-400',
    announcements: 'text-emerald-450',
    others: 'text-purple-400'
  };
  return colors[categoryId] || colors.all;
};

const getCategoryBgColor = (categoryId, isActive) => {
  if (!isActive) return 'bg-transparent';
  const colors = {
    all: 'bg-white/10',
    primary: 'bg-[#3CB4FF]/10',
    important: 'bg-amber-400/10',
    announcements: 'bg-emerald-400/10',
    others: 'bg-purple-400/10'
  };
  return colors[categoryId] || colors.all;
};

const getCategoryBorderColor = (categoryId, isActive) => {
  if (!isActive) return 'border-transparent';
  const colors = {
    all: 'border-white/10',
    primary: 'border-[#3CB4FF]/30',
    important: 'border-amber-400/30',
    announcements: 'border-emerald-500/30',
    others: 'border-purple-400/30'
  };
  return colors[categoryId] || colors.all;
};

const CategoryTabs = () => {
  const { categories, selectedCategory, setSelectedCategory, emails, categorizeEmail } = useMail();

  // Count emails per category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return emails.length;
    return emails.filter(email => categorizeEmail(email) === categoryId).length;
  };

  return (
    <div className="px-5 py-3 border-b border-slate-800/80 bg-transparent shrink-0">
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.icon);
          const isActive = selectedCategory === category.id;
          const count = getCategoryCount(category.id);

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer border
                ${isActive 
                  ? `${getCategoryBgColor(category.id, true)} ${getCategoryColor(category.id)} ${getCategoryBorderColor(category.id, true)} shadow-[0_4px_16px_rgba(60,180,255,0.12)] backdrop-blur-sm` 
                  : 'text-slate-400 hover:text-slate-250 bg-slate-950/20 border-slate-850 hover:bg-white/[0.04] hover:border-slate-750/70'
                }`}
            >
              <Icon size={14} className={isActive ? '' : 'opacity-50'} />
              <span>{category.label}</span>
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md
                  ${isActive 
                    ? 'bg-black/40 text-white' 
                    : 'bg-white/5 text-slate-500'
                  }`}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
