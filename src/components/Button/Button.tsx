import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@/components/Icon';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'dark' | 'line' | 'white' | 'light' | 'ghostWhite';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  icon?: string;
  iconFirst?: boolean;
  srText?: string;
  className?: string;
  children?: ReactNode;
}

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsInternalLink = CommonProps & Omit<LinkProps, 'to'> & { href: string; external?: false; download?: undefined };
type AsExternalLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string; external?: true; download?: boolean };

export type ButtonProps = AsButton | AsInternalLink | AsExternalLink;

/** 공용 버튼 — `components/btn.hbs` 대응. href가 있으면 링크(내부는 Link, external이면 <a target=_blank>)로 렌더링 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', pill, icon, iconFirst, srText, className, children, ...rest } = props;
  const cls = clsx(styles.btn, styles[variant], size !== 'md' && styles[size], pill && styles.pill, className);

  const iconEl = icon && <Icon name={icon} className={!iconFirst ? styles.iconMove : undefined} />;
  const content = (
    <>
      {iconFirst && iconEl}
      {children}
      {!iconFirst && iconEl}
      {srText && <span className="sr-only">{srText}</span>}
    </>
  );

  if ('href' in props && props.href) {
    const { href, external, download, ...anchorRest } = rest as AsExternalLink & AsInternalLink;
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener" download={download} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {content}
          {external && <span className="sr-only">(새 창 열림)</span>}
        </a>
      );
    }
    return (
      <Link to={href} className={cls} {...(anchorRest as Omit<LinkProps, 'to'>)}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
