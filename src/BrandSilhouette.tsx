import { LABEL_DROP, LABEL_HEIGHT, LABEL_SURFACE, LABEL_VIEW_BOX, LABEL_WIDTH } from './geometry'

export function BrandPaths() {
  return <><path d={LABEL_SURFACE} fill="#13100d" /><path d={LABEL_DROP} fill="#fbba00" /></>
}

export function BrandSilhouette({ className }: { className?: string }) {
  return <svg className={className} width={LABEL_WIDTH} height={LABEL_HEIGHT}
    viewBox={LABEL_VIEW_BOX} preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-brand-silhouette>
    <BrandPaths />
  </svg>
}
