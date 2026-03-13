/**
 * SubtitleVisualEditor
 * Composes SubtitleCanvas + SubtitleStyleControls.
 * Reads config from props, delegates updates to parent.
 */

import { useTranslation } from 'react-i18next'
import { SubtitleCanvas } from './SubtitleCanvas'
import { SubtitleStyleControls } from './SubtitleStyleControls'

interface SubtitleVisualEditorProps {
  nodeId: string
  config: Record<string, unknown>
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void
}

export function SubtitleVisualEditor({
  nodeId,
  config,
  updateNodeConfig,
}: SubtitleVisualEditorProps) {
  const { t } = useTranslation()

  const fontName = String(config.font_name ?? 'Arial')
  const fontSize = Number(config.font_size ?? 24)
  const textColor = String(config.text_color ?? '#FFFFFF')
  const outlineColor = String(config.outline_color ?? '#000000')
  const outlineWidth = Number(config.outline_width ?? 2)
  const bold = Boolean(config.bold ?? true)
  const uppercase = Boolean(config.uppercase ?? false)
  const position = String(config.position ?? 'bottom')
  const marginV = Number(config.margin_v ?? 60)
  const backgroundBox = Boolean(config.background_box ?? false)
  const animationStyle = String(config.animation_style ?? 'static')
  const highlightColor = String(config.highlight_color ?? '#FFFF00')
  const highlightScale = Number(config.highlight_scale ?? 1.35)
  const maxWordsPerGroup = Number(config.max_words_per_group ?? 4)
  const aspectRatio = String(config.aspect_ratio ?? '9:16')

  const handleChange = (key: string, value: unknown) => {
    updateNodeConfig(nodeId, { [key]: value })
  }

  const handlePositionChange = (pos: string, mv: number) => {
    updateNodeConfig(nodeId, { position: pos, margin_v: mv })
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
        {t('dashboard.workflows.editor.subtitleEditor.preview')}
      </label>

      <SubtitleCanvas
        fontName={fontName}
        fontSize={fontSize}
        textColor={textColor}
        outlineColor={outlineColor}
        outlineWidth={outlineWidth}
        bold={bold}
        uppercase={uppercase}
        position={position}
        marginV={marginV}
        backgroundBox={backgroundBox}
        animationStyle={animationStyle}
        highlightColor={highlightColor}
        highlightScale={highlightScale}
        aspectRatio={aspectRatio}
        onPositionChange={handlePositionChange}
      />

      <SubtitleStyleControls
        fontName={fontName}
        fontSize={fontSize}
        textColor={textColor}
        outlineColor={outlineColor}
        outlineWidth={outlineWidth}
        bold={bold}
        uppercase={uppercase}
        backgroundBox={backgroundBox}
        animationStyle={animationStyle}
        highlightColor={highlightColor}
        highlightScale={highlightScale}
        maxWordsPerGroup={maxWordsPerGroup}
        onChange={handleChange}
      />
    </div>
  )
}
