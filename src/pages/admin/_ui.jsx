// Shared UI helpers for admin pages.
import { Card, CardContent } from '@/components/ui/card';

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-900">{title}</h1>
        {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyBox({ title, body, action }) {
  return (
    <Card className="border-dashed border-2 border-slate-200 bg-white/60">
      <CardContent className="py-12 text-center">
        <p className="font-display text-xl font-semibold text-brand-900">{title}</p>
        {body && <p className="text-slate-500 mt-1">{body}</p>}
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </CardContent>
    </Card>
  );
}

export function Label({ children, htmlFor }) {
  return <label htmlFor={htmlFor} className="block text-sm font-medium text-brand-900 mb-1.5">{children}</label>;
}

export function FormField({ label, hint, children, id }) {
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}
