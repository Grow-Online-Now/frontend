interface ChannelBannerProps {
  channelName: string
  platform: 'youtube' | 'twitch'
  size?: 'sm' | 'lg'
  className?: string
}

export function ChannelBanner({
  channelName,
  size = 'sm',
  className = '',
}: ChannelBannerProps) {
  const height = size === 'sm' ? 'h-24' : 'h-32'
  const textSize = size === 'sm' ? 'text-2xl' : 'text-4xl'

  return (
    <div
      className={`bg-bg-elevated relative overflow-hidden rounded-t-xl ${height} ${className}`}
    >
      {/* Diagonal stripe pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
        }}
      />
      {/* Channel name watermark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-text-muted/15 select-none font-bold uppercase tracking-[0.3em] ${textSize}`}
        >
          {channelName
            .replace(/^https?:\/\/(www\.)?youtube\.com\/@?/, '')
            .replace(/^https?:\/\/(www\.)?twitch\.tv\//, '')
            .split(/[^a-zA-Z0-9]/)
            .join(' ')}
        </span>
      </div>
    </div>
  )
}
