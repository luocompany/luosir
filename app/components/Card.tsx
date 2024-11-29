interface CardProps {
  title: string;
  description: string;
  href?: string;
  iconPath: string;
  buttonText?: string;
  isComingSoon?: boolean;
}

export default function Card({ title, description, href, iconPath, buttonText, isComingSoon }: CardProps) {
  return (
    <article className={`bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 ${isComingSoon ? '' : 'hover:scale-[1.02] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}`}>
      <div className={`text-${isComingSoon ? '[var(--foreground)]/40' : '[var(--blue-accent)]'} mb-6`}>
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <h2 className="text-xl font-medium mb-3">{title}</h2>
      <p className="text-[var(--foreground)]/60 mb-6">{description}</p>
      {!isComingSoon && href && buttonText && (
        <a 
          href={href} 
          className="inline-flex items-center px-6 py-3 bg-[var(--blue-accent)] text-white rounded-xl hover:opacity-90 transition-opacity"
          aria-label={`Navigate to ${title}`}
        >
          {buttonText}
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </article>
  );
} 