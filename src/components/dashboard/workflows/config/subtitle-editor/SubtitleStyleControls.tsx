/**
 * SubtitleStyleControls
 * Grouped style controls for the visual subtitle editor.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight } from 'lucide-react'

const INPUT_CLASS =
  'w-full rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-text-secondary outline-none transition-colors duration-150 focus:border-border-focus'

const FONT_OPTIONS = [
  'Arial',
  'Arial Black',
  'Helvetica',
  'Impact',
  'Verdana',
  'Futura',
  'Comic Sans MS',
]

const TEXT_COLOR_OPTIONS = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Yellow', value: '#FFFF00' },
  { label: 'Cyan', value: '#00FFFF' },
  { label: 'Green', value: '#00FF00' },
  { label: 'Red', value: '#FF0000' },
  { label: 'Orange', value: '#FF8800' },
  { label: 'Pink', value: '#FF69B4' },
]

const OUTLINE_COLOR_OPTIONS = [
  { label: 'Black', value: '#000000' },
  { label: 'Dark Gray', value: '#333333' },
  { label: 'Dark Blue', value: '#000066' },
  { label: 'Dark Red', value: '#660000' },
  { label: 'None', value: '#00000000' },
]

const HIGHLIGHT_COLOR_OPTIONS = [
  { label: 'Yellow', value: '#FFFF00' },
  { label: 'Cyan', value: '#00FFFF' },
  { label: 'Green', value: '#00FF00' },
  { label: 'Red', value: '#FF0000' },
  { label: 'Orange', value: '#FF8800' },
  { label: 'Pink', value: '#FF69B4' },
  { label: 'White', value: '#FFFFFF' },
]

interface SubtitleStyleControlsProps {
  fontName: string
  fontSize: number
  textColor: string
  outlineColor: string
  outlineWidth: number
  bold: boolean
  uppercase: boolean
  backgroundBox: boolean
  animationStyle: string
  highlightColor: string
  highlightScale: number
  maxWordsPerGroup: number
  onChange: (key: string, value: unknown) => void
}

export function SubtitleStyleControls({
  fontName,
  fontSize,
  textColor,
  outlineColor,
  outlineWidth,
  bold,
  uppercase,
  backgroundBox,
  animationStyle,
  highlightColor,
  highlightScale,
  maxWordsPerGroup,
  onChange,
}: SubtitleStyleControlsProps) {
  const { t } = useTranslation()
  const prefix = 'dashboard.workflows.editor.subtitleEditor'

  return (
    <div className="flex flex-col gap-3">
      {/* Typography */}
      <CollapsibleGroup labelKey={`${prefix}.typography`} defaultOpen>
        <div className="flex flex-col gap-3">
          {/* Font */}
          <FieldRow labelKey={`${prefix}.font`}>
            <select
              value={fontName}
              onChange={(e) => onChange('font_name', e.target.value)}
              className={INPUT_CLASS}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </FieldRow>

          {/* Font Size */}
          <FieldRow labelKey={`${prefix}.fontSize`}>
            <input
              type="number"
              value={fontSize}
              min={8}
              max={72}
              onChange={(e) => onChange('font_size', Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </FieldRow>

          {/* Bold + Uppercase toggles */}
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={bold}
                onChange={(e) => onChange('bold', e.target.checked)}
                className="h-4 w-4 rounded"
                style={{ accentColor: '#8b5cf6' }}
              />
              <span className="text-text-secondary text-sm">{t(`${prefix}.bold`)}</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => onChange('uppercase', e.target.checked)}
                className="h-4 w-4 rounded"
                style={{ accentColor: '#8b5cf6' }}
              />
              <span className="text-text-secondary text-sm">{t(`${prefix}.uppercase`)}</span>
            </label>
          </div>
        </div>
      </CollapsibleGroup>

      {/* Colors */}
      <CollapsibleGroup labelKey={`${prefix}.colors`}>
        <div className="flex flex-col gap-3">
          {/* Text Color */}
          <FieldRow labelKey={`${prefix}.textColor`}>
            <ColorSwatches
              options={TEXT_COLOR_OPTIONS}
              selected={textColor}
              onSelect={(v) => onChange('text_color', v)}
            />
          </FieldRow>

          {/* Outline Color */}
          <FieldRow labelKey={`${prefix}.outlineColor`}>
            <ColorSwatches
              options={OUTLINE_COLOR_OPTIONS}
              selected={outlineColor}
              onSelect={(v) => onChange('outline_color', v)}
            />
          </FieldRow>

          {/* Outline Width */}
          <FieldRow labelKey={`${prefix}.outlineWidth`}>
            <input
              type="number"
              value={outlineWidth}
              min={0}
              max={8}
              onChange={(e) => onChange('outline_width', Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </FieldRow>
        </div>
      </CollapsibleGroup>

      {/* Background */}
      <CollapsibleGroup labelKey={`${prefix}.background`}>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={backgroundBox}
            onChange={(e) => onChange('background_box', e.target.checked)}
            className="h-4 w-4 rounded"
            style={{ accentColor: '#8b5cf6' }}
          />
          <span className="text-text-secondary text-sm">{t(`${prefix}.backgroundBox`)}</span>
        </label>
      </CollapsibleGroup>

      {/* Animation */}
      <CollapsibleGroup labelKey={`${prefix}.animation`}>
        <div className="flex flex-col gap-3">
          <FieldRow labelKey={`${prefix}.animationStyle`}>
            <select
              value={animationStyle}
              onChange={(e) => onChange('animation_style', e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="static">{t(`${prefix}.animationStatic`)}</option>
              <option value="dynamic">{t(`${prefix}.animationDynamic`)}</option>
            </select>
          </FieldRow>

          {animationStyle === 'dynamic' && (
            <>
              <FieldRow labelKey={`${prefix}.highlightColor`}>
                <ColorSwatches
                  options={HIGHLIGHT_COLOR_OPTIONS}
                  selected={highlightColor}
                  onSelect={(v) => onChange('highlight_color', v)}
                />
              </FieldRow>

              <FieldRow labelKey={`${prefix}.highlightScale`}>
                <input
                  type="number"
                  value={highlightScale}
                  min={1.0}
                  max={2.0}
                  step={0.05}
                  onChange={(e) => onChange('highlight_scale', Number(e.target.value))}
                  className={INPUT_CLASS}
                />
              </FieldRow>

              <FieldRow labelKey={`${prefix}.wordsPerGroup`}>
                <input
                  type="number"
                  value={maxWordsPerGroup}
                  min={2}
                  max={8}
                  onChange={(e) => onChange('max_words_per_group', Number(e.target.value))}
                  className={INPUT_CLASS}
                />
              </FieldRow>
            </>
          )}
        </div>
      </CollapsibleGroup>
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function CollapsibleGroup({
  labelKey,
  defaultOpen = false,
  children,
}: {
  labelKey: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-border-subtle rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="hover:bg-bg-hover flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-150"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-text-muted" />
        ) : (
          <ChevronRight className="h-4 w-4 text-text-muted" />
        )}
        <span className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
          {t(labelKey)}
        </span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

function FieldRow({
  labelKey,
  children,
}: {
  labelKey: string
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div>
      <label className="text-text-tertiary mb-1 block text-xs font-medium tracking-wider uppercase">
        {t(labelKey)}
      </label>
      {children}
    </div>
  )
}

function ColorSwatches({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: string }[]
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.toUpperCase() === opt.value.toUpperCase()
        const isTransparent = opt.value === '#00000000'
        return (
          <button
            key={opt.value}
            type="button"
            title={opt.label}
            onClick={() => onSelect(opt.value)}
            className="h-7 w-7 rounded-full transition-all duration-150"
            style={{
              background: isTransparent
                ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px'
                : opt.value,
              border: isSelected ? '2px solid #8b5cf6' : '2px solid transparent',
              outline: isSelected ? '2px solid rgba(139,92,246,0.3)' : 'none',
              outlineOffset: '1px',
            }}
          />
        )
      })}
    </div>
  )
}
