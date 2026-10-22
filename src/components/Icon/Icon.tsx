import clsx from 'clsx';
import type { SVGAttributes } from 'react';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  name: string;
  /** 스크린리더에 알릴 텍스트. 생략하면 장식용(aria-hidden)으로 렌더링된다. */
  label?: string;
}

/** `<svg class="icon"><use href="#i-name"></use></svg>` 대응 공용 아이콘 컴포넌트 */
export default function Icon({ name, label, className, ...rest }: IconProps) {
  return (
    <svg
      className={clsx('icon', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}
