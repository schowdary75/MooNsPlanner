import { BookOpen, Bug, ExternalLink, Info, Lightbulb } from 'lucide-react';
import React from 'react';
import { useTranslation } from '../../i18n';
import Section from './Section';

interface Props {
  appVersion: string;
}

export default function AboutTab({ appVersion }: Props): React.ReactElement {
  const { t, locale } = useTranslation();

  return (
    <Section title={t('settings.about')} icon={Info}>
      <style>{`
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
      <p
        className="text-content-secondary"
        style={{ fontSize: 'calc(13px * var(--fs-scale-body, 1))', lineHeight: 1.6, marginBottom: 6, marginTop: -4 }}
      >
        MooNs — Self-hosted travel planning and exploration platform.
      </p>
      <p
        className="text-content-faint"
        style={{ fontSize: 'calc(12px * var(--fs-scale-body, 1))', lineHeight: 1.6, marginBottom: 16 }}
      >
        MooNs Travel Kit{' '}
        <span
          className="bg-surface-tertiary text-content-faint"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 99,
            padding: '1px 7px',
            fontSize: 'calc(10px * var(--fs-scale-caption, 1))',
            fontWeight: 600,
            verticalAlign: '1px',
          }}
        >
          v{appVersion}
        </span>
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <a
          href="https://github.com/schowdary75/MooNsPlanner/issues/new?template=bug_report.yml"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 overflow-hidden rounded-xl border border-edge bg-surface-card px-5 py-4 no-underline transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.boxShadow = '0 0 0 1px #ef444422';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            className="bg-[#ef444415]"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Bug size={20} className="text-[#ef4444]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-content">{t('settings.about.reportBug')}</div>
            <div className="text-xs text-content-faint">{t('settings.about.reportBugHint')}</div>
          </div>
          <ExternalLink size={14} className="ml-auto flex-shrink-0 text-content-faint" />
        </a>
        <a
          href="https://github.com/schowdary75/MooNsPlanner/discussions/new?category=feature-requests"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 overflow-hidden rounded-xl border border-edge bg-surface-card px-5 py-4 no-underline transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f59e0b';
            e.currentTarget.style.boxShadow = '0 0 0 1px #f59e0b22';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            className="bg-[#f59e0b15]"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Lightbulb size={20} className="text-[#f59e0b]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-content">{t('settings.about.featureRequest')}</div>
            <div className="text-xs text-content-faint">{t('settings.about.featureRequestHint')}</div>
          </div>
          <ExternalLink size={14} className="ml-auto flex-shrink-0 text-content-faint" />
        </a>
        <a
          href="https://github.com/schowdary75/MooNsPlanner/wiki"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 overflow-hidden rounded-xl border border-edge bg-surface-card px-5 py-4 no-underline transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#6366f1';
            e.currentTarget.style.boxShadow = '0 0 0 1px #6366f122';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            className="bg-[#6366f115]"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookOpen size={20} className="text-[#6366f1]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-content">Wiki</div>
            <div className="text-xs text-content-faint">{t('settings.about.wikiHint')}</div>
          </div>
          <ExternalLink size={14} className="ml-auto flex-shrink-0 text-content-faint" />
        </a>
      </div>
    </Section>
  );
}
