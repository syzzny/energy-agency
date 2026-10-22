import { Fragment, type ReactNode } from 'react';

/**
 * 데이터의 줄바꿈(\n)을 <br /> 로 바꿔 렌더링한다.
 * 줄 사이에 공백도 함께 넣어, 모바일에서 <br> 을 숨겨도 단어가 붙지 않게 한다.
 */
export function multiline(text: string): ReactNode {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && (
        <>
          {' '}
          <br />
        </>
      )}
    </Fragment>
  ));
}
